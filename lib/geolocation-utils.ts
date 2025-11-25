export async function detectCityFromCoordinates(lat: number, lng: number): Promise<string> {
  try {
    // Use OpenStreetMap Nominatim API for reverse geocoding
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    const data = await response.json()

    // Extract city name from address
    const city = data.address?.city || data.address?.town || data.address?.county || "Unknown"
    return city
  } catch (error) {
    console.error("[v0] Geolocation detection failed:", error)
    return "Unknown"
  }
}

// List of major Indian cities with their coordinates for matching
export const indianCitiesCoordinates: Record<string, { lat: number; lng: number; radius: number }> = {
  Delhi: { lat: 28.7041, lng: 77.1025, radius: 35 },
  Mumbai: { lat: 19.0759, lng: 72.8776, radius: 30 },
  Bangalore: { lat: 12.9716, lng: 77.5946, radius: 25 },
  Kolkata: { lat: 22.5726, lng: 88.3639, radius: 25 },
  Pune: { lat: 18.5204, lng: 73.8567, radius: 20 },
  Hyderabad: { lat: 17.385, lng: 78.4867, radius: 25 },
  Chennai: { lat: 13.0827, lng: 80.2707, radius: 25 },
  Bhopal: { lat: 23.1815, lng: 77.4149, radius: 25 },
  Gurgaon: { lat: 28.4595, lng: 77.0266, radius: 20 },
  Indore: { lat: 22.7196, lng: 75.8577, radius: 20 },
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Find nearest city from user's coordinates
export function findNearestCity(lat: number, lng: number): string {
  let nearestCity = "Delhi"
  let minDistance = Number.POSITIVE_INFINITY

  for (const [city, coords] of Object.entries(indianCitiesCoordinates)) {
    const distance = calculateDistance(lat, lng, coords.lat, coords.lng)
    if (distance < minDistance) {
      minDistance = distance
      nearestCity = city
    }
  }

  console.log("[v0] City detection - Nearest city:", nearestCity, "Distance:", minDistance.toFixed(2), "km")
  return minDistance < 50 ? nearestCity : "Unknown"
}
