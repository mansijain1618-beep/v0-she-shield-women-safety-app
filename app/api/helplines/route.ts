import { indiaData } from "@/lib/india-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const category = searchParams.get("category")

  try {
    if (!city) {
      return Response.json({
        success: true,
        data: indiaData.emergencyHelplines.national,
        message: "National helplines retrieved",
      })
    }

    const cityKey = city.toLowerCase()
    const cityHelplines = (indiaData.emergencyHelplines.cityWise as Record<string, any>)[cityKey]

    if (cityHelplines) {
      return Response.json({
        success: true,
        data: cityHelplines,
        city: city,
        message: `Helplines for ${city} retrieved`,
      })
    }

    return Response.json({
      success: false,
      message: "City not found in database",
      availableCities: Object.keys(indiaData.emergencyHelplines.cityWise),
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to fetch helplines",
      },
      { status: 500 },
    )
  }
}
