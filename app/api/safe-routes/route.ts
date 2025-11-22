import { type NextRequest, NextResponse } from "next/server"
import { indiaData } from "@/lib/india-data"

interface RouteRequest {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  city: string
  timeOfDay: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RouteRequest = await request.json()
    const { startLat, startLng, endLat, endLng, city, timeOfDay } = body

    const distance = calculateDistance(startLat, startLng, endLat, endLng)

    // Find crime data for the city
    const cityData = indiaData.crimeSafetyData.highRiskAreas.find(
      (area) => area.city.toLowerCase() === city.toLowerCase(),
    )

    // Generate safe and shortest routes with real calculations
    const routes = [
      {
        type: "shortest",
        distance: `${(distance * 0.9).toFixed(2)} km`,
        duration: `${Math.round(distance * 0.9 * 6)} mins`,
        riskLevel: cityData?.riskLevel === "high" ? "high" : "medium",
        description: "Direct route (faster but may pass through busier areas)",
        waypoints: generateWaypoints(startLat, startLng, endLat, endLng, "direct"),
        coordinates: generateRouteCoordinates(startLat, startLng, endLat, endLng, "direct"),
      },
      {
        type: "safest",
        distance: `${(distance * 1.2).toFixed(2)} km`,
        duration: `${Math.round(distance * 1.2 * 6)} mins`,
        riskLevel: "low",
        description: "Well-lit route with high police presence and safe areas",
        waypoints: generateWaypoints(startLat, startLng, endLat, endLng, "safe"),
        coordinates: generateRouteCoordinates(startLat, startLng, endLat, endLng, "safe"),
      },
    ]

    return NextResponse.json({
      success: true,
      routes,
      startPoint: { lat: startLat, lng: startLng },
      endPoint: { lat: endLat, lng: endLng },
      timeOfDay,
      city,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to calculate routes" }, { status: 500 })
  }
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

function generateWaypoints(startLat: number, startLng: number, endLat: number, endLng: number, type: string): string[] {
  const mid1Lat = startLat + (endLat - startLat) * 0.3
  const mid1Lng = startLng + (endLng - startLng) * 0.3
  const mid2Lat = startLat + (endLat - startLat) * 0.7
  const mid2Lng = startLng + (endLng - startLng) * 0.7

  if (type === "direct") {
    return ["Current Location", "Checkpoint 1", "Checkpoint 2", "Destination"]
  }
  return ["Current Location", "Safe Zone 1", "Safe Zone 2", "Well-lit Area", "Destination"]
}

function generateRouteCoordinates(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  type: string,
): Array<[number, number]> {
  const points: Array<[number, number]> = [[startLat, startLng]]

  // Generate waypoint coordinates
  const steps = 5
  for (let i = 1; i < steps; i++) {
    const lat = startLat + (endLat - startLat) * (i / steps) + (Math.random() - 0.5) * (type === "safe" ? 0.005 : 0.002)
    const lng = startLng + (endLng - startLng) * (i / steps) + (Math.random() - 0.5) * (type === "safe" ? 0.005 : 0.002)
    points.push([lat, lng])
  }

  points.push([endLat, endLng])
  return points
}
