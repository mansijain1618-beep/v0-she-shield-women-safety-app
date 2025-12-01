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
  riskScore?: number
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
        return "bg-green-500/15 border-green-400/50 text-green-300"
      case "medium":
        return "bg-yellow-500/15 border-yellow-400/50 text-yellow-300"
      case "high":
        return "bg-red-500/15 border-red-400/50 text-red-300"
      default:
        return ""
    }
  }

  const selectedRouteData = routes.find((r) => r.type === selectedRoute)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-secondary/20 to-accent/15 rounded-full blur-3xl animate-blob-1"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-gradient-to-tl from-primary/20 to-secondary/15 rounded-full blur-3xl animate-blob-2"></div>
        <div
          className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-br from-primary/15 to-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <Navbar />

      <div className="pt-16 pb-12 px-4 md:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-slide-up">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full border border-primary/30 backdrop-blur-sm mb-4">
              <p className="text-sm font-semibold text-primary">Navigate Safely</p>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-3">
              Safe Route Recommendations
            </h1>
            <p className="text-lg text-foreground/70 max-w-3xl">
              AI-powered routes based on real-time crime data, well-lit roads, police presence, and crowd density
            </p>
          </div>

          {locationError && (
            <div
              className="bg-accent/15 border-2 border-accent/50 rounded-2xl p-4 mb-6 animate-slide-up backdrop-blur-sm"
              style={{ animationDelay: "0.1s" }}
            >
              <p className="text-accent text-sm font-medium">{locationError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            <div
              className="lg:col-span-1 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl rounded-3xl p-6 shadow-xl border-2 border-primary/20 h-fit animate-slide-in-left hover:border-primary/40 transition-all"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Route Settings
              </h2>

              <div className="space-y-6">
                {/* Time of Day Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Time of Day</label>
                  <select
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl bg-background/50 text-foreground focus:outline-none focus:border-primary/60 transition-all backdrop-blur-sm"
                  >
                    <option>Day (6 AM - 6 PM)</option>
                    <option>Evening (6 PM - 9 PM)</option>
                    <option>Night (9 PM - 6 AM)</option>
                  </select>
                </div>

                {/* Route Type Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-foreground">Preferred Route</label>
                  <div className="space-y-2">
                    {[
                      {
                        type: "safest" as const,
                        label: "Safest Route",
                        icon: CheckCircle,
                        desc: "Avoid high-crime areas",
                      },
                      { type: "shortest" as const, label: "Shortest Route", icon: Navigation, desc: "Direct path" },
                    ].map((option) => (
                      <button
                        key={option.type}
                        onClick={() => setSelectedRoute(option.type)}
                        className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl font-semibold transition-all border-2 ${
                          selectedRoute === option.type
                            ? "bg-gradient-to-r from-primary/30 to-secondary/20 text-primary border-primary/60 shadow-lg"
                            : "bg-background/30 text-foreground border-primary/20 hover:border-primary/40 hover:bg-background/50"
                        }`}
                      >
                        <option.icon className="w-5 h-5 flex-shrink-0 mt-1" />
                        <div className="text-left">
                          <p className="text-sm">{option.label}</p>
                          <p className="text-xs text-foreground/60">{option.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Location Display with enhanced styling */}
                {startLocation && (
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/10 rounded-2xl p-4 border-2 border-primary/30">
                    <p className="text-xs text-foreground/70 font-semibold uppercase tracking-wider mb-2">
                      Your Location
                    </p>
                    <p className="font-bold text-lg text-foreground mb-1">{city}</p>
                    <p className="text-xs text-foreground/60 font-mono">
                      {startLocation.lat.toFixed(4)}, {startLocation.lng.toFixed(4)}
                    </p>
                  </div>
                )}

                {/* Calculate Route Button */}
                <button
                  onClick={handleCalculateRoute}
                  disabled={loading || !startLocation || !selectedDestination}
                  className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    loading || !startLocation || !selectedDestination
                      ? "bg-muted/50 text-foreground/50 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105 active:scale-95"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5" />
                      Calculate Route
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              {/* Map Display */}
              <div
                className="bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-primary/20 overflow-hidden animate-slide-in-right hover:border-primary/40 transition-all"
                style={{ animationDelay: "0.3s" }}
              >
                {startLocation && mapReady ? (
                  <EnhancedMapView
                    startCoordinates={startLocation}
                    destinations={availableDestinations}
                    selectedWaypoints={selectedWaypoints}
                  />
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-muted/40 to-muted/20">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-3" />
                    <p className="text-foreground/70 font-medium">Loading interactive map...</p>
                  </div>
                )}
              </div>

              {/* Route Details Cards */}
              {routes.length > 0 && (
                <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Available Routes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {routes.map((route, idx) => (
                      <div
                        key={idx}
                        className={`bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl rounded-2xl p-6 border-2 transition-all duration-300 animate-slide-up hover:shadow-lg ${
                          selectedRoute === route.type
                            ? "border-primary/60 shadow-lg shadow-primary/20"
                            : "border-primary/20 hover:border-primary/40"
                        }`}
                        style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-bold text-foreground text-lg capitalize">
                            {route.type === "safest" ? "Safest Route" : "Shortest Route"}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              route.riskLevel === "low"
                                ? "bg-green-500/20 border-green-400/50 text-green-300"
                                : route.riskLevel === "medium"
                                  ? "bg-yellow-500/20 border-yellow-400/50 text-yellow-300"
                                  : "bg-red-500/20 border-red-400/50 text-red-300"
                            }`}
                          >
                            {route.riskLevel.toUpperCase()} RISK
                          </span>
                        </div>

                        {/* Enhanced route details with safety score visualization */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-primary/10 rounded-lg p-3">
                              <p className="text-xs text-foreground/70 mb-1">Distance</p>
                              <p className="font-bold text-primary text-lg">{route.distance}</p>
                            </div>
                            <div className="bg-secondary/10 rounded-lg p-3">
                              <p className="text-xs text-foreground/70 mb-1">Duration</p>
                              <p className="font-bold text-secondary text-lg">{route.duration}</p>
                            </div>
                          </div>

                          {/* Safety Score Bar */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-foreground/70">Safety Score</p>
                              <p className="text-sm font-bold text-primary">
                                {(10 - (route as any).riskScore).toFixed(1)}/10
                              </p>
                            </div>
                            <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 rounded-full ${
                                  route.riskLevel === "low"
                                    ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                    : route.riskLevel === "medium"
                                      ? "bg-gradient-to-r from-yellow-500 to-amber-400"
                                      : "bg-gradient-to-r from-red-500 to-orange-400"
                                }`}
                                style={{ width: `${((10 - (route as any).riskScore) / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          <p className="text-sm text-foreground/70 leading-relaxed">{route.description}</p>

                          {/* Safety Recommendations */}
                          {(route as any).safetyRecommendations && (route as any).safetyRecommendations.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-primary/20">
                              <p className="text-xs font-semibold text-foreground/70 mb-2">Safety Tips</p>
                              <ul className="space-y-1">
                                {(route as any).safetyRecommendations.slice(0, 2).map((rec: string, i: number) => (
                                  <li key={i} className="text-xs text-foreground/60 flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
