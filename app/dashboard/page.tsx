"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BarChart3, Users, AlertTriangle, TrendingUp } from "lucide-react"

interface DashboardStats {
  totalAwareness?: { value: string; description: string; trend: string }
  helplinesActive?: { value: string; description: string; trend: string }
  casesResolved?: { value: string; description: string; trend: string }
  commonCrimes?: Array<{ crime: string; percentage: number; count: number }>
  citiesCovered?: Array<{ city: string; coverage: number; activeUsers: number }>
  monthlyIncidents?: Array<{ month: string; incidents: number }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch("/api/dashboard-stats")
        const result = await response.json()
        if (result.success) {
          setStats(result.data)
        }
      } catch (error) {
        console.log("[v0] Failed to fetch dashboard stats:", error)
        setStats({
          commonCrimes: [
            { crime: "Eve Teasing", percentage: 35, count: 4250 },
            { crime: "Workplace Harassment", percentage: 28, count: 3400 },
            { crime: "Domestic Violence", percentage: 22, count: 2680 },
            { crime: "Cybercrime", percentage: 10, count: 1220 },
          ],
          monthlyIncidents: [
            { month: "Jan", incidents: 1200 },
            { month: "Feb", incidents: 1150 },
            { month: "Mar", incidents: 1400 },
            { month: "Apr", incidents: 1380 },
            { month: "May", incidents: 1520 },
            { month: "Jun", incidents: 1650 },
          ],
        })
      }
      setLoading(false)
    }

    fetchDashboardStats()
  }, [])

  const statsData = stats?.monthlyIncidents || []
  const riskDistribution =
    stats?.commonCrimes?.map((crime) => ({
      name: crime.crime,
      value: crime.percentage,
      color: crime.percentage > 30 ? "#ef4444" : crime.percentage > 20 ? "#f59e0b" : "#10b981",
    })) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50">
      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-2">Safety Dashboard</h1>
          <p className="text-gray-600 mb-8">Real-time statistics and community insights across India</p>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Reports</p>
                  <p className="text-4xl font-bold text-primary mt-2">324</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-pink-200" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Users</p>
                  <p className="text-4xl font-bold text-primary mt-2">1.2K</p>
                </div>
                <Users className="w-12 h-12 text-pink-200" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">High-Risk Areas</p>
                  <p className="text-4xl font-bold text-primary mt-2">12</p>
                </div>
                <BarChart3 className="w-12 h-12 text-pink-200" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Response Rate</p>
                  <p className="text-4xl font-bold text-primary mt-2">94%</p>
                </div>
                <TrendingUp className="w-12 h-12 text-pink-200" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Women Reached</p>
                  <p className="text-3xl font-bold text-primary mt-2">28.5M</p>
                  <p className="text-xs text-gray-500 mt-1">+12% this year</p>
                </div>
                <Users className="w-12 h-12 text-pink-200" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Helplines</p>
                  <p className="text-3xl font-bold text-primary mt-2">150+</p>
                  <p className="text-xs text-gray-500 mt-1">24/7 Available</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-pink-200" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Cases Resolved</p>
                  <p className="text-3xl font-bold text-primary mt-2">89%</p>
                  <p className="text-xs text-gray-500 mt-1">Up from 82%</p>
                </div>
                <BarChart3 className="w-12 h-12 text-pink-200" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Coverage</p>
                  <p className="text-3xl font-bold text-primary mt-2">18 Cities</p>
                  <p className="text-xs text-gray-500 mt-1">Pan-India</p>
                </div>
                <TrendingUp className="w-12 h-12 text-pink-200" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <h2 className="text-2xl font-bold text-foreground mb-4">Monthly Incidents Across India</h2>
              {statsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "2px solid #fb7185",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="incidents" fill="#b91c57" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">Loading data...</div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <h2 className="text-2xl font-bold text-foreground mb-4">Crime Distribution</h2>
              {riskDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">Loading data...</div>
              )}
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
            <h2 className="text-2xl font-bold text-foreground mb-4">Coverage Across India Cities</h2>
            <div className="space-y-3">
              {[
                { city: "Delhi", coverage: 95, users: 125000 },
                { city: "Mumbai", coverage: 92, users: 98000 },
                { city: "Bangalore", coverage: 88, users: 75000 },
                { city: "Hyderabad", coverage: 85, users: 62000 },
                { city: "Pune", coverage: 82, users: 54000 },
              ].map((city, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">{city.city}</p>
                    <p className="text-sm text-gray-500">{city.users.toLocaleString()} active users</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-pink-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${city.coverage}%` }}></div>
                    </div>
                    <span className="font-bold text-primary min-w-12">{city.coverage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
