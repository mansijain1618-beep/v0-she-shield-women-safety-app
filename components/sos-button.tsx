"use client"

import { useState, useRef, useEffect } from "react"
import { AlertTriangle } from "lucide-react"

interface SOSButtonProps {
  onLocationDetected?: (location: { lat: number; lon: number }) => void
  onAlertSent?: (sent: boolean) => void
}

export default function SOSButton({ onLocationDetected, onAlertSent }: SOSButtonProps) {
  const [isActive, setIsActive] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [recording, setRecording] = useState(false)
  const countdownRef = useRef<NodeJS.Timeout>()

  const handleSOSClick = async () => {
    setIsActive(true)
    setCountdown(10)
    setRecording(true)

    // Get geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          onLocationDetected?.({ lat: latitude, lon: longitude })

          // Simulate API call to send alert
          console.log("Alert sent with location:", { latitude, longitude })

          // Simulate recording
          console.log("Recording started...")
        },
        (error) => {
          console.error("Geolocation error:", error)
        },
      )
    }

    // Countdown timer
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
      {/* Ring Animation */}
      {isActive && (
        <>
          <div className="absolute inset-0 rounded-full bg-destructive opacity-20 animate-ring"></div>
          <div
            className="absolute inset-0 rounded-full bg-destructive opacity-20 animate-ring"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </>
      )}

      <div className="relative flex flex-col items-center gap-6">
        {/* Main SOS Button */}
        <button
          onClick={handleSOSClick}
          disabled={isActive}
          className={`w-32 h-32 rounded-full font-bold text-xl flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl ${
            isActive
              ? "bg-destructive text-white animate-pulse-scale cursor-not-allowed"
              : "bg-destructive text-white hover:bg-red-600 active:scale-95"
          }`}
        >
          <div className="flex flex-col items-center">
            <AlertTriangle className="w-12 h-12 mb-1" />
            <span className="text-sm">S.O.S</span>
          </div>
        </button>

        {/* Status Display */}
        {isActive && (
          <div className="text-center">
            <p className="text-destructive font-bold text-lg mb-3">Alert Active</p>
            <p className="text-4xl font-bold text-destructive mb-4">{countdown}</p>
            <p className="text-gray-600 mb-4 text-sm">
              {recording ? "🔴 Recording & sending alert..." : "Processing..."}
            </p>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-300 text-foreground rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel Alert
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
