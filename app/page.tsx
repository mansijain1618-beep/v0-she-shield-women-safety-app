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
    <div className="min-h-screen bg-[#F8F5FF] dark:bg-[#0C0017] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/6 w-96 h-96 bg-[#7C3AED]/8 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 right-1/6 w-80 h-80 bg-[#4F46E5]/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <div className="pt-20 pb-12 px-4 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Text + SOS */}
          <div>
            <div className="text-left mb-6 animate-slide-down">
              <h1 className="text-5xl md:text-6xl font-bold text-[#7C3AED] mb-4">SheShield</h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6">
                Empowering women with intelligent safety tools — SOS alerts, safe routes, community reports and more.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div style={{ boxShadow: "0 0 15px rgba(79,70,229,0.6)" }} className="rounded-2xl p-6 bg-white dark:bg-[rgba(255,255,255,0.04)] border border-[#6D28D9]/40">
                <SOSButton onLocationDetected={setLocation} onAlertSent={setAlertSent} />
              </div>

              <div>
                <button
                  onClick={() => setShowHelplineModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#7C3AED] text-white rounded-xl font-semibold hover:shadow-md transition"
                >
                  <Phone className="w-5 h-5" />
                  Emergency Helplines
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Quick access to helpful numbers</p>
              </div>
            </div>

            {/* Live Coordinates (if available) */}
            {location && (
              <div className="mt-6 bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-xl p-4 border border-[#6D28D9]/30" style={{ boxShadow: "0 0 12px rgba(79,70,229,0.25)" }}>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">Live Coordinates</p>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#7C3AED]" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Latitude: {location.lat.toFixed(4)}</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Longitude: {location.lon.toFixed(4)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <img
                src="/illustrations/header-character.png"
                alt="SheShield illustration"
                className="w-full h-auto rounded-2xl shadow-lg"
                style={{ boxShadow: "0 10px 30px rgba(79,70,229,0.12)" }}
              />
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/safe-route" className="group">
            <div style={{ boxShadow: "0 0 15px rgba(79,70,229,0.18)" }} className="bg-white dark:bg-[rgba(255,255,255,0.03)] p-6 rounded-2xl border border-[#6D28D9]/30 hover:scale-[1.02] transition">
              <MapPin className="w-8 h-8 text-[#7C3AED] mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Safe Routes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">AI-powered route suggestions focused on safety.</p>
            </div>
          </Link>

          <Link href="/check-in" className="group">
            <div style={{ boxShadow: "0 0 15px rgba(79,70,229,0.12)" }} className="bg-white dark:bg-[rgba(255,255,255,0.03)] p-6 rounded-2xl border border-[#6D28D9]/30 hover:scale-[1.02] transition">
              <Heart className="w-8 h-8 text-[#7C3AED] mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Check-In</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Auto alerts if you miss a check-in.</p>
            </div>
          </Link>

          <Link href="/chatbot" className="group">
            <div style={{ boxShadow: "0 0 15px rgba(79,70,229,0.12)" }} className="bg-white dark:bg-[rgba(255,255,255,0.03)] p-6 rounded-2xl border border-[#6D28D9]/30 hover:scale-[1.02] transition">
              <MessageCircle className="w-8 h-8 text-[#7C3AED] mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">AI Chatbot</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Legal & emotional guidance instantly.</p>
            </div>
          </Link>

          <Link href="/community-alerts" className="group">
            <div style={{ boxShadow: "0 0 15px rgba(79,70,229,0.12)" }} className="bg-white dark:bg-[rgba(255,255,255,0.03)] p-6 rounded-2xl border border-[#6D28D9]/30 hover:scale-[1.02] transition">
              <AlertCircle className="w-8 h-8 text-[#7C3AED] mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Community Alerts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Report incidents & help map safe zones.</p>
            </div>
          </Link>

          <Link href="/dashboard" className="group">
            <div style={{ boxShadow: "0 0 15px rgba(79,70,229,0.12)" }} className="bg-white dark:bg-[rgba(255,255,255,0.03)] p-6 rounded-2xl border border-[#6D28D9]/30 hover:scale-[1.02] transition">
              <BarChart3 className="w-8 h-8 text-[#7C3AED] mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Dashboard</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Visualize safety trends and hotspots.</p>
            </div>
          </Link>

          <Link href="/resources" className="group">
            <div style={{ boxShadow: "0 0 15px rgba(79,70,229,0.12)" }} className="bg-white dark:bg-[rgba(255,255,255,0.03)] p-6 rounded-2xl border border-[#6D28D9]/30 hover:scale-[1.02] transition">
              <Users className="w-8 h-8 text-[#7C3AED] mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Resources</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Legal help, helplines, and shelters.</p>
            </div>
          </Link>
        </div>
      </div>

      <HelplineModal isOpen={showHelplineModal} onClose={() => setShowHelplineModal(false)} />
    </div>
  )
}
