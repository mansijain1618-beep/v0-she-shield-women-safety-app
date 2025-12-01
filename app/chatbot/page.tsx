"use client"

import { useState, useRef, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Send, Shield, Heart, AlertCircle, BookOpen } from "lucide-react"

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
  ],
  laws: [
    "⚖️ YOUR PROTECTION LAWS:\n\n🔴 IPC 376 - Sexual assault\n🔴 IPC 354 - Outraging modesty\n🔴 Dowry Prohibition Act (1961)\n🔴 Domestic Violence Act (2005)\n🔴 POSH Act (2013) - Workplace\n\nYou have rights. We support you! ✊",
    "📜 KNOWING YOUR RIGHTS:\n\n✓ Equal treatment under law\n✓ Protection from harassment\n✓ Safe workplace environment\n✓ Legal aid services available\n✓ Anonymous reporting options\n\nStay informed, stay empowered! 🎓",
  ],
  "mental-health": [
    "💚 YOU'RE NOT ALONE - SUPPORT IS HERE:\n\n📞 Crisis Lines:\n  • iCall: 9152987821\n  • Vandrevala: 9999 666 555\n  • AASRA: 9820466726\n\n✨ Remember:\n  • Your feelings matter\n  • Help is available\n  • You can recover\n  • You're stronger than you know\n\nTake care of yourself! 🌸",
    "🧠 MENTAL WELLNESS TIPS:\n\n✓ Talk to someone you trust\n✓ Practice deep breathing\n✓ Take breaks when needed\n✓ Eat well, sleep well\n✓ Exercise regularly\n✓ Seek professional help\n\nYour mental health matters! 💫",
  ],
  "self-defense": [
    "🥋 PERSONAL SAFETY ESSENTIALS:\n\n✓ Be aware of surroundings\n✓ Trust your gut feeling\n✓ Carry whistle/alarm\n✓ Share location with trusted ones\n✓ Yell 'FIRE' not 'HELP'\n✓ Travel in groups\n✓ Take classes\n\nYou're powerful! 💪",
    "🛡️ SAFETY HABITS TO BUILD:\n\n📱 Tech safety:\n  • Fake GPS location\n  • Trusted app alerts\n  • Emergency contacts saved\n\n🚶 Daily habits:\n  • Vary your route\n  • Stay alert\n  • Keep phone charged\n  • Share plans with friends\n\nStay smart, stay safe! 🌟",
  ],
  hi: ["👋 Hey there! I'm so happy you're here. What can I help with today? 💕"],
  hello: ["🤗 Hello! I'm your 24/7 supportive friend. How are you? What do you need? 💞"],
  thanks: ["🙏 You're so welcome! Remember - you matter, you're worthy, and I'm always here. 💖"],
  help: ["🤝 Of course! I'm here to help. Tell me what's on your mind - I'm listening with an open heart. 💗"],
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
      text: "typing...",
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
    }, 600)
  }

  const handleQuickReply = (reply: string) => {
    setInput(reply)
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl animate-blob-float"></div>
        <div
          className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-primary/15 rounded-full blur-3xl animate-blob-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-tl from-accent/10 to-secondary/15 rounded-full blur-3xl animate-float-smooth"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <Navbar />

      <div className="relative z-10 flex flex-col h-screen">
        {/* Category Selection */}
        <div className="px-4 md:px-8 py-6 border-b border-border/50">
          <p className="text-sm font-semibold text-muted-foreground mb-3">Choose a topic:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {CHAT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`p-3 rounded-xl transition-smooth border-2 animate-slide-up ${
                  selectedCategory === cat.id
                    ? `border-primary bg-gradient-to-br ${cat.color}`
                    : "border-border/50 bg-card/50 hover:border-primary/50"
                }`}
              >
                <p className="font-semibold text-sm text-foreground">{cat.label}</p>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {message.isTyping ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-card rounded-2xl rounded-bl-none">
                  <div className="w-2 h-2 bg-primary rounded-full animate-typing-cursor"></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-typing-cursor"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-typing-cursor"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              ) : (
                <div
                  className={`max-w-sm px-4 py-3 rounded-2xl whitespace-pre-wrap ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-br-none"
                      : "bg-card text-foreground rounded-bl-none border border-border/50"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {selectedCategory && QUICK_REPLIES[selectedCategory as keyof typeof QUICK_REPLIES] && (
          <div className="px-4 md:px-8 py-4 border-t border-border/50 flex gap-2 overflow-x-auto">
            {QUICK_REPLIES[selectedCategory as keyof typeof QUICK_REPLIES].map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickReply(reply)}
                className="px-3 py-2 bg-card border border-border/50 rounded-full text-sm font-medium hover:border-primary/50 hover:bg-card/80 transition-smooth whitespace-nowrap animate-slide-in-right"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="px-4 md:px-8 py-6 border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message... 💬"
              className="flex-1 px-4 py-3 bg-card border-2 border-border/50 rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="p-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full hover:scale-110 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed animate-glow-border"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
