"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import EnhancedMapView from "@/components/enhanced-map-view"
import { MapPin, CheckCircle, Navigation, Loader2 } from "lucide-react"
import { cityLocations } from "@/lib/india-data"
import { findNearestCity } from "@/lib/geolocation-utils"

interface Route {
  type: "shortest" | "safest"
  distance: string
  duration: string
  riskLevel: "low" | "medium" | "high"
  description: string
  waypoints: string[]
  coordinates?: Array<[number, number]>
  safetyRecommendations?: string[]
}

interface Waypoint {
  name: string
  lat: number
  lng: number
  type?: string
}

export default function SafeRoutePage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<"shortest" | "safest">("safest")
  const [startLocation, setStartLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [endLocation, setEndLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [city, setCity] = useState("Delhi")
  const [timeOfDay, setTimeOfDay] = useState("Day (6 AM - 6 PM)")
  const [locationError, setLocationError] = useState("")
  const [mapReady, setMapReady] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState("")
  const [availableDestinations, setAvailableDestinations] = useState<Waypoint[]>([])
  const [selectedWaypoints, setSelectedWaypoints] = useState<Waypoint[]>([])
  const [filterByType, setFilterByType] = useState<string>("all")
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigationStep, setNavigationStep] = useState(0)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude
          const userLng = position.coords.longitude
          const detectedCity = findNearestCity(userLat, userLng)

          setStartLocation({
            lat: userLat,
            lng: userLng,
          })
          setCity(detectedCity !== "Unknown" ? detectedCity : "Delhi")
          setLocationError("")
          console.log("[v0] Detected city:", detectedCity, "Coordinates:", userLat, userLng)
        },
        (error) => {
          console.log("[v0] Geolocation error:", error.message)
          setLocationError("Using default location. Enable location access for accuracy.")
          setStartLocation({ lat: 28.7041, lng: 77.1025 })
          setCity("Delhi")
        },
      )
    }
  }, [])

  useEffect(() => {
    const destinations = (cityLocations[city as keyof typeof cityLocations] || []) as Waypoint[]
    setAvailableDestinations(destinations)
    setSelectedDestination("")
    setSelectedWaypoints([])
  }, [city])

  const indianCities: Record<string, { lat: number; lng: number }> = {
    Delhi: { lat: 28.6139, lng: 77.209 },
    Mumbai: { lat: 19.076, lng: 72.8776 },
    Bangalore: { lat: 12.9716, lng: 77.5946 },
    Kolkata: { lat: 22.5726, lng: 88.3639 },
    Pune: { lat: 18.5204, lng: 73.8567 },
    Hyderabad: { lat: 17.3833, lng: 78.4784 },
    Chennai: { lat: 13.0827, lng: 80.2707 },
    Gurgaon: { lat: 28.4595, lng: 77.0266 },
    Bhopal: { lat: 23.1815, lng: 77.4104 },
  }

  const handleCalculateRoute = async () => {
    if (!startLocation) {
      setLocationError("Please enable location or select a starting point")
      return
    }

    if (!selectedDestination) {
      setLocationError("Please select a destination in the city")
      return
    }

    const destLocation = availableDestinations.find((d) => d.name === selectedDestination)
    if (!destLocation) return

    setLoading(true)
    try {
      const response = await fetch("/api/safe-routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startLat: startLocation.lat,
          startLng: startLocation.lng,
          endLat: destLocation.lat,
          endLng: destLocation.lng,
          city,
          timeOfDay,
          waypoints: selectedWaypoints.map((w) => ({ name: w.name, lat: w.lat, lng: w.lng })),
        }),
      })

      const data = await response.json()
      if (data.success) {
        setRoutes(data.routes)
        setEndLocation({ lat: destLocation.lat, lng: destLocation.lng })
        setMapReady(true)
      }
    } catch (error) {
      setLocationError("Failed to calculate routes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleStartNavigation = () => {
    setIsNavigating(true)
    setNavigationStep(0)
    // Simulate navigation progress
    const interval = setInterval(() => {
      setNavigationStep((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsNavigating(false)
          alert("Navigation Complete! You have reached your destination safely.")
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 3000)
  }

  const handleStopNavigation = () => {
    setIsNavigating(false)
    setNavigationStep(0)
  }

  const filteredDestinations =
    filterByType === "all" ? availableDestinations : availableDestinations.filter((d) => d.type === filterByType)

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

  const selectedRouteData = routes.find((r) => r.type === selectedRoute)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-secondary/15 to-accent/10 rounded-full blur-3xl animate-blob-1"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-gradient-to-tl from-primary/15 to-secondary/10 rounded-full blur-3xl animate-blob-2"></div>
      </div>

      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 animate-slide-up">
            Safe Route Recommendations
          </h1>
          <p className="text-foreground/70 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            AI-powered routes based on real-time crime data, traffic, and safety scores
          </p>

          {locationError && (
            <div
              className="bg-accent/10 border-2 border-accent rounded-2xl p-4 mb-6 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <p className="text-accent text-sm">{locationError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Route Selection Panel */}
            <div
              className="lg:col-span-1 bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-primary/20 h-fit animate-slide-in-left"
              style={{ animationDelay: "0.3s" }}
            >
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Route Options
              </h2>

              <div className="space-y-4">
                {/* Time of Day Selection */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Time of Day</label>
                  <select
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-primary/20 rounded-xl bg-background text-foreground focus:outline-none focus:border-primary transition"
                  >
                    <option>Day (6 AM - 6 PM)</option>
                    <option>Evening (6 PM - 9 PM)</option>
                    <option>Night (9 PM - 6 AM)</option>
                  </select>
                </div>

                {/* Route Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Route Type</label>
                  <div className="space-y-2">
                    {[
                      { type: "safest" as const, label: "Safest Route", icon: CheckCircle },
                      { type: "shortest" as const, label: "Shortest Route", icon: Navigation },
                    ].map((option) => (
                      <button
                        key={option.type}
                        onClick={() => setSelectedRoute(option.type)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all border-2 ${
                          selectedRoute === option.type
                            ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground border-primary shadow-lg"
                            : "bg-background text-foreground border-primary/20 hover:border-primary/50"
                        }`}
                      >
                        <option.icon className="w-5 h-5" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Location Display */}
                {startLocation && (
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 border-2 border-primary/20">
                    <p className="text-xs text-foreground/70 mb-1">Current Location</p>
                    <p className="font-semibold text-foreground">{city}</p>
                    <p className="text-xs text-foreground/60 mt-1">
                      📍 {startLocation.lat.toFixed(4)}, {startLocation.lng.toFixed(4)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Map & Route Display */}
            <div
              className="lg:col-span-2 bg-card/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-primary/20 overflow-hidden animate-slide-in-right"
              style={{ animationDelay: "0.4s" }}
            >
              {startLocation && mapReady ? (
                <EnhancedMapView
                  startCoordinates={startLocation}
                  destinations={availableDestinations}
                  selectedWaypoints={selectedWaypoints}
                />
              ) : (
                <div className="h-96 flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-rotate-slow mx-auto mb-3" />
                    <p className="text-foreground/70">Loading map...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Routes List */}
          {routes.length > 0 && (
            <div className="mt-8 animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <h3 className="text-2xl font-bold text-primary mb-4">Available Routes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {routes.map((route, idx) => (
                  <div
                    key={idx}
                    className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg animate-slide-up"
                    style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-foreground text-lg capitalize">{route.type} Route</h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          route.riskLevel === "low"
                            ? "bg-green-500/20 text-green-700"
                            : route.riskLevel === "medium"
                              ? "bg-yellow-500/20 text-yellow-700"
                              : "bg-red-500/20 text-red-700"
                        }`}
                      >
                        {route.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-foreground/70 flex items-center gap-2">
                        <Navigation className="w-4 h-4" /> {route.distance} • {route.duration}
                      </p>
                      <p className="text-sm text-foreground">{route.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
