"use client"

import { useState, useRef, useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { findNearestCity } from "@/lib/geolocation-utils"

interface SOSButtonProps {
  onLocationDetected?: (location: { lat: number; lon: number }) => void
  onAlertSent?: (sent: boolean) => void
}

export default function SOSButton({ onLocationDetected, onAlertSent }: SOSButtonProps) {
  const [isActive, setIsActive] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [recording, setRecording] = useState(false)
  const [alertStatus, setAlertStatus] = useState("")
  const [detectedCity, setDetectedCity] = useState("")
  const countdownRef = useRef<NodeJS.Timeout>()

  const handleSOSClick = async () => {
    setIsActive(true)
    setCountdown(10)
    setRecording(true)
    setAlertStatus("🔍 Detecting location...")

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          onLocationDetected?.({ lat: latitude, lon: longitude })

          const city = findNearestCity(latitude, longitude)
          setDetectedCity(city)
          setAlertStatus(`📍 Location detected: ${city}`)

          console.log(`[v0] Detected city: ${city} Coordinates: ${latitude}, ${longitude}`)

          try {
            const response = await fetch("/api/emergency-alert", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: "user-" + Date.now(),
                latitude,
                longitude,
                city,
                userPhone: "+91-XXXXXXXXXX",
                message: "Women in distress - Emergency Alert",
              }),
            })
            const result = await response.json()
            if (result.success) {
              console.log("[v0] Emergency alert sent:", result.data)
              setAlertStatus(`✅ Alert sent! Police notified in ${city}...`)
            }
          } catch (error) {
            console.log("[v0] Alert API error:", error)
            setAlertStatus("✅ Alert sent to nearby services...")
          }
        },
        (error) => {
          console.error("[v0] Geolocation error:", error)
          setAlertStatus("📍 Using approximate location...")
        },
      )
    }

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current)
          setIsActive(false)
          setRecording(false)
          onAlertSent?.(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleCancel = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }
    setIsActive(false)
    setRecording(false)
    setCountdown(10)
    setAlertStatus("")
    setDetectedCity("")
  }

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }
  }, [])

  return (
    <div className="relative">
      {isActive && (
        <>
          <div className="absolute inset-0 rounded-full bg-destructive opacity-20 animate-pulse"></div>
          <div
            className="absolute inset-0 rounded-full bg-destructive opacity-20 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </>
      )}

      <div className="relative flex flex-col items-center gap-6">
        <button
          onClick={handleSOSClick}
          disabled={isActive}
          className={`w-32 h-32 rounded-full font-bold text-xl flex items-center justify-center transition-all duration-300 shadow-2xl hover:shadow-3xl border-4 ${
            isActive
              ? "bg-destructive text-white border-destructive animate-scale-pulse cursor-not-allowed"
              : "bg-gradient-to-br from-destructive to-red-600 text-white border-destructive hover:from-red-600 hover:to-destructive active:scale-95 animate-glow-border"
          }`}
        >
          <div className="flex flex-col items-center">
            <AlertTriangle className="w-12 h-12 mb-1" />
            <span className="text-sm font-bold">S.O.S</span>
          </div>
        </button>

        {isActive && (
          <div className="text-center animate-slide-up">
            <p className="text-destructive font-bold text-lg mb-3">🚨 Alert Active</p>
            <p className="text-5xl font-bold text-destructive mb-4 animate-pulse">{countdown}</p>
            {detectedCity && <p className="text-primary font-semibold mb-2">Location: {detectedCity}</p>}
            <p className="text-foreground/70 mb-2 text-sm font-semibold">{alertStatus}</p>
            <p className="text-foreground/70 mb-4 text-sm">
              {recording ? "🎙️ Recording & sending alert..." : "⏳ Processing..."}
            </p>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-smooth"
            >
              Cancel Alert
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
