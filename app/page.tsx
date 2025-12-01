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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-full blur-3xl animate-blob-1"></div>
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-tr from-accent/15 to-primary/10 rounded-full blur-3xl animate-blob-2"></div>
        <div
          className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-tl from-secondary/15 to-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <div className="pt-20 pb-12 px-4 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Logo & Tagline */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4 animate-gradient-shift">
              SheShield
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 mb-8">Empowering Women Through Safety & Technology</p>
          </div>

          {/* SOS Button - Central Focus */}
          <div className="flex justify-center mb-16 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <SOSButton onLocationDetected={setLocation} onAlertSent={setAlertSent} />
          </div>

          {/* Location Display */}
          {location && (
            <div
              className="bg-card rounded-3xl p-6 shadow-xl mb-12 max-w-md mx-auto border-2 border-primary/30 animate-slide-up backdrop-blur-sm hover:shadow-2xl hover:border-primary/60 transition-all"
              style={{ animationDelay: "0.2s" }}
            >
              <p className="text-sm text-muted-foreground mb-2">Live Coordinates</p>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-xl">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Lat: {location.lat.toFixed(4)}</p>
                  <p className="font-semibold text-foreground">Lng: {location.lon.toFixed(4)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {alertSent && (
            <div
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/10 border-2 border-green-400/50 rounded-2xl p-6 mb-12 max-w-md mx-auto animate-slide-up backdrop-blur-sm"
              style={{ animationDelay: "0.3s" }}
            >
              <p className="text-green-700 font-semibold text-center flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Alert sent to police and family members
              </p>
            </div>
          )}

          {/* Quick Helpline Button */}
          <div className="flex justify-center mb-12 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <button
              onClick={() => setShowHelplineModal(true)}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-2xl font-bold hover:shadow-lg hover:scale-105 transition-all transform duration-300 animate-glow-gradient"
            >
              <Phone className="w-6 h-6" />
              View Emergency Helplines
            </button>
          </div>

          {/* Quick Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                href: "/safe-route",
                icon: MapPin,
                title: "Safe Routes",
                desc: "Get AI-powered safe route recommendations based on real-time crime data",
                delay: "0.5s",
              },
              {
                href: "/check-in",
                icon: Heart,
                title: "Check-In",
                desc: "Send 'I reached safely' notifications to trusted contacts",
                delay: "0.6s",
              },
              {
                href: "/chatbot",
                icon: MessageCircle,
                title: "AI Chatbot",
                desc: "Get instant guidance on safety laws and emergency procedures",
                delay: "0.7s",
              },
              {
                href: "/community-alerts",
                icon: AlertCircle,
                title: "Community Alerts",
                desc: "Report incidents anonymously and view community safety insights",
                delay: "0.8s",
              },
              {
                href: "/dashboard",
                icon: BarChart3,
                title: "Dashboard",
                desc: "View real-time safety statistics and high-risk areas",
                delay: "0.9s",
              },
              {
                href: "/resources",
                icon: Users,
                title: "Resources",
                desc: "Learn about your rights, laws, and support resources",
                delay: "1s",
              },
            ].map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className="group animate-slide-up"
                style={{ animationDelay: feature.delay }}
              >
                <div className="bg-card p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all border-2 border-transparent hover:border-primary/50 h-full group-hover:bg-gradient-to-br group-hover:from-primary/5 group-hover:to-secondary/5">
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-foreground/70 text-sm">{feature.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <HelplineModal isOpen={showHelplineModal} onClose={() => setShowHelplineModal(false)} />
    </div>
  )
}
