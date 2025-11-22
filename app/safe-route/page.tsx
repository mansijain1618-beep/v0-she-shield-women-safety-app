"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import MapView from "@/components/map-view"
import { MapPin, Clock, Cloud, AlertTriangle, CheckCircle, Navigation, Loader2 } from "lucide-react"

interface Route {
  type: "shortest" | "safest"
  distance: string
  duration: string
  riskLevel: "low" | "medium" | "high"
  description: string
  waypoints: string[]
  coordinates?: Array<[number, number]>
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

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStartLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationError("")
        },
        (error) => {
          setLocationError("Could not access your location. Using default location.")
          setStartLocation({ lat: 28.6139, lng: 77.209 }) // Delhi default
        },
      )
    }
  }, [])

  const handleUseCurrentLocation = () => {
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
  }

  const indianCities: Record<string, { lat: number; lng: number }> = {
    Delhi: { lat: 28.6139, lng: 77.209 },
    Mumbai: { lat: 19.076, lng: 72.8776 },
    Bangalore: { lat: 12.9716, lng: 77.5946 },
    Kolkata: { lat: 22.5726, lng: 88.3639 },
    Pune: { lat: 18.5204, lng: 73.8567 },
    Hyderabad: { lat: 17.3833, lng: 78.4784 },
    Chennai: { lat: 13.0827, lng: 80.2707 },
    Gurgaon: { lat: 28.4595, lng: 77.0266 },
  }

  const handleCalculateRoute = async () => {
    if (!startLocation) {
      setLocationError("Please enable location or select a starting point")
      return
    }

    const destination = indianCities[city] || indianCities.Delhi

    setLoading(true)
    try {
      const response = await fetch("/api/safe-routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startLat: startLocation.lat,
          startLng: startLocation.lng,
          endLat: destination.lat,
          endLng: destination.lng,
          city,
          timeOfDay,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setRoutes(data.routes)
        setEndLocation(destination)
        setMapReady(true)
      }
    } catch (error) {
      setLocationError("Failed to calculate routes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50">
      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-2">Safe Route Recommendation</h1>
          <p className="text-gray-600 mb-8">AI-powered routes based on real location, crime data, and weather</p>

          {locationError && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6 text-yellow-800">
              {locationError}
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-8 border-2 border-pink-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    onClick={handleUseCurrentLocation}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Use My Location
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Destination City</label>
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

              <div className="flex items-end">
                <button
                  onClick={handleCalculateRoute}
                  disabled={loading}
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                  {loading ? "Calculating..." : "Calculate Route"}
                </button>
              </div>
            </div>
          </div>

          {/* Map Display */}
          {mapReady && startLocation && endLocation && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Route Map</h2>
              <MapView
                startLat={startLocation.lat}
                startLng={startLocation.lng}
                endLat={endLocation.lat}
                endLng={endLocation.lng}
                routeCoordinates={routes[0]?.coordinates}
              />
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
