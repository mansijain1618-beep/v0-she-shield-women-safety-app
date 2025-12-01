"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { AlertCircle } from "lucide-react"

export default function CommunityAlertsPage() {
  const [reportType, setReportType] = useState("suspicious")

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-to-l from-purple-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <Navbar />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--primary)" }}>
            Community Safety Alerts
          </h1>
          <p style={{ color: "var(--foreground)", opacity: 0.7 }} className="mb-8">
            Report incidents and stay informed about local safety issues
          </p>
        </div>

        {/* Report form */}
        <div
          className="backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8 border-2 border-accent/20 animate-slide-up"
          style={{ animationDelay: "0.2s", backgroundColor: "var(--card)/80" }}
        >
          <button
            className="w-full flex items-center justify-center gap-3 text-white py-4 px-6 rounded-xl font-bold hover:shadow-2xl transition"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <AlertCircle className="w-6 h-6" />
            Report an Incident
          </button>
        </div>

        <div
          className="rounded-2xl p-6 shadow-md border-2 border-primary/30"
          style={{ backgroundColor: "var(--card)" }}
        >
          <p style={{ color: "var(--foreground)", opacity: 0.7 }} className="text-center">
            No reports yet. Help keep our community safe!
          </p>
        </div>
      </div>
    </div>
  )
}
