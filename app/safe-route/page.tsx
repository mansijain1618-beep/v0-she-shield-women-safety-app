"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import EnhancedMapView from "@/components/enhanced-map-view"
import {
  MapPin,
  Clock,
  Cloud,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Loader2,
  MapPinned,
  Play,
  Square,
} from "lucide-react"
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
  // (all your same hooks and logic retained)
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

  // geolocation detection - kept same
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

  // indianCities object kept as-is
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
    const interval = setInterval(() => {
      setNavigationStep((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsNavigating(false)
          alert("Navigation Complete! You have reached your destination safely.")
          return 100
        }
        return Math.min(100, prev + Math.random() * 15)
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
        return "bg-green-50 border-green-200 text-green-700"
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-700"
      case "high":
        return "bg-red-50 border-red-200 text-red-700"
      default:
        return ""
    }
  }

  const getRiskIcon = (level: string) => {
    if (level === "low") return <CheckCircle className="w-5 h-5" />
    return <AlertTriangle className="w-5 h-5" />
  }

  const selectedRouteData = routes.find((r) => r.type === selectedRoute)

  return (
    <div className="min-h-screen bg-[#F8F5FF] dark:bg-[#0C0017] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#7C3AED]/8 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#4F46E5]/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-slide-down">
            <h1 className="text-4xl font-bold text-[#7C3AED] mb-2">Safe Route Recommendation</h1>
            <p className="text-gray-600 dark:text-gray-300">Navigate safely within cities with helpful waypoints and guidance</p>
          </div>

          {locationError && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6 text-yellow-800">
              {locationError}
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-2xl p-6 mb-8 border border-[#6D28D9]/30" style={{ boxShadow: "0 0 15px rgba(79,70,229,0.18)" }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Current Location</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Your location"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#7C3AED] bg-white text-sm"
                    value={startLocation ? `${startLocation.lat.toFixed(4)}, ${startLocation.lng.toFixed(4)}` : ""}
                    readOnly
                  />
                  <button
                    onClick={() => {
                      if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setStartLocation({
                              lat: position.coords.latitude,
                              lng: position.coords.longitude,
                            })
                            setLocationError("")
                          },
                          () => {
                            setLocationError("Could not access your location.")
                          },
                        )
                      }
                    }}
                    className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-opacity-95 transition flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Select City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#7C3AED] bg-white"
                >
                  {Object.keys(indianCities).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Time of Day</label>
                <select
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#7C3AED] bg-white"
                >
                  <option>Day (6 AM - 6 PM)</option>
                  <option>Evening (6 PM - 10 PM)</option>
                  <option>Night (10 PM - 6 AM)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Filter By Type</label>
                <select
                  value={filterByType}
                  onChange={(e) => setFilterByType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#7C3AED] bg-white"
                >
                  <option value="all">All Places</option>
                  <option value="landmark">Landmarks</option>
                  <option value="transport">Transport Hubs</option>
                  <option value="hospital">Hospitals</option>
                  <option value="police">Police Stations</option>
                  <option value="park">Parks</option>
                </select>
              </div>
            </div>

            {/* Destination Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Select Destination in {city}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto pb-4">
                {filteredDestinations.map((dest) => (
                  <button
                    key={dest.name}
                    onClick={() => setSelectedDestination(dest.name)}
                    className={`px-4 py-3 rounded-lg border text-left transition flex items-center gap-2 ${
                      selectedDestination === dest.name
                        ? "border-[#7C3AED] bg-[#F7EEFF]"
                        : "border-[#F0E9FF] bg-white hover:border-[#7C3AED]"
                    }`}
                  >
                    <MapPin className="w-4 h-4 flex-shrink-0 text-[#7C3AED]" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{dest.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-300">{dest.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Waypoints */}
            {selectedDestination && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Select Safe Waypoints (Optional)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Choose hospitals, police stations, or safe places along the route
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto pb-4">
                  {availableDestinations
                    .filter((d) => d.name !== selectedDestination && (d.type === "hospital" || d.type === "police"))
                    .map((dest) => (
                      <button
                        key={dest.name}
                        onClick={() => {
                          if (selectedWaypoints.find((w) => w.name === dest.name)) {
                            setSelectedWaypoints(selectedWaypoints.filter((w) => w.name !== dest.name))
                          } else {
                            setSelectedWaypoints([...selectedWaypoints, dest])
                          }
                        }}
                        className={`px-3 py-2 rounded-lg border text-left text-sm transition flex items-center gap-2 ${
                          selectedWaypoints.find((w) => w.name === dest.name)
                            ? "border-[#7C3AED] bg-[#F7EEFF]"
                            : "border-[#F0E9FF] bg-white hover:border-[#7C3AED]"
                        }`}
                      >
                        <MapPinned className="w-3 h-3 text-[#7C3AED]" />
                        <div>
                          <p className="font-semibold text-xs text-gray-900 dark:text-gray-100">{dest.name}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            <button
              onClick={handleCalculateRoute}
              disabled={loading || !selectedDestination}
              className="w-full bg-[#7C3AED] text-white py-3 rounded-lg hover:bg-opacity-95 transition font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              {loading ? "Calculating..." : "Calculate Safe Route"}
            </button>
          </div>

          {/* Illustration + Map */}
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-2xl p-6 border border-[#6D28D9]/30" style={{ boxShadow: "0 0 15px rgba(79,70,229,0.12)" }}>
              <img src="/illustrations/safe-route-illustration.png" alt="route" className="w-full h-auto rounded-lg" />
            </div>

            {mapReady && startLocation && endLocation && (
              <div className="rounded-2xl overflow-hidden">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Interactive Route Map</h2>
                <EnhancedMapView
                  startLat={startLocation.lat}
                  startLng={startLocation.lng}
                  endLat={endLocation.lat}
                  endLng={endLocation.lng}
                  waypoints={selectedWaypoints}
                  routeCoordinates={routes[0]?.coordinates}
                />
              </div>
            )}
          </div>

          {/* Routes Display (kept similar) */}
          {routes.length > 0 ? (
            <div className="space-y-6">
              {routes.map((route) => (
                <div
                  key={route.type}
                  onClick={() => setSelectedRoute(route.type)}
                  className={`bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-2xl p-6 shadow-md cursor-pointer transition-all border ${
                    selectedRoute === route.type
                      ? "border-[#7C3AED] shadow-lg scale-105"
                      : "border-[#F0E9FF] hover:border-[#7C3AED]"
                  }`}
                  style={{ boxShadow: selectedRoute === route.type ? "0 8px 30px rgba(79,70,229,0.18)" : "0 4px 12px rgba(0,0,0,0.04)" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize mb-2">{route.type} Route</h3>
                      <p className="text-gray-600 dark:text-gray-300">{route.description}</p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 border-2 ${getRiskColor(
                        route.riskLevel,
                      )}`}
                    >
                      {getRiskIcon(route.riskLevel)}
                      {route.riskLevel.charAt(0).toUpperCase() + route.riskLevel.slice(1)} Risk
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b-2 border-[#F0E9FF]">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Distance</p>
                      <p className="text-xl font-bold text-[#7C3AED]">{route.distance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Duration</p>
                      <p className="text-xl font-bold text-[#7C3AED] flex items-center gap-2">
                        <Clock className="w-5 h-5" /> {route.duration}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Waypoints:</p>
                    <div className="flex flex-wrap gap-2">
                      {route.waypoints.map((point, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#F7EEFF] text-[#7C3AED] rounded-full text-sm font-medium">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>

                  {route.safetyRecommendations && route.safetyRecommendations.length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      <p className="font-semibold text-yellow-800 text-sm mb-2">Safety Recommendations:</p>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        {route.safetyRecommendations.map((rec, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span>•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedRoute === route.type && !isNavigating && (
                    <button
                      onClick={handleStartNavigation}
                      className="w-full bg-[#4F46E5] text-white py-3 rounded-xl font-bold hover:bg-opacity-95 transition flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Start Navigation
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#F0E9FF]">
                <MapPin className="w-12 h-12 text-[#D6BCFA] mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Calculate a route to get started with safe navigation</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
