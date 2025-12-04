"use client"

import Link from "next/link"
import { Shield } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#F8F5FF] dark:bg-[#0C0017] border-b border-[#EDE7FF] dark:border-[#1a1226] backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-[#4F46E5] hover:opacity-90 transition">
          <div style={{ boxShadow: "0 0 10px rgba(79,70,229,0.18)" }} className="rounded-full p-2 bg-white dark:bg-[rgba(255,255,255,0.03)] border border-[#6D28D9]/20">
            <Shield className="w-6 h-6 text-[#7C3AED]" />
          </div>
          <span className="text-gray-900 dark:text-white">SheShield</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-900 dark:text-gray-100 hover:text-[#7C3AED] transition font-medium">
            Home
          </Link>
          <Link href="/safe-route" className="text-gray-900 dark:text-gray-100 hover:text-[#7C3AED] transition font-medium">
            Safe Routes
          </Link>
          <Link href="/check-in" className="text-gray-900 dark:text-gray-100 hover:text-[#7C3AED] transition font-medium">
            Check-In
          </Link>
          <Link href="/chatbot" className="text-gray-900 dark:text-gray-100 hover:text-[#7C3AED] transition font-medium">
            Chatbot
          </Link>
          <Link href="/community-alerts" className="text-gray-900 dark:text-gray-100 hover:text-[#7C3AED] transition font-medium">
            Alerts
          </Link>
          <Link href="/dashboard" className="text-gray-900 dark:text-gray-100 hover:text-[#7C3AED] transition font-medium">
            Dashboard
          </Link>
        </div>

        <div className="md:hidden">
          <button className="text-[#7C3AED] font-bold">Menu</button>
        </div>
      </div>
    </nav>
  )
}
