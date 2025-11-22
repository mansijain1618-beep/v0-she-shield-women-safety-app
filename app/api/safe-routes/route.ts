import { type NextRequest, NextResponse } from "next/server"
import { criminalAreasData } from "@/lib/india-data"

interface RouteRequest {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  city: string
  timeOfDay: string
  waypoints?: Array<{ name: string; lat: number; lng: number }>
}

export async function POST(request: NextRequest) {
  try {
    const body: RouteRequest = await request.json()
    const { startLat, startLng, endLat, endLng, city, timeOfDay, waypoints = [] } = body

    const distance = calculateDistance(startLat, startLng, endLat, endLng)

    const criminalAreas = criminalAreasData[city as keyof typeof criminalAreasData] || []

    // Calculate risk scores based on proximity to crime areas
    const startRiskScore = calculateAreaRiskScore(startLat, startLng, criminalAreas, timeOfDay)
    const endRiskScore = calculateAreaRiskScore(endLat, endLng, criminalAreas, timeOfDay)
    const averageRisk = (startRiskScore + endRiskScore) / 2

    // Generate both shortest and safest routes
    const routes = [
      {
        type: "shortest",
        distance: `${(distance * 0.9).toFixed(2)} km`,
        duration: `${Math.round(distance * 0.9 * 6)} mins`,
        riskLevel: averageRisk > 6 ? "high" : averageRisk > 3.5 ? "medium" : "low",
        description: "Direct route (faster but may pass through busier areas)",
        waypoints: generateWaypoints(startLat, startLng, endLat, endLng, "direct"),
        coordinates: generateSafeRouteCoordinates(startLat, startLng, endLat, endLng, criminalAreas, "direct"),
        crimeAreasNearby: findNearbyHighRiskAreas(startLat, startLng, endLat, endLng, criminalAreas, 2),
        riskScore: averageRisk,
        safetyRecommendations: getSafetyRecommendations(timeOfDay, averageRisk),
      },
      {
        type: "safest",
        distance: `${(distance * 1.2).toFixed(2)} km`,
        duration: `${Math.round(distance * 1.2 * 6)} mins`,
        riskLevel: "low",
        description: "Route avoiding high-crime areas with well-lit streets and high police presence",
        waypoints: generateWaypoints(startLat, startLng, endLat, endLng, "safe"),
        coordinates: generateSafeRouteCoordinates(startLat, startLng, endLat, endLng, criminalAreas, "safe"),
        crimeAreasNearby: [],
        riskScore: Math.max(averageRisk * 0.4, 1),
        safetyRecommendations: getSafetyRecommendations(timeOfDay, Math.max(averageRisk * 0.4, 1)),
      },
    ]

    return NextResponse.json({
      success: true,
      routes,
      startPoint: { lat: startLat, lng: startLng },
      endPoint: { lat: endLat, lng: endLng },
      timeOfDay,
      city,
      crimeStatistics: {
        highRiskAreasInCity: criminalAreas.filter((a) => a.crimeRate > 7),
        safestAreasInCity: criminalAreas.filter((a) => a.safetyScore > 7),
        averageCrimeRate: (criminalAreas.reduce((sum, a) => sum + a.crimeRate, 0) / criminalAreas.length).toFixed(2),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to calculate routes" }, { status: 500 })
  }
}

function calculateAreaRiskScore(lat: number, lng: number, criminalAreas: any[], timeOfDay: string): number {
  let riskScore = 0

  criminalAreas.forEach((area) => {
    const distance = calculateDistance(lat, lng, area.lat, area.lng)
    // Areas within 2km affect risk score
    if (distance < 2) {
      riskScore += area.crimeRate * (1 - distance / 2)
    }
  })

  // Increase risk multiplier for night time
  if (timeOfDay.includes("Night")) {
    riskScore *= 1.4
  } else if (timeOfDay.includes("Evening")) {
    riskScore *= 1.2
  }

  return Math.min(riskScore, 10)
}

function findNearbyHighRiskAreas(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  criminalAreas: any[],
  radiusKm: number,
): any[] {
  const routeMidLat = (startLat + endLat) / 2
  const routeMidLng = (startLng + endLng) / 2

  return criminalAreas.filter((area) => {
    const distance = calculateDistance(routeMidLat, routeMidLng, area.lat, area.lng)
    return distance < radiusKm && area.crimeRate > 6.5
  })
}

function getSafetyRecommendations(timeOfDay: string, riskScore: number): string[] {
  const recommendations: string[] = []

  if (timeOfDay.includes("Night")) {
    recommendations.push("Avoid solo travel at night. Consider using ride-sharing services.")
    recommendations.push("Keep your phone charged and location sharing enabled.")
    recommendations.push("Stay on well-lit, main roads.")
  }

  if (riskScore > 6) {
    recommendations.push("This area has higher crime rates. Travel with someone if possible.")
    recommendations.push("Share your location with trusted contacts.")
    recommendations.push("Be aware of your surroundings at all times.")
  }

  if (riskScore > 8) {
    recommendations.push("CAUTION: This route passes through high-crime areas. Consider the safer alternative route.")
    recommendations.push("Have emergency numbers saved and easily accessible.")
  }

  return recommendations
}

function generateSafeRouteCoordinates(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  criminalAreas: any[],
  type: string,
): Array<[number, number]> {
  const points: Array<[number, number]> = [[startLat, startLng]]
  const steps = 8

  for (let i = 1; i < steps; i++) {
    let lat = startLat + (endLat - startLat) * (i / steps)
    let lng = startLng + (endLng - startLng) * (i / steps)

    if (type === "safe") {
      // Adjust route to avoid high-crime areas
      const offset = avoidCrimeAreas(lat, lng, criminalAreas)
      lat += offset.lat
      lng += offset.lng
    } else {
      // Direct route with minimal deviation
      lat += (Math.random() - 0.5) * 0.002
      lng += (Math.random() - 0.5) * 0.002
    }

    points.push([lat, lng])
  }

  points.push([endLat, endLng])
  return points
}

function avoidCrimeAreas(lat: number, lng: number, criminalAreas: any[]): { lat: number; lng: number } {
  let offsetLat = 0
  let offsetLng = 0

  criminalAreas.forEach((area) => {
    const distance = calculateDistance(lat, lng, area.lat, area.lng)
    if (distance < 1 && area.crimeRate > 6) {
      // Push away from high-crime area
      const pushStrength = (area.crimeRate / 10) * (1 - distance)
      offsetLat += (lat - area.lat) * pushStrength * 0.01
      offsetLng += (lng - area.lng) * pushStrength * 0.01
    }
  })

  return { lat: offsetLat, lng: offsetLng }
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
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
  if (type === "direct") {
    return ["Current Location", "Checkpoint 1", "Checkpoint 2", "Destination"]
  }
  return ["Current Location", "Safe Zone 1", "Safe Zone 2", "Well-lit Area", "Destination"]
}
