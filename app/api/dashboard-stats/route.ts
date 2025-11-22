export async function GET() {
  try {
    const stats = {
      totalAwareness: {
        value: "28.5M",
        description: "Women reached through safety programs",
        trend: "+12% this year",
      },
      helplinesActive: {
        value: "150+",
        description: "Active helplines across India",
        trend: "24/7 availability",
      },
      casesResolved: {
        value: "89%",
        description: "Cases successfully resolved",
        trend: "Up from 82% last year",
      },
      commonCrimes: [
        { crime: "Eve Teasing", percentage: 35, count: 4250 },
        { crime: "Workplace Harassment", percentage: 28, count: 3400 },
        { crime: "Domestic Violence", percentage: 22, count: 2680 },
        { crime: "Cybercrime", percentage: 10, count: 1220 },
        { crime: "Other", percentage: 5, count: 610 },
      ],
      citiesCovered: [
        { city: "Delhi", coverage: 95, activeUsers: 125000 },
        { city: "Mumbai", coverage: 92, activeUsers: 98000 },
        { city: "Bangalore", coverage: 88, activeUsers: 75000 },
        { city: "Hyderabad", coverage: 85, activeUsers: 62000 },
        { city: "Pune", coverage: 82, activeUsers: 54000 },
      ],
      monthlyIncidents: [
        { month: "Jan", incidents: 1200 },
        { month: "Feb", incidents: 1150 },
        { month: "Mar", incidents: 1400 },
        { month: "Apr", incidents: 1380 },
        { month: "May", incidents: 1520 },
        { month: "Jun", incidents: 1650 },
      ],
    }

    return Response.json({
      success: true,
      data: stats,
      message: "Dashboard statistics retrieved",
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to fetch statistics",
      },
      { status: 500 },
    )
  }
}
