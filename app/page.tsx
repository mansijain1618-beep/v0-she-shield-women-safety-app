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
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-primary/25 to-secondary/15 rounded-full blur-3xl animate-blob-1"></div>
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-tr from-accent/20 to-primary/15 rounded-full blur-3xl animate-blob-2"></div>
        <div
          className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-tl from-secondary/20 to-accent/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        {/* Additional decorative blob for depth */}
        <div
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <div className="pt-16 pb-20 px-4 md:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6 animate-slide-up">
            <div
              className="inline-block px-6 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full border border-primary/30 backdrop-blur-sm mb-4 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <p className="text-sm font-semibold text-primary">Welcome to SheShield</p>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-shift leading-tight">
              Your Safety,
              <br />
              Our Priority
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Empowering women with real-time safety features, intelligent routing, and emergency support. Experience
              technology designed for your protection.
            </p>
          </div>

          <div className="flex justify-center mb-20 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 to-red-500/20 blur-2xl rounded-full"></div>
              <SOSButton onLocationDetected={setLocation} onAlertSent={setAlertSent} />
            </div>
          </div>

          {location && (
            <div
              className="bg-gradient-to-br from-card/40 to-card/20 rounded-3xl p-8 shadow-2xl mb-16 max-w-md mx-auto border border-primary/20 animate-slide-up backdrop-blur-xl hover:shadow-2xl hover:border-primary/40 transition-all duration-300"
              style={{ animationDelay: "0.3s" }}
            >
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Live Coordinates</p>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-2xl flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">Lat: {location.lat.toFixed(4)}</p>
                  <p className="font-bold text-foreground text-lg">Lng: {location.lon.toFixed(4)}</p>
                </div>
              </div>
            </div>
          )}

          {alertSent && (
            <div
              className="bg-gradient-to-r from-green-500/15 to-emerald-500/10 border-2 border-green-400/40 rounded-2xl p-8 mb-16 max-w-md mx-auto animate-slide-up backdrop-blur-sm"
              style={{ animationDelay: "0.4s" }}
            >
              <p className="text-green-300 font-bold text-center flex items-center justify-center gap-3 text-lg">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                Alert sent successfully to emergency contacts
              </p>
            </div>
          )}

          {/* Quick Helpline Button */}
          <div className="flex justify-center mb-20 animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <button
              onClick={() => setShowHelplineModal(true)}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-glow-gradient transform"
            >
              <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              View Emergency Helplines
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                href: "/safe-route",
                icon: MapPin,
                title: "Safe Routes",
                desc: "AI-powered route recommendations with real-time crime data and safety scoring",
                color: "from-blue-500/20 to-cyan-500/10",
                delay: "0.6s",
              },
              {
                href: "/check-in",
                icon: Heart,
                title: "Check-In",
                desc: "Notify trusted contacts when you reach safely with location sharing",
                color: "from-pink-500/20 to-rose-500/10",
                delay: "0.7s",
              },
              {
                href: "/chatbot",
                icon: MessageCircle,
                title: "AI Chatbot",
                desc: "24/7 support with legal guidance, self-defense tips, and mental health resources",
                color: "from-purple-500/20 to-violet-500/10",
                delay: "0.8s",
              },
              {
                href: "/community-alerts",
                icon: AlertCircle,
                title: "Community Alerts",
                desc: "Anonymous incident reporting and real-time community safety insights",
                color: "from-orange-500/20 to-amber-500/10",
                delay: "0.9s",
              },
              {
                href: "/dashboard",
                icon: BarChart3,
                title: "Dashboard",
                desc: "Real-time safety statistics, trends, and high-risk area mapping",
                color: "from-green-500/20 to-emerald-500/10",
                delay: "1s",
              },
              {
                href: "/resources",
                icon: Users,
                title: "Resources",
                desc: "Comprehensive legal rights, support organizations, and educational guides",
                color: "from-indigo-500/20 to-blue-500/10",
                delay: "1.1s",
              },
            ].map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className="group animate-slide-up"
                style={{ animationDelay: feature.delay }}
              >
                <div
                  className={`bg-gradient-to-br ${feature.color} border border-primary/10 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full group-hover:border-primary/30 group-hover:bg-gradient-to-br group-hover:from-primary/10 group-hover:to-secondary/5 backdrop-blur-sm`}
                >
                  <div className="p-4 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-2xl w-fit mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">{feature.desc}</p>
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
