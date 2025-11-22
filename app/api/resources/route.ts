import { indiaData } from "@/lib/india-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const resourceType = searchParams.get("type") // "mental-health" or "self-defense"

  try {
    if (resourceType === "mental-health") {
      return Response.json({
        success: true,
        type: "Mental Health Resources",
        data: indiaData.mentalHealthResources,
        message: "Mental health support resources in India",
      })
    }

    if (resourceType === "self-defense") {
      return Response.json({
        success: true,
        type: "Self Defense Resources",
        data: indiaData.selfDefenseResources,
        message: "Self-defense resources and training",
      })
    }

    return Response.json({
      success: true,
      data: {
        mentalHealth: indiaData.mentalHealthResources,
        selfDefense: indiaData.selfDefenseResources,
      },
      message: "All support resources",
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to fetch resources",
      },
      { status: 500 },
    )
  }
}
