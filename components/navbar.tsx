"use client"

import Link from "next/link"
import { Shield } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-background via-card to-background backdrop-blur-xl border-b-2 border-primary/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-2xl hover:opacity-80 transition-all duration-300 group"
        >
          <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg group-hover:shadow-lg group-hover:shadow-primary/50 transition-all">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-extrabold">
            SheShield
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: "/", label: "🏠 Home" },
            { href: "/safe-route", label: "🗺️ Safe Routes" },
            { href: "/check-in", label: "✅ Check-In" },
            { href: "/chatbot", label: "💬 Chatbot" },
            { href: "/community-alerts", label: "🚨 Alerts" },
            { href: "/dashboard", label: "📊 Dashboard" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-foreground font-semibold hover:bg-primary/20 hover:text-primary rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-bold hover:shadow-lg transition-all">
            ☰ Menu
          </button>
        </div>
      </div>
    </nav>
  )
}
