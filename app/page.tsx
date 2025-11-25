"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import SOSButton from "@/components/sos-button"
import HelplineModal from "@/components/helpline-modal"
import { AlertCircle, MapPin, Heart, MessageCircle, BarChart3, Users, Phone } from "lucide-react"

export default function HomePage() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [alertSent, setAlertSent] = useState(false)
  const [showHelplineModal, setShowHelplineModal] = useState(false)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <div className="pt-20 pb-12 px-4 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Logo & Tagline */}
          <div className="text-center mb-12 animate-slide-down">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">SheShield</h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Empowering Women Through Safety & Technology
            </p>
          </div>

          {/* SOS Button - Central Focus */}
          <div className="flex justify-center mb-16 animate-pulse-scale">
            <SOSButton onLocationDetected={setLocation} onAlertSent={setAlertSent} />
          </div>

          {/* Location Display */}
          {location && (
            <div className="bg-card rounded-2xl p-6 shadow-lg mb-12 max-w-md mx-auto border-2 border-primary/30 animate-slide-up">
              <p className="text-sm text-muted-foreground mb-2">Live Coordinates</p>
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
            <div className="bg-green-900/30 border-2 border-green-500/50 rounded-2xl p-6 mb-12 max-w-md mx-auto animate-slide-up">
              <p className="text-green-400 font-semibold text-center">Alert sent to police and family members</p>
            </div>
          )}

          {/* Quick Helpline Button */}
          <div className="flex justify-center mb-12">
            <button
              onClick={() => setShowHelplineModal(true)}
              className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:shadow-xl hover:shadow-primary/50 transition shadow-lg animate-bounce-gentle"
            >
              <Phone className="w-6 h-6" />
              View Emergency Helplines
            </button>
          </div>

          {/* Quick Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Link href="/safe-route" className="group animate-slide-up">
              <div className="bg-card p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:border-primary border-2 border-primary/20 group-hover:bg-primary/10">
                <MapPin className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Safe Routes</h3>
                <p className="text-muted-foreground">
                  Get AI-powered safe route recommendations based on real-time crime data
                </p>
              </div>
            </Link>

            <Link href="/check-in" className="group animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="bg-card p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:border-primary border-2 border-primary/20 group-hover:bg-primary/10">
                <Heart className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Check-In</h3>
                <p className="text-muted-foreground">Send "I reached safely" notifications to trusted contacts</p>
              </div>
            </Link>

            <Link href="/chatbot" className="group animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="bg-card p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:border-primary border-2 border-primary/20 group-hover:bg-primary/10">
                <MessageCircle className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">AI Chatbot</h3>
                <p className="text-muted-foreground">Get instant guidance on safety laws and emergency procedures</p>
              </div>
            </Link>

            <Link href="/community-alerts" className="group animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="bg-card p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:border-primary border-2 border-primary/20 group-hover:bg-primary/10">
                <AlertCircle className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Community Alerts</h3>
                <p className="text-muted-foreground">Report incidents anonymously and view community safety insights</p>
              </div>
            </Link>

            <Link href="/dashboard" className="group animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="bg-card p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:border-primary border-2 border-primary/20 group-hover:bg-primary/10">
                <BarChart3 className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Dashboard</h3>
                <p className="text-muted-foreground">View real-time safety statistics and high-risk areas</p>
              </div>
            </Link>

            <Link href="/resources" className="group animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <div className="bg-card p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:border-primary border-2 border-primary/20 group-hover:bg-primary/10">
                <Users className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Resources</h3>
                <p className="text-muted-foreground">Learn about your rights, laws, and support resources</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <HelplineModal isOpen={showHelplineModal} onClose={() => setShowHelplineModal(false)} />
    </div>
  )
}
