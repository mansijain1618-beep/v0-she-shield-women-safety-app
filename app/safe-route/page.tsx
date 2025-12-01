"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { MapPin } from "lucide-react"

export default function SafeRoutePage() {
  const [startLocation, setStartLocation] = useState("")
  const [selectedDestination, setSelectedDestination] = useState("")
  const [city, setCity] = useState("Delhi")

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStartLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
        },
        () => {
          setStartLocation("Location not available")
        },
      )
    }
  }, [])

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <Navbar />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--primary)" }}>
            Safe Route Navigation
          </h1>
          <p style={{ color: "var(--foreground)", opacity: 0.7 }} className="mb-8">
            Plan your journey with AI-powered safety analysis
          </p>
        </div>

        {/* Route selector */}
        <div
          className="backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8 border-2 border-primary/20 animate-slide-up hover:border-primary/40 transition"
          style={{ animationDelay: "0.2s", backgroundColor: "var(--card)/80" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Current Location</label>
              <input
                type="text"
                placeholder="Your location"
                value={startLocation}
                readOnly
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                style={{ backgroundColor: "white", color: "black" }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Select City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                style={{ backgroundColor: "white", color: "black" }}
              >
                <option>Delhi</option>
                <option>Mumbai</option>
                <option>Bangalore</option>
                <option>Bhopal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Destination</label>
              <input
                type="text"
                placeholder="Enter destination"
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                style={{ backgroundColor: "white", color: "black" }}
              />
            </div>
          </div>

          <button
            className="w-full text-white py-3 rounded-lg hover:opacity-90 transition font-semibold flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <MapPin className="w-4 h-4" />
            Calculate Safe Route
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 border-2 border-primary/30" style={{ backgroundColor: "var(--card)" }}>
          <p style={{ color: "var(--foreground)" }} className="text-center opacity-70">
            Select a destination to view safe routes
          </p>
        </div>
      </div>
    </div>
  )
}
