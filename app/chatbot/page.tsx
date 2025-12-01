"use client"

import { useState, useRef, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Send, MessageCircle } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  text: string
}

const BOT_RESPONSES: { [key: string]: string[] } = {
  hello: ["Hi! I'm here to help you stay safe. What do you need?", "Hey there! How can I support you today?"],
  emergency: ["Call 100 for police immediately!", "Emergency? Dial 100 now!"],
  law: ["Check our Resources page for detailed Indian laws protecting women"],
  default: ["I'm here for you. Can you tell me more?", "Stay safe! Need specific help?"],
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      type: "bot",
      text: "Hey there! I'm SheShield - your supportive friend and safety guide. I'm here 24/7 for you.",
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

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim()
    for (const [key, responses] of Object.entries(BOT_RESPONSES)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        return responses[Math.floor(Math.random() * responses.length)]
      }
    }
    return BOT_RESPONSES["default"][0]
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    const botResponseText = getBotResponse(input)

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
    <div
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <Navbar />

      <div className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col">
        <div className="animate-slide-down" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--primary)" }}>
            SheShield AI Friend
          </h1>
          <p style={{ color: "var(--foreground)", opacity: 0.7 }}>Your 24/7 safety companion</p>
        </div>

        {/* Message container */}
        <div
          className="flex-1 rounded-2xl p-6 shadow-lg border-2 border-primary/20 mb-6 overflow-y-auto animate-fade-in"
          style={{ animationDelay: "0.2s", backgroundColor: "var(--card)/50" }}
        >
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`mb-4 animate-slide-up ${msg.type === "user" ? "text-right" : "text-left"}`}
              style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
            >
              <div className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                {msg.type === "bot" && (
                  <div
                    className="w-10 h-10 rounded-full text-white flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl whitespace-pre-wrap ${msg.type === "user" ? "text-white rounded-br-none" : "rounded-bl-none border border-primary/30"}`}
                  style={{
                    backgroundColor: msg.type === "user" ? "var(--primary)" : "var(--accent)/20",
                    color: msg.type === "user" ? "white" : "var(--foreground)",
                  }}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !loading && handleSendMessage()}
            disabled={loading}
            className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            style={{ backgroundColor: "white", color: "black" }}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-60"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
