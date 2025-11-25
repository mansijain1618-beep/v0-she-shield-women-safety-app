import { type NextRequest, NextResponse } from "next/server"

const policeStations: Record<string, any[]> = {
  Bhopal: [
    { id: 1, name: "Bhopal Central Police Station", lat: 23.1815, lng: 77.4104, phone: "0755-2740100", distance: 0.5 },
    { id: 2, name: "New Market Police Station", lat: 23.1902, lng: 77.4287, phone: "0755-2740200", distance: 1.2 },
    { id: 3, name: "Arera Hills Police Station", lat: 23.1669, lng: 77.4396, phone: "0755-2740300", distance: 1.8 },
    { id: 4, name: "Habibganj Police Station", lat: 23.1741, lng: 77.4069, phone: "0755-2740400", distance: 0.8 },
  ],
  Delhi: [
    { id: 1, name: "New Delhi Police HQ", lat: 28.6139, lng: 77.209, phone: "011-23812100", distance: 0.3 },
    { id: 2, name: "Chanakyapuri Police Station", lat: 28.5599, lng: 77.1858, phone: "011-24611200", distance: 1.5 },
    { id: 3, name: "Malviya Nagar Police Station", lat: 28.5244, lng: 77.1867, phone: "011-24674400", distance: 2.1 },
  ],
  Mumbai: [
    {
      id: 1,
      name: "Mumbai Police Commissioner Office",
      lat: 19.0176,
      lng: 72.8479,
      phone: "022-23692222",
      distance: 0.4,
    },
    { id: 2, name: "Colaba Police Station", lat: 18.9572, lng: 72.8329, phone: "022-22021511", distance: 1.2 },
    { id: 3, name: "Marine Drive Police Station", lat: 18.9581, lng: 72.8261, phone: "022-22014500", distance: 0.9 },
  ],
  Bangalore: [
    {
      id: 1,
      name: "Bangalore Central Police Station",
      lat: 12.9716,
      lng: 77.6412,
      phone: "080-22942100",
      distance: 0.6,
    },
    { id: 2, name: "Whitefield Police Station", lat: 12.9698, lng: 77.7499, phone: "080-28520100", distance: 3.5 },
  ],
  Pune: [
    { id: 1, name: "Pune Central Police Station", lat: 18.5204, lng: 73.8567, phone: "020-26132111", distance: 0.5 },
    { id: 2, name: "Koregaon Park Police Station", lat: 18.5342, lng: 73.8872, phone: "020-26058400", distance: 1.1 },
  ],
}

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, city } = await request.json()

    if (!city || !policeStations[city]) {
      return NextResponse.json({ error: "City not found or no police stations available" }, { status: 404 })
    }

    const nearbyStations = policeStations[city]
      .map((station) => ({
        ...station,
        // Simple distance calculation
        distance: Math.sqrt(Math.pow(station.lat - latitude, 2) + Math.pow(station.lng - longitude, 2)) * 111,
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)

    return NextResponse.json(
      {
        success: true,
        data: {
          city,
          stations: nearbyStations,
          emergencyNumber: "100",
        },
        message: `Found ${nearbyStations.length} nearby police stations`,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[Police Station Error]:", error)
    return NextResponse.json({ error: "Failed to fetch police stations" }, { status: 500 })
  }
}
