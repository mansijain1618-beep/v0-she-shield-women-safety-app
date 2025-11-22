"use client"

import { useState, useRef, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Send, MessageCircle } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  text: string
}

const BOT_RESPONSES: { [key: string]: string } = {
  "women rights":
    "Women have equal rights under the law. Key rights include: freedom from discrimination, equal access to education and employment, bodily autonomy, and protection from harassment and violence.",
  emergency:
    "In an emergency, call 911 immediately. If you are in danger, move to a safe location first if possible. Tell authorities your location, situation, and any immediate threats.",
  harassment:
    "If you experience harassment: Document incidents, tell a trusted person, report to relevant authorities, and consider blocking/reporting on social media. You have the right to feel safe.",
  "mental health":
    'Mental health support is important. Resources: National helpline 1-800-950-NAMI, crisis text "HELLO" to 741741, or visit NAMI.org. Professional therapy and support groups can help.',
  law: "Women safety laws include: Title IX for education, anti-discrimination laws, harassment protection, and stalking prevention laws. Specific laws vary by state.",
  "self defense":
    "Self-defense tips: Stay aware of surroundings, trust your instincts, take a self-defense class, carry personal alarm, and know escape routes. Prioritize getting to safety over confrontation.",
  safety:
    "Stay safe by: Sharing your location with trusted people, avoiding isolated areas, keeping phone charged, having an emergency contact, and trusting your instincts.",
  default:
    "I'm here to help with women safety information. Ask me about women rights, emergency procedures, mental health resources, self-defense, or any safety concerns.",
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      type: "bot",
      text: "Hello! I'm SheShield Assistant. I can help you with information about women safety laws, emergency rights, mental health support, and more. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    for (const [key, response] of Object.entries(BOT_RESPONSES)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        return response
      }
    }

    return BOT_RESPONSES["default"]
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: getBotResponse(input),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50">
      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8 h-screen flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
          <h1 className="text-4xl font-bold text-primary mb-2">SheShield AI Chatbot</h1>
          <p className="text-gray-600 mb-6">Get instant answers about safety, rights, and emergency procedures</p>

          {/* Chat Container */}
          <div className="flex-1 bg-white rounded-2xl shadow-md border-2 border-pink-100 p-6 overflow-y-auto mb-4 flex flex-col">
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
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-pink-50 text-foreground rounded-bl-none border-2 border-pink-100"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask me about women safety, rights, or emergency procedures..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:border-primary bg-white"
            />
            <button
              onClick={handleSendMessage}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
