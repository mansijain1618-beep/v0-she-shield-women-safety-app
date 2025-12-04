"use client"

import { useState, useRef, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Send, AlertCircle, Shield, Heart, BookOpen } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  text: string
  isTyping?: boolean
}

const CHAT_CATEGORIES = [
  {
    id: "emergency",
    label: "🚨 Emergency",
    icon: AlertCircle,
    color: "from-red-500/20 to-red-400/10",
    description: "Immediate help",
  },
  {
    id: "laws",
    label: "⚖️ Laws & Rights",
    icon: Shield,
    color: "from-primary/20 to-secondary/10",
    description: "Know your rights",
  },
  {
    id: "mental-health",
    label: "💚 Mental Health",
    icon: Heart,
    color: "from-accent/20 to-primary/10",
    description: "Need support?",
  },
  {
    id: "self-defense",
    label: "🥋 Self-Defense",
    icon: BookOpen,
    color: "from-secondary/20 to-accent/10",
    description: "Stay safe",
  },
]

const QUICK_REPLIES = {
  emergency: ["🚨 Call 100", "📍 Nearby police", "📞 Emergency contacts", "❓ What to do?"],
  laws: ["👩‍⚖️ Women's rights", "💼 Harassment laws", "🏢 Workplace protection", "📋 Legal aid"],
  "mental-health": ["🧘 Stress relief", "💬 Need support", "☎️ Crisis helpline", "👥 Counseling"],
  "self-defense": ["🛡️ Basic tips", "📍 Classes nearby", "🔧 Self-defense tools", "👜 What to carry?"],
}

const BOT_RESPONSES: { [key: string]: string[] } = {
  emergency: [
    "🚨 IMMEDIATE SAFETY - YOU'RE BRAVE!\n\n✓ Move to safety NOW\n✓ Call 100 (Police)\n✓ Tell exact location\n✓ Stay on line\n✓ Contact trusted person\n\nYou matter. Help is coming! 💪",
    "⚠️ IN AN EMERGENCY?\n\n📱 Call 100 immediately\n🏃 Go to nearby:\n  • Police station\n  • Hospital\n  • Public place with people\n  • Trusted friend's house\n\nYour safety is priority #1! 🛡️",
    "🆘 Remember - You are SAFE here:\n\n1️⃣ Trust your instinct\n2️⃣ Get to a safe location\n3️⃣ Contact authorities\n4️⃣ Tell someone you trust\n\nI'm here for you always! 💖",
  ],
  laws: [
    "⚖️ YOUR PROTECTION LAWS:\n\n🔴 IPC 376 - Sexual assault\n🔴 IPC 354 - Outraging modesty\n🔴 Dowry Prohibition Act (1961)\n🔴 Domestic Violence Act (2005)\n🔴 POSH Act (2013) - Workplace\n\nYou have rights. We support you! ✊",
    "📜 KNOWING YOUR RIGHTS:\n\n✓ Equal treatment under law\n✓ Protection from harassment\n✓ Safe workplace environment\n✓ Legal aid services available\n✓ Anonymous reporting options\n\nStay informed, stay empowered! 🎓",
    "⚖️ WOMEN'S PROTECTION LAWS:\n\n✅ Right to safety\n✅ Right to justice\n✅ Right to legal support\n✅ Right to counseling\n✅ Right to anonymity\n\nWe believe you. Your case matters! 💜",
  ],
  "mental-health": [
    "💚 YOU'RE NOT ALONE - SUPPORT IS HERE:\n\n📞 Crisis Lines:\n  • iCall: 9152987821\n  • Vandrevala: 9999 666 555\n  • AASRA: 9820466726\n\n✨ Remember:\n  • Your feelings matter\n  • Help is available\n  • You can recover\n  • You're stronger than you know\n\nTake care of yourself! 🌸",
    "🧠 MENTAL WELLNESS TIPS:\n\n✓ Talk to someone you trust\n✓ Practice deep breathing\n✓ Take breaks when needed\n✓ Eat well, sleep well\n✓ Exercise regularly\n✓ Seek professional help\n\nYour mental health matters! 💫",
    "💗 HEALING TAKES TIME:\n\nBe kind to yourself:\n✨ Feel your emotions\n✨ Don't rush recovery\n✨ Reach out for help\n✨ Celebrate small wins\n✨ Practice self-care\n\nYou're doing great! 🌟",
  ],
  "self-defense": [
    "🥋 PERSONAL SAFETY ESSENTIALS:\n\n✓ Be aware of surroundings\n✓ Trust your gut feeling\n✓ Carry whistle/alarm\n✓ Share location with trusted ones\n✓ Yell 'FIRE' not 'HELP'\n✓ Travel in groups\n✓ Take classes\n\nYou're powerful! 💪",
    "🛡️ SAFETY HABITS TO BUILD:\n\n📱 Tech safety:\n  • Fake GPS location\n  • Trusted app alerts\n  • Emergency contacts saved\n\n🚶 Daily habits:\n  • Vary your route\n  • Stay alert\n  • Keep phone charged\n  • Share plans with friends\n\nStay smart, stay safe! 🌟",
    "🔐 PERSONAL SAFETY CHECKLIST:\n\n✅ Know your surroundings\n✅ Tell someone where you're going\n✅ Keep phone charged\n✅ Have emergency contacts ready\n✅ Learn basic self-defense\n✅ Trust your intuition\n\nEmpower yourself! 💪",
  ],
  hi: ["👋 Hey beautiful! I'm so happy you're here. How can I help you today? 💕"],
  hello: ["🤗 Hello friend! I'm here 24/7 for you. What's on your mind? 💞"],
  thanks: ["🙏 You're so welcome! Remember - you matter, you're worthy, and I'm always here. 💖"],
  help: ["🤝 Of course! I'm here to listen and help. Tell me what's going on - I care. 💗"],
  bye: ["👋 Take care of yourself! Remember, you're never alone. Come back anytime. 💖"],
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      type: "bot",
      text: "👋 Hey beautiful! I'm SheShield - your supportive friend 24/7.\n\n💪 I'm here for:\n✨ Emergency guidance\n✨ Legal information\n✨ Self-defense tips\n✨ Mental health support\n\nWhat do you need today? You're safe here. 💗",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim()

    for (const [key, responses] of Object.entries(BOT_RESPONSES)) {
      if (lowerMessage.includes(key)) {
        return responses[Math.floor(Math.random() * responses.length)]
      }
    }

    return "💬 I'm here to help! Try asking about:\n\n🚨 Emergency procedures\n⚖️ Laws and rights\n💚 Mental health support\n🥋 Self-defense tips\n\nYou've got this! 💪"
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    const typingMessage: Message = {
      id: (Date.now() + 0.5).toString(),
      type: "bot",
      text: "✍️ Typing...",
      isTyping: true,
    }
    setMessages((prev) => [...prev, typingMessage])

    const botResponseText = getBotResponse(input)

    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => !msg.isTyping))

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: botResponseText,
      }
      setMessages((prev) => [...prev, botMessage])
      setLoading(false)
    }, 800)
  }

  const handleQuickReply = (reply: string) => {
    setInput(reply)
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-200px)] flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 rounded-2xl bg-card/30 backdrop-blur-sm p-6 border-2 border-primary/20">
          {messages.map((message, idx) => (
            <div
              key={message.id}
              className={`animate-slide-up ${message.type === "user" ? "flex justify-end" : "flex justify-start"}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div
                className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-lg transition-all ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-primary to-secondary text-white rounded-br-none"
                    : "bg-card border-2 border-primary/30 text-foreground rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {selectedCategory && QUICK_REPLIES[selectedCategory as keyof typeof QUICK_REPLIES] && (
          <div className="mb-6 animate-slide-up">
            <p className="text-sm text-muted-foreground mb-3 font-semibold">💬 Quick Replies:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES[selectedCategory as keyof typeof QUICK_REPLIES].map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleQuickReply(reply)
                    setSelectedCategory(null)
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-primary/30 to-secondary/30 hover:from-primary/50 hover:to-secondary/50 text-foreground rounded-full text-sm font-semibold transition-all hover:scale-105 border-2 border-primary/20"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-4">
          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CHAT_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`p-4 rounded-xl transition-all transform hover:scale-105 border-2 font-semibold text-sm ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-br from-primary to-secondary text-white border-primary shadow-lg"
                    : `bg-gradient-to-br ${category.color} border-primary/20 text-foreground hover:border-primary/50`
                }`}
              >
                {category.label}
                <p className="text-xs opacity-70 mt-1">{category.description}</p>
              </button>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="💭 Type your message or concern..."
              className="flex-1 px-6 py-3 bg-card border-2 border-primary/30 rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground transition-all"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
