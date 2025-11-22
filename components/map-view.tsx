"use client"

import { useEffect, useRef } from "react"

interface MapViewProps {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  routeCoordinates?: Array<[number, number]>
}

export default function MapView({ startLat, startLng, endLat, endLng, routeCoordinates }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainer.current) return

    // Load Leaflet CSS and JS from CDN
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
    document.head.appendChild(link)

    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
    script.async = true
    script.onload = () => {
      const L = (window as any).L

      // Initialize map centered between start and end
      const centerLat = (startLat + endLat) / 2
      const centerLng = (startLng + endLng) / 2

      map.current = L.map(mapContainer.current).setView([centerLat, centerLng], 13)

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map.current)

      // Add start marker (green)
      L.circleMarker([startLat, startLng], {
        radius: 8,
        fillColor: "#22c55e",
        color: "#16a34a",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .bindPopup('<div class="font-semibold">Start Location</div>')
        .addTo(map.current)

      // Add end marker (red)
      L.circleMarker([endLat, endLng], {
        radius: 8,
        fillColor: "#ef4444",
        color: "#dc2626",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .bindPopup('<div class="font-semibold">Destination</div>')
        .addTo(map.current)

      // Draw route if coordinates provided
      if (routeCoordinates && routeCoordinates.length > 0) {
        L.polyline(routeCoordinates, {
          color: "#db2777",
          weight: 3,
          opacity: 0.8,
          dashArray: "5, 5",
        }).addTo(map.current)
      }

      // Fit bounds to show entire route
      const group = L.featureGroup([L.circleMarker([startLat, startLng]), L.circleMarker([endLat, endLng])])
      map.current.fitBounds(group.getBounds().pad(0.1))
    }
    document.head.appendChild(script)

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [startLat, startLng, endLat, endLng, routeCoordinates])

  return (
    <div
      ref={mapContainer}
      className="w-full h-96 rounded-2xl border-2 border-pink-100 shadow-md overflow-hidden"
      style={{ minHeight: "400px" }}
    />
  )
}
