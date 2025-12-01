"use client"

import { useState, useRef, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Send, MessageCircle, HelpCircle } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  text: string
}

// (BOT_RESPONSES same as your original - keep it as is)
const BOT_RESPONSES: { [key: string]: string[] } = {
  // ... (copy your BOT_RESPONSES object here unchanged)
  // for brevity in this snippet, keep the original BOT_RESPONSES content
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      type: "bot",
      text:
        "Hey there! I'm SheShield - your supportive friend and safety guide. I'm here 24/7 for you. Whether you need emergency help, legal info, safety tips, or just someone to talk to... I've got your back!\n\nWhat can I help you with today?",
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
          .map((law: any) => `• ${law.name}: ${law.description}\n  Punishment: ${law.punishment}`)
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

    for (const [key, responses] of Object.entries(BOT_RESPONSES)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        const responseArray = Array.isArray(responses) ? responses : [responses]
        return responseArray[Math.floor(Math.random() * responseArray.length)]
      }
    }

    const defaultResponses = Array.isArray(BOT_RESPONSES["default"]) ? BOT_RESPONSES["default"] : [BOT_RESPONSES["default"]]
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
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
    <div className="min-h-screen bg-[#F8F5FF] dark:bg-[#0C0017] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#7C3AED]/8 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#4F46E5]/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8 h-screen flex flex-col relative z-10">
        <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
          <div className="mb-6 animate-slide-down">
            <h1 className="text-4xl font-bold text-[#7C3AED] mb-2">SheShield AI Friend</h1>
            <p className="text-gray-600 dark:text-gray-300">Your supportive friend for safety, rights, and emergency help</p>
          </div>

          {/* Chat Container */}
          <div className="flex-1 bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-2xl shadow-md border border-[#6D28D9]/30 p-6 overflow-y-auto mb-4 flex flex-col" style={{ boxShadow: "0 0 15px rgba(79,70,229,0.14)" }}>
            <div className="flex items-center gap-4 mb-4">
              <img src="/illustrations/chatbot-character.png" alt="chatbot" className="w-16 h-16 rounded-lg" />
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">SheShield AI Friend</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">Ask about emergency, laws, self defence, or get emotional support</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  {message.type === "bot" && (
                    <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                  )}

                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl whitespace-pre-wrap ${message.type === "user" ? "bg-[#7C3AED] text-white rounded-br-none" : "bg-[#F7EEFF] text-[#4F46E5] rounded-bl-none border border-[#F0E9FF]"}`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="bg-[#F7EEFF] text-[#4F46E5] rounded-2xl rounded-bl-none border border-[#F0E9FF] px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask me anything... (emergency, rights, city help, support)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !loading && handleSendMessage()}
              disabled={loading}
              className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:border-[#7C3AED] bg-white"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-95 transition disabled:opacity-60"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Help Hint */}
          <div className="mt-4 p-3 bg-[#F7EEFF] rounded-lg flex items-start gap-2 border border-[#F0E9FF]">
            <HelpCircle className="w-5 h-5 text-[#7C3AED] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">Try asking: emergency, laws, self defence, mental health, city-specific help, or just talk to me.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
