"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Heart, Check, Clock } from "lucide-react"

interface CheckInLog {
  id: string
  timestamp: string
  location: string
  status: "safe" | "delayed" | "pending"
}

export default function CheckInPage() {
  const [checkInLogs, setCheckInLogs] = useState<CheckInLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    // Load check-in logs from localStorage
    const saved = localStorage.getItem("checkInLogs")
    if (saved) {
      setCheckInLogs(JSON.parse(saved))
    }
  }, [])

  const handleCheckIn = () => {
    const newLog: CheckInLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      location: location || "Current Location",
      status: "safe",
    }

    const updated = [newLog, ...checkInLogs]
    setCheckInLogs(updated)
    localStorage.setItem("checkInLogs", JSON.stringify(updated))

    setLocation("")
    setNotes("")
    setShowForm(false)

    // Show success notification
    alert("Check-in sent to trusted contacts! ✓")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50">
      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-2">Check-In System</h1>
          <p className="text-gray-600 mb-8">Send "I reached safely" notifications to your trusted contacts</p>

          {/* Check-In Form */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-8 border-2 border-pink-100">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 px-6 rounded-xl font-bold hover:bg-opacity-90 transition"
              >
                <Heart className="w-6 h-6" />
                Send Check-In Notification
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Current Location</label>
                  <input
                    type="text"
                    placeholder="Enter your current location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-pink-100 rounded-lg focus:outline-none focus:border-primary bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Notes (Optional)</label>
                  <textarea
                    placeholder="Add any additional message..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-pink-100 rounded-lg focus:outline-none focus:border-primary bg-white resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCheckIn}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Send Check-In
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 text-foreground py-3 rounded-xl font-bold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Check-In History */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Recent Check-Ins</h2>
            {checkInLogs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-md border-2 border-pink-100">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No check-ins yet. Send your first one to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {checkInLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-white rounded-2xl p-4 shadow-md border-2 border-pink-100 flex items-start justify-between"
                  >
                    <div>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        {log.location}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        {log.timestamp}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
