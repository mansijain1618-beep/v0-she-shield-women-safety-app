import { indiaData } from "@/lib/india-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") // "high-risk" or "safe"
  const city = searchParams.get("city")

  try {
    if (type === "high-risk") {
      const data = city
        ? indiaData.crimeSafetyData.highRiskAreas.filter((area) => area.city.toLowerCase().includes(city.toLowerCase()))
        : indiaData.crimeSafetyData.highRiskAreas

      return Response.json({
        success: true,
        type: "High Risk Areas",
        data: data,
        message: "High-risk areas in India",
      })
    }

    if (type === "safe") {
      const data = city
        ? indiaData.crimeSafetyData.safeAreas.filter((area) => area.city.toLowerCase().includes(city.toLowerCase()))
        : indiaData.crimeSafetyData.safeAreas

      return Response.json({
        success: true,
        type: "Safe Areas",
        data: data,
        message: "Safe areas in India",
      })
    }

    return Response.json({
      success: true,
      data: {
        highRiskAreas: indiaData.crimeSafetyData.highRiskAreas,
        safeAreas: indiaData.crimeSafetyData.safeAreas,
      },
      message: "All safety data",
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to fetch safety data",
      },
      { status: 500 },
    )
  }
}
