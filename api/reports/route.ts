export async function GET() {
  const reports = [
    { id: 1, location: "Downtown", type: "harassment", timestamp: "2024-01-20T18:45:00Z" },
    { id: 2, location: "Central Park", type: "suspicious", timestamp: "2024-01-20T20:15:00Z" },
  ]

  return Response.json({ reports })
}

export async function POST(request: Request) {
  try {
    const report = await request.json()

    console.log("New report received:", {
      ...report,
      timestamp: new Date().toISOString(),
    })

    return Response.json(
      {
        success: true,
        message: "Report submitted successfully",
        reportId: `REPORT-${Date.now()}`,
      },
      { status: 201 },
    )
  } catch (error) {
    return Response.json({ error: "Failed to submit report" }, { status: 500 })
  }
}
