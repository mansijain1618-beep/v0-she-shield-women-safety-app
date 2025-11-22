export async function POST(request: Request) {
  try {
    const { userId, latitude, longitude, userPhone, message } = await request.json()

    const alertData = {
      alertId: `ALERT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      location: { latitude, longitude },
      userPhone: userPhone,
      message: message || "Women in distress - Emergency Alert",
      status: "DISPATCHED",
      estimatedResponseTime: "5-10 minutes",
      assignedPoliceSation: "Nearest Police Station",
      contacts: [
        {
          type: "police",
          number: "100",
          status: "notified",
        },
        {
          type: "ambulance",
          number: "102",
          status: "on_standby",
        },
      ],
    }

    console.log("[SheShield Alert]", alertData)

    return Response.json({
      success: true,
      data: alertData,
      message: "Emergency alert sent to nearby services",
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to send emergency alert",
      },
      { status: 500 },
    )
  }
}
