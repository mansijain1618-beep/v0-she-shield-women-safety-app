"use client"

import { useEffect, useState } from "react"
import { Phone, Clock } from "lucide-react"

interface Helpline {
  name: string
  number: string
  city?: string
  type?: string
  available: string
  description: string
}

interface HelplineModalProps {
  isOpen: boolean
  onClose: () => void
  city?: string
}

export default function HelplineModal({ isOpen, onClose, city }: HelplineModalProps) {
  const [helplines, setHelplines] = useState<Helpline[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const fetchHelplines = async () => {
        setLoading(true)
        try {
          const url = city ? `/api/helplines?city=${city}` : "/api/helplines"
          const response = await fetch(url)
          const result = await response.json()
          if (result.success) {
            setHelplines(result.data)
          }
        } catch (error) {
          console.log("[v0] Failed to fetch helplines:", error)
        }
        setLoading(false)
      }

      fetchHelplines()
    }
  }, [isOpen, city])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-primary text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{city || "National"} Helplines</h2>
          <button onClick={onClose} className="text-2xl font-bold hover:opacity-80">
            ×
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading helplines...</div>
        ) : helplines.length > 0 ? (
          <div className="p-6 space-y-4">
            {helplines.map((helpline, index) => (
              <div key={index} className="border-l-4 border-primary p-4 bg-pink-50 rounded-lg">
                <h3 className="font-bold text-foreground">{helpline.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{helpline.description}</p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <a href={`tel:${helpline.number}`} className="font-bold text-primary hover:underline">
                      {helpline.number}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-gray-700">{helpline.available}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">No helplines found for this location</div>
        )}
      </div>
    </div>
  )
}
