"use client"

import Link from "next/link"
import { Shield } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b-2 border-pink-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary hover:opacity-80 transition">
          <Shield className="w-8 h-8" />
          <span>SheShield</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition font-medium">
            Home
          </Link>
          <Link href="/safe-route" className="text-foreground hover:text-primary transition font-medium">
            Safe Routes
          </Link>
          <Link href="/check-in" className="text-foreground hover:text-primary transition font-medium">
            Check-In
          </Link>
          <Link href="/chatbot" className="text-foreground hover:text-primary transition font-medium">
            Chatbot
          </Link>
          <Link href="/community-alerts" className="text-foreground hover:text-primary transition font-medium">
            Alerts
          </Link>
          <Link href="/dashboard" className="text-foreground hover:text-primary transition font-medium">
            Dashboard
          </Link>
        </div>

        <div className="md:hidden">
          <button className="text-primary font-bold">Menu</button>
        </div>
      </div>
    </nav>
  )
}
