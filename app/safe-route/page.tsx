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

  const getRiskIcon = (level: string) => {
    if (level === "low") return <CheckCircle className="w-5 h-5" />
    return <AlertTriangle className="w-5 h-5" />
  }

  const selectedRouteData = routes.find((r) => r.type === selectedRoute)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-slide-down">
            <h1 className="text-4xl font-bold text-primary mb-2">Safe Route Recommendation</h1>
            <p className="text-muted-foreground">Navigate safely within cities with real locations and waypoints</p>
          </div>

          {locationError && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6 text-yellow-800">
              {locationError}
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-8 border-2 border-pink-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Current Location</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Your location"
                    className="flex-1 px-4 py-2 border-2 border-pink-100 rounded-lg focus:outline-none focus:border-primary bg-white text-sm"
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
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Select City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-pink-100 rounded-lg focus:outline-none focus:border-primary bg-white"
                >
                  {Object.keys(indianCities).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Time of Day</label>
                <select
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-pink-100 rounded-lg focus:outline-none focus:border-primary bg-white"
                >
                  <option>Day (6 AM - 6 PM)</option>
                  <option>Evening (6 PM - 10 PM)</option>
                  <option>Night (10 PM - 6 AM)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Filter By Type</label>
                <select
                  value={filterByType}
                  onChange={(e) => setFilterByType(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-pink-100 rounded-lg focus:outline-none focus:border-primary bg-white"
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
              <label className="block text-sm font-semibold text-foreground mb-3">Select Destination in {city}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto pb-4">
                {filteredDestinations.map((dest) => (
                  <button
                    key={dest.name}
                    onClick={() => setSelectedDestination(dest.name)}
                    className={`px-4 py-3 rounded-lg border-2 text-left transition flex items-center gap-2 ${
                      selectedDestination === dest.name
                        ? "border-primary bg-pink-50"
                        : "border-pink-100 bg-white hover:border-primary"
                    }`}
                  >
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{dest.name}</p>
                      <p className="text-xs text-gray-500">{dest.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Waypoints */}
            {selectedDestination && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-3">
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
                        className={`px-3 py-2 rounded-lg border-2 text-left text-sm transition flex items-center gap-2 ${
                          selectedWaypoints.find((w) => w.name === dest.name)
                            ? "border-primary bg-pink-50"
                            : "border-pink-100 bg-white hover:border-primary"
                        }`}
                      >
                        <MapPinned className="w-3 h-3" />
                        <div>
                          <p className="font-semibold text-xs">{dest.name}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            <button
              onClick={handleCalculateRoute}
              disabled={loading || !selectedDestination}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              {loading ? "Calculating..." : "Calculate Safe Route"}
            </button>
          </div>

          {/* Map Display */}
          {mapReady && startLocation && endLocation && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Interactive Route Map</h2>
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

          {/* Navigation Progress */}
          {isNavigating && selectedRouteData && (
            <div className="bg-white rounded-2xl p-6 shadow-md mb-8 border-2 border-pink-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">Live Navigation</h3>
                <button
                  onClick={handleStopNavigation}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop Navigation
                </button>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-4 mb-3">
                  <Navigation className="w-6 h-6 text-primary animate-spin" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Following {selectedRoute} route...</p>
                    <p className="font-semibold text-foreground">
                      Distance remaining:{" "}
                      {(((100 - navigationStep) * Number.parseFloat(selectedRouteData.distance)) / 100).toFixed(1)} km
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${navigationStep}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{Math.round(navigationStep)}% completed</p>
              </div>
            </div>
          )}

          {/* Weather & Traffic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <div className="flex items-center gap-3 mb-2">
                <Cloud className="w-6 h-6 text-blue-500" />
                <h3 className="font-semibold text-foreground">Weather</h3>
              </div>
              <p className="text-gray-600">Partly Cloudy • 28°C • Light winds</p>
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
          {routes.length > 0 ? (
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
                      className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 border-2 ${getRiskColor(
                        route.riskLevel,
                      )}`}
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

                  <div className="mb-4">
                    <p className="font-semibold text-foreground mb-3">Waypoints:</p>
                    <div className="flex flex-wrap gap-2">
                      {route.waypoints.map((point, idx) => (
                        <span key={idx} className="px-3 py-1 bg-pink-100 text-primary rounded-full text-sm font-medium">
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
                      className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition flex items-center justify-center gap-2"
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
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-pink-100">
                <MapPin className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Calculate a route to get started with safe navigation</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
