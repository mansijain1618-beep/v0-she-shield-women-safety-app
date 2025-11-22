"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import SOSButton from "@/components/sos-button"
import { AlertCircle, MapPin, Heart, MessageCircle, BarChart3, Users } from "lucide-react"

export default function HomePage() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [alertSent, setAlertSent] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-20 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Logo & Tagline */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">SheShield</h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">Empowering Women Through Safety & Technology</p>
          </div>

          {/* SOS Button - Central Focus */}
          <div className="flex justify-center mb-16">
            <SOSButton onLocationDetected={setLocation} onAlertSent={setAlertSent} />
          </div>

          {/* Location Display */}
          {location && (
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-12 max-w-md mx-auto border-2 border-pink-100">
              <p className="text-sm text-gray-500 mb-2">Live Coordinates</p>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Latitude: {location.lat.toFixed(4)}</p>
                  <p className="font-semibold text-foreground">Longitude: {location.lon.toFixed(4)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {alertSent && (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-12 max-w-md mx-auto">
              <p className="text-green-700 font-semibold text-center">Alert sent to police and family members</p>
            </div>
          )}

          {/* Quick Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Link href="/safe-route" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:border-primary border-2 border-transparent">
                <MapPin className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Safe Routes</h3>
                <p className="text-gray-600">Get AI-powered safe route recommendations based on real-time crime data</p>
              </div>
            </Link>

            <Link href="/check-in" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:border-primary border-2 border-transparent">
                <Heart className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Check-In</h3>
                <p className="text-gray-600">Send "I reached safely" notifications to trusted contacts</p>
              </div>
            </Link>

            <Link href="/chatbot" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:border-primary border-2 border-transparent">
                <MessageCircle className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">AI Chatbot</h3>
                <p className="text-gray-600">Get instant guidance on safety laws and emergency procedures</p>
              </div>
            </Link>

            <Link href="/community-alerts" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:border-primary border-2 border-transparent">
                <AlertCircle className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Community Alerts</h3>
                <p className="text-gray-600">Report incidents anonymously and view community safety insights</p>
              </div>
            </Link>

            <Link href="/dashboard" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:border-primary border-2 border-transparent">
                <BarChart3 className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Dashboard</h3>
                <p className="text-gray-600">View real-time safety statistics and high-risk areas</p>
              </div>
            </Link>

            <Link href="/check-in" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:border-primary border-2 border-transparent">
                <Users className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Community</h3>
                <p className="text-gray-600">Connect with women and safety advocates in your area</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
