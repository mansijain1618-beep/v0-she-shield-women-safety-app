"use client"

import { useState, useRef, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Send, MessageCircle, HelpCircle } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  text: string
}

interface LawInfo {
  name: string
  description: string
  punishment: string
}

const BOT_RESPONSES: { [key: string]: string[] } = {
  "women rights": [
    "Hey! You deserve to know your rights. In India, women are protected under several laws:\n\n• Constitution Article 14 & 15: Equal rights\n• Dowry Prohibition Act: No demands for dowry\n• Protection of Women from Domestic Violence Act (2005)\n• Sexual Harassment of Women at Workplace Act (2013)\n• Equal Remuneration Act: Same pay for same work\n\nYour dignity and safety matter!",
    "India has strong laws protecting women. You have the right to:\n• Work without harassment\n• Live free from violence\n• Get equal education\n• Report crimes without fear\n• Seek justice and support\n\nDon't hesitate to reach out to authorities if your rights are violated!",
  ],
  emergency: [
    "If you're in immediate danger:\n\n🚨 EMERGENCY NUMBERS (India):\n• Police: 100\n• Women Helpline: 1091 (Delhi), 1090 (nationwide)\n• AASRA Helpline: 9820466726\n• iCall Crisis Line: 9152987821\n• Vandrevala Foundation: 9999 666 555\n\nStay calm, move to safety, and don't hesitate to call. Help is just a call away!",
    "Don't worry, you're not alone. In an emergency:\n1. Move to a safe place\n2. Call 100 for police\n3. Tell them your exact location\n4. Stay on the line\n5. Contact a trusted person\n\nYour safety is the priority. Always!",
    "QUICK HELPLINES FOR YOU:\n• National Women Helpline: 1090 (24/7)\n• Anti-Human Trafficking: 1800 111 555\n• POCSO Helpline: 9555 000 777\n• Cyber Crime: 1930\n\nYou're brave for seeking help!",
  ],
  harassment: [
    "I'm sorry you're going through this. Here's what you can do:\n\n✓ Document everything (dates, times, witnesses)\n✓ Tell someone you trust\n✓ Keep messages/evidence safe\n✓ File a formal complaint at the nearest police station\n✓ Contact POSH (Prevention of Sexual Harassment) in your workplace\n✓ Use WhatsApp, email - create a record\n\nYou have every right to be heard and protected!",
    "Harassment is NOT your fault. Here's your power move:\n\n• Stop communication with the harasser\n• Report to HR/Management (if workplace)\n• File FIR (First Information Report) at police station\n• Contact women's organizations for support\n• Keep screenshots, recordings, messages\n• Seek legal aid if needed\n\nYou deserve respect and safety. Always.",
  ],
  "mental health": [
    "Your mental health matters as much as your safety. Here are trusted resources:\n\n🆘 CRISIS SUPPORT:\n• iCall: 9152987821 or www.icallhelpline.org\n• Vandrevala Foundation: 9999 666 555\n• AASRA: 9820466726\n• Connecting Hearts: +91 9820 100 108\n\n💚 Professional Support:\n• Psychology Today (therapist finder)\n• NMHP services across India\n• NIMHANS Bangalore counselling\n\nTalking helps! You're not weak, you're wise.",
    "Hey! It's okay to not be okay. Remember:\n\n✨ Speaking to someone helps\n✨ You're not alone\n✨ Professional help is available\n✨ Online therapy is accessible\n✨ Healing takes time\n\nMental health apps: Wysa, Sanvello, BetterHelp\nFree helplines available 24/7\n\nYou matter! Take care of yourself.",
  ],
  law: [
    "Important Indian laws protecting women:\n\n📜 KEY LAWS:\n• IPC 354: Outraging modesty\n• IPC 376: Sexual assault (min 7 years jail)\n• IPC 509: Insult to modesty\n• Dowry Prohibition Act (1961)\n• Protection Against Domestic Violence Act (2005)\n• POSH Act (2013) - Workplace protection\n• POCSO Act (2012) - Child protection\n• Stalking laws: IPC 354D\n\nKnow your rights! Contact your nearest police station or legal aid.",
  ],
  "self defense": [
    "Self-defense is your RIGHT! Here's what helps:\n\n🥋 PRACTICAL TIPS:\n• Take a self-defense class (many free in communities)\n• Stay aware of surroundings\n• Trust your gut instinct\n• Don't be polite if unsafe\n• Yell 'FIRE' not 'HELP' (people respond faster)\n• Carry self-defense: whistle, alarm, keys\n• Share your location with trusted people\n• Travel in groups when possible\n\nYour safety matters. Learn & practice!",
  ],
  safety: [
    "Here's your personal safety checklist:\n\n✅ DAILY SAFETY:\n• Share live location with 2-3 trusted people\n• Keep phone charged (power bank with you)\n• Trust your instincts - always!\n• Avoid isolated routes/timings\n• Tell someone where you're going & expected time\n• Keep emergency contacts saved\n• Report suspicious behavior\n• Don't share personal details with strangers\n\nYou're worth protecting! Stay alert, stay safe.",
  ],
  delhi: [
    "Delhi Safety Info:\n\n📍 HELP IN DELHI:\n• Women Helpline: 1091 or 011-4141 7343\n• Delhi Police: 100\n• Women's shelter: Shakti Sadan (011-3328 5995)\n• One-stop centers at major hospitals\n• Safe commute: Use Delhivery, Uber, Ola verified options\n\nDelhi is your city - stay safe in it!",
  ],
  mumbai: [
    "Mumbai Safety Info:\n\n📍 HELP IN MUMBAI:\n• Women Helpline: 1090 or 22-6169 4438\n• Mumbai Police: 100\n• Aasra Helpline: 9820466726\n• Women's center: Anubandhan\n• Metro has reserved women's coaches\n\nMumbai's energy is powerful - use it wisely!",
  ],
  bangalore: [
    "Bangalore Safety Info:\n\n📍 HELP IN BANGALORE:\n• Women Helpline: 1090 or 080-4945 6886\n• Bangalore Police: 100\n• Women's cell: 080-2255 2999\n• Cybercrime cell: For online harassment\n\nBangalore is tech-forward - use apps for safety!",
  ],
  hi: [
    "Hey there, friend! 👋 Welcome to your safe space. I'm here whenever you need:\n\n• Emergency guidance\n• Safety tips and tricks\n• Information about laws protecting you\n• Support & encouragement\n• Resources and helplines\n• Just someone to talk to\n\nWhat's on your mind? I'm listening.",
    "Hi! So glad you're here. I'm like a supportive friend who knows about safety, rights, and resources. Ask me about:\n\n💪 Safety tips\n⚖️ Your legal rights\n🆘 Emergency procedures\n💚 Mental health support\n🏙️ City-specific help\n\nYou're safe here. What do you need?",
  ],
  hello: [
    "Hey, hello! I'm so happy to chat with you. Think of me as your supportive friend who's always here. Tell me:\n\n• What worries you?\n• Need emergency info?\n• Want to know your rights?\n• Looking for support?\n• Just want to talk?\n\nI'm all ears! No judgment.",
  ],
  help: [
    "I'm here to help! You can ask me about:\n\n🚨 Emergency helplines and procedures\n⚖️ Women's rights and laws in India\n🛡️ Personal safety tips\n📍 City-specific resources (Delhi, Mumbai, etc.)\n💚 Mental health support\n💬 Handling harassment/abuse\n🥋 Self-defense tips\n\nWhat do you need right now? I'm listening.",
  ],
  support: [
    "You're not alone. I'm here to support you!\n\nWhatever you're facing:\n✨ I believe you\n✨ It's not your fault\n✨ You deserve help\n✨ Your feelings are valid\n✨ There are resources available\n✨ You're stronger than you think\n\nWant to talk about what's happening? I'm here.",
  ],
  scared: [
    "It's okay to be scared. That feeling means you're aware. Here's what to do:\n\n✓ Find a safe place RIGHT NOW\n✓ Call 100 (police) or 1091 (women helpline)\n✓ Tell a trusted person where you are\n✓ Stay on call with someone\n✓ Don't confront the threat\n✓ Document everything\n\nYou're brave. You will get through this. I'm here.",
  ],
  lonely: [
    "You're not alone. Even when it feels that way, there are thousands like you, and there's a whole community ready to support.\n\n💚 REACH OUT:\n• iCall: 9152987821 (anytime)\n• Talk to a friend or family\n• Join women's groups in your area\n• Try community centers\n• Online support groups\n\nYour company matters. Your voice matters. You matter.",
  ],
  thanks: [
    "You're welcome, friend! I'm always here whenever you need me. Remember:\n\n✨ You're strong\n✨ Your safety matters\n✨ Help is a phone call away\n✨ You deserve the best\n\nTake care of yourself!",
  ],
  default: [
    "I hear you, friend! I might not have a specific answer, but I'm here to help. I can tell you about:\n\n🆘 Emergency procedures & helplines\n⚖️ Your rights and laws\n🛡️ Safety tips and strategies\n🏙️ Help in different Indian cities\n💚 Mental health resources\n🥋 Self-defense tips\n\nAsk me anything!",
  ],
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      type: "bot",
      text: "Hey there! I'm SheShield - your supportive friend and safety guide. I'm here 24/7 for you. Whether you need emergency help, legal info, safety tips, or just someone to talk to... I've got your back!\n\nWhat can I help you with today?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchLawsFromAPI = async (): Promise<string> => {
    try {
      const response = await fetch("/api/laws")
      const result = await response.json()
      if (result.success && result.laws && result.laws.length > 0) {
        const lawsSummary = result.laws
          .slice(0, 5)
          .map((law: LawInfo) => `• ${law.name}: ${law.description}\n  Punishment: ${law.punishment}`)
          .join("\n\n")
        return `Here are the key Indian laws protecting women:\n\n${lawsSummary}\n\nFor complete information, visit our Resources page!`
      }
    } catch (error) {
      console.log("[v0] Failed to fetch laws from API:", error)
    }
    return ""
  }

  const getBotResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase().trim()

    if (
      lowerMessage.includes("law") ||
      lowerMessage.includes("legal") ||
      lowerMessage.includes("rights") ||
      lowerMessage.includes("act") ||
      lowerMessage.includes("ipc")
    ) {
      const apiResponse = await fetchLawsFromAPI()
      if (apiResponse) {
        return apiResponse
      }
    }

    // Check for exact phrase matches
    for (const [key, responses] of Object.entries(BOT_RESPONSES)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        const responseArray = Array.isArray(responses) ? responses : [responses]
        return responseArray[Math.floor(Math.random() * responseArray.length)]
      }
    }

    // Return random default response
    const defaultResponses = Array.isArray(BOT_RESPONSES["default"])
      ? BOT_RESPONSES["default"]
      : [BOT_RESPONSES["default"]]
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    const botResponseText = await getBotResponse(input)

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: botResponseText,
      }
      setMessages((prev) => [...prev, botMessage])
      setLoading(false)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8 h-screen flex flex-col relative z-10">
        <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
          <div className="mb-6 animate-slide-down">
            <h1 className="text-4xl font-bold text-primary mb-2">SheShield AI Friend</h1>
            <p className="text-muted-foreground">Your supportive friend for safety, rights, and emergency help</p>
          </div>

          {/* Chat Container */}
          <div className="flex-1 bg-card rounded-2xl shadow-md border-2 border-primary/30 p-6 overflow-y-auto mb-4 flex flex-col animate-fade-in">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 mb-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "bot" && (
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                )}

                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl whitespace-pre-wrap ${
                    message.type === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-pink-50 text-foreground rounded-bl-none border-2 border-pink-100"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="bg-pink-50 text-foreground rounded-2xl rounded-bl-none border-2 border-pink-100 px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask me anything... (emergency, rights, city help, support, etc)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !loading && handleSendMessage()}
              disabled={loading}
              className="flex-1 px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:border-primary bg-white disabled:opacity-60"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition flex items-center justify-center disabled:opacity-60"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Help Hint */}
          <div className="mt-4 p-3 bg-pink-50 rounded-lg flex items-start gap-2">
            <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">
              Try asking about: emergency, laws, self defense, mental health, city-specific help, or just talk to me!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
