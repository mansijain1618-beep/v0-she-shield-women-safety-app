import { indiaData } from "@/lib/india-data"

export async function GET() {
  try {
    return Response.json({
      success: true,
      laws: indiaData.importantLaws,
      total: indiaData.importantLaws.length,
      message: "Laws protecting women in India",
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to fetch laws",
      },
      { status: 500 },
    )
  }
}
