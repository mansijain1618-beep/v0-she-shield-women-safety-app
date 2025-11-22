"use client"

import { useEffect, useRef } from "react"

interface Waypoint {
  name: string
  lat: number
  lng: number
  type?: string
}

interface EnhancedMapViewProps {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  waypoints?: Waypoint[]
  routeCoordinates?: Array<[number, number]>
}

export default function EnhancedMapView({
  startLat,
  startLng,
  endLat,
  endLng,
  waypoints = [],
  routeCoordinates,
}: EnhancedMapViewProps) {
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

      const centerLat = (startLat + endLat) / 2
      const centerLng = (startLng + endLng) / 2

      map.current = L.map(mapContainer.current).setView([centerLat, centerLng], 13)

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map.current)

      L.circleMarker([startLat, startLng], {
        radius: 10,
        fillColor: "#22c55e",
        color: "#16a34a",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9,
      })
        .bindPopup('<div class="font-bold text-sm">📍 Start Location</div>')
        .addTo(map.current)

      L.circleMarker([endLat, endLng], {
        radius: 10,
        fillColor: "#ef4444",
        color: "#dc2626",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9,
      })
        .bindPopup('<div class="font-bold text-sm">🎯 Destination</div>')
        .addTo(map.current)

      waypoints.forEach((waypoint, idx) => {
        const color = waypoint.type === "police" ? "#3b82f6" : waypoint.type === "hospital" ? "#8b5cf6" : "#f59e0b"

        L.circleMarker([waypoint.lat, waypoint.lng], {
          radius: 7,
          fillColor: color,
          color: color,
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.7,
        })
          .bindPopup(`<div class="font-semibold text-xs">${waypoint.name}<br/>${waypoint.type || "Location"}</div>`)
          .addTo(map.current)
      })

      if (routeCoordinates && routeCoordinates.length > 0) {
        L.polyline(routeCoordinates, {
          color: "#db2777",
          weight: 4,
          opacity: 0.8,
          dashArray: "5, 5",
          lineCap: "round",
        }).addTo(map.current)
      } else {
        // Draw simple line between start and end if no coordinates provided
        L.polyline(
          [
            [startLat, startLng],
            [endLat, endLng],
          ],
          {
            color: "#db2777",
            weight: 3,
            opacity: 0.6,
            dashArray: "5, 5",
          },
        ).addTo(map.current)
      }

      // Fit bounds to show entire route
      const allPoints = [[startLat, startLng], [endLat, endLng], ...waypoints.map((w) => [w.lat, w.lng])]
      const group = L.featureGroup(allPoints.map((point) => L.circleMarker(point as [number, number])))
      map.current.fitBounds(group.getBounds().pad(0.15))
    }
    document.head.appendChild(script)

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [startLat, startLng, endLat, endLng, waypoints, routeCoordinates])

  return (
    <div
      ref={mapContainer}
      className="w-full h-96 rounded-2xl border-2 border-pink-100 shadow-md overflow-hidden"
      style={{ minHeight: "400px" }}
    />
  )
}
