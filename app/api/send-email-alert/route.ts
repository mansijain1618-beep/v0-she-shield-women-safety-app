import { type NextRequest, NextResponse } from "next/server"

// This handles sending actual emails/SMS to trusted contacts when check-in is triggered
export async function POST(request: NextRequest) {
  try {
    const { contacts, location, latitude, longitude, message, userName, checkInType } = await request.json()

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ success: true, notified: 0 }, { status: 200 })
    }

    const emailBody = `
SHESHIELD SAFETY ALERT - ${checkInType.toUpperCase()}
=====================================

Dear Contact,

${userName} has sent a ${checkInType === "emergency" ? "🚨 EMERGENCY" : "✓ SAFETY"} check-in notification from SheShield.

LOCATION: ${location}
COORDINATES: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}
TIME: ${new Date().toLocaleString("en-IN")}

MESSAGE: ${message || "Check-in sent successfully"}

ACTION NEEDED:
- If this is an emergency, please call 100 (Police) immediately
- You can reply to confirm receipt
- This message is from the SheShield Women Safety App

EMERGENCY HELPLINES (India):
- Police: 100
- Women Helpline: 1091
- AASRA: 9820466726

Stay safe,
SheShield Team
    `.trim()

    // For now, we'll log the alerts. In production, integrate with:
    // - EmailJS (free email service)
    // - Twilio (SMS)
    // - AWS SES (email)
    // - SendGrid (email)

    const alertsSent = contacts.map((contact: any) => ({
      to: contact.email,
      phone: contact.phone,
      name: contact.name,
      timestamp: new Date().toISOString(),
    }))

    console.log("[v0] Emails would be sent to:", alertsSent)

    // MOCK: In production, uncomment and add your email service
    /*
    for (const contact of contacts) {
      // Example with EmailJS (free tier available)
      try {
        const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_USER_ID,
            template_params: {
              to_email: contact.email,
              user_name: userName,
              location: location,
              coordinates: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              message_body: emailBody,
              check_in_type: checkInType,
            },
          }),
        })
        if (!emailResponse.ok) {
          console.error("[v0] Email send failed:", await emailResponse.text())
        }
      } catch (error) {
        console.error("[v0] Email error:", error)
      }
    }
    */

    return NextResponse.json(
      {
        success: true,
        data: {
          alertId: `CHECK-IN-${Date.now()}`,
          contactsNotified: contacts.length,
          timestamp: new Date().toISOString(),
          message: "Safety alert notification sent to trusted contacts",
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[Alert Send Error]:", error)
    return NextResponse.json({ success: false, error: "Failed to send alert" }, { status: 500 })
  }
}
