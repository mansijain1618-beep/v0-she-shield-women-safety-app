import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { contacts, location, latitude, longitude, message, userName } = await request.json()

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ error: "No contacts provided" }, { status: 400 })
    }

    const alertMessages = contacts.map((contact: any) => ({
      to: contact.phone,
      toEmail: contact.email,
      name: contact.name,
      message: `URGENT: ${userName} sent a safety check-in from ${location}. 
Location: ${latitude}, ${longitude}
Message: ${message}
Please respond if needed. This is from the SheShield safety app.`,
      timestamp: new Date().toISOString(),
      status: "sent",
    }))

    // In production, integrate with Twilio, AWS SNS, or WhatsApp Business API
    console.log("[SheShield Alert Messages Sent]:", alertMessages)

    return NextResponse.json(
      {
        success: true,
        data: {
          alertId: `CHECK-IN-${Date.now()}`,
          contactsNotified: contacts.map((c: any) => c.name),
          messages: alertMessages,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[Alert Send Error]:", error)
    return NextResponse.json({ error: "Failed to send alert" }, { status: 500 })
  }
}
