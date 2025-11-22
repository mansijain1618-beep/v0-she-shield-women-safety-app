"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { MapPin, Clock, Cloud, AlertTriangle, CheckCircle } from "lucide-react"

interface Route {
  type: "shortest" | "safest"
  distance: string
  duration: string
  riskLevel: "low" | "medium" | "high"
  description: string
  waypoints: string[]
}

export default function SafeRoutePage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState<"shortest" | "safest">("safest")

  useEffect(() => {
    // Simulate API call to fetch routes with mock data
    setTimeout(() => {
      setRoutes([
        {
          type: "shortest",
          distance: "2.3 km",
          duration: "8 mins",
          riskLevel: "high",
          description: "Direct route through downtown",
          waypoints: ["Current Location", "Main Street", "Market Plaza", "Destination"],
        },
        {
          type: "safest",
          distance: "3.1 km",
          duration: "12 mins",
          riskLevel: "low",
          description: "Well-lit route with high police presence",
          waypoints: ["Current Location", "Residential Area", "Shopping District", "Highway 5", "Destination"],
        },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 border-green-300 text-green-700"
      case "medium":
        return "bg-yellow-100 border-yellow-300 text-yellow-700"
      case "high":
        return "bg-red-100 border-red-300 text-red-700"
      default:
        return ""
    }
  }

  const getRiskIcon = (level: string) => {
    if (level === "low") return <CheckCircle className="w-5 h-5" />
    if (level === "high") return <AlertTriangle className="w-5 h-5" />
    return <AlertTriangle className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50">
      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-2">Safe Route Recommendation</h1>
          <p className="text-gray-600 mb-8">AI-powered routes based on crime data, traffic, and weather</p>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-8 border-2 border-pink-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Current Location</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  className="w-full px-4 py-2 border-2 border-pink-100 rounded-lg focus:outline-none focus:border-primary bg-white"
                  defaultValue="123 Main St"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Destination</label>
                <input
                  type="text"
                  placeholder="Enter destination"
                  className="w-full px-4 py-2 border-2 border-pink-100 rounded-lg focus:outline-none focus:border-primary bg-white"
                  defaultValue="Central Market"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Time of Day</label>
                <select className="w-full px-4 py-2 border-2 border-pink-100 rounded-lg focus:outline-none focus:border-primary bg-white">
                  <option>Day (6 AM - 6 PM)</option>
                  <option>Evening (6 PM - 10 PM)</option>
                  <option>Night (10 PM - 6 AM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Weather & Traffic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <div className="flex items-center gap-3 mb-2">
                <Cloud className="w-6 h-6 text-blue-500" />
                <h3 className="font-semibold text-foreground">Weather</h3>
              </div>
              <p className="text-gray-600">Partly Cloudy • 72°F • Light winds</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-foreground">Traffic</h3>
              </div>
              <p className="text-gray-600">Moderate traffic • ~5 min delays</p>
            </div>
          </div>

          {/* Routes Display */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading routes...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {routes.map((route) => (
                <div
                  key={route.type}
                  onClick={() => setSelectedRoute(route.type)}
                  className={`bg-white rounded-2xl p-6 shadow-md cursor-pointer transition-all border-2 ${
                    selectedRoute === route.type
                      ? "border-primary shadow-lg scale-105"
                      : "border-pink-100 hover:border-primary"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground capitalize mb-2">{route.type} Route</h3>
                      <p className="text-gray-600">{route.description}</p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 border-2 ${getRiskColor(route.riskLevel)}`}
                    >
                      {getRiskIcon(route.riskLevel)}
                      {route.riskLevel.charAt(0).toUpperCase() + route.riskLevel.slice(1)} Risk
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b-2 border-pink-100">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Distance</p>
                      <p className="text-xl font-bold text-primary">{route.distance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Duration</p>
                      <p className="text-xl font-bold text-primary flex items-center gap-2">
                        <Clock className="w-5 h-5" /> {route.duration}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground mb-3">Waypoints:</p>
                    <div className="flex flex-wrap gap-2">
                      {route.waypoints.map((point, idx) => (
                        <span key={idx} className="px-3 py-1 bg-pink-100 text-primary rounded-full text-sm font-medium">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedRoute === route.type && (
                    <button className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition">
                      Start Navigation
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
