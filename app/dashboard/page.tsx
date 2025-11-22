"use client"

import Navbar from "@/components/navbar"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BarChart3, Users, AlertTriangle, TrendingUp } from "lucide-react"

const statsData = [
  { month: "Jan", reports: 45 },
  { month: "Feb", reports: 52 },
  { month: "Mar", reports: 48 },
  { month: "Apr", reports: 61 },
  { month: "May", reports: 55 },
  { month: "Jun", reports: 67 },
]

const riskDistribution = [
  { name: "Low Risk", value: 35, color: "#10b981" },
  { name: "Medium Risk", value: 45, color: "#f59e0b" },
  { name: "High Risk", value: 20, color: "#ef4444" },
]

const topAreas = [
  { area: "Downtown", incidents: 23 },
  { area: "Central Park", incidents: 18 },
  { area: "Shopping District", incidents: 15 },
  { area: "Residential Area", incidents: 12 },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50">
      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-2">Safety Dashboard</h1>
          <p className="text-gray-600 mb-8">Real-time statistics and community insights</p>

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
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Bar Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <h2 className="text-2xl font-bold text-foreground mb-4">Reports Over Time</h2>
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
                  <Bar dataKey="reports" fill="#b91c57" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
              <h2 className="text-2xl font-bold text-foreground mb-4">Risk Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Risk Areas */}
          <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
            <h2 className="text-2xl font-bold text-foreground mb-4">Top Risk Areas</h2>
            <div className="space-y-3">
              {topAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
                  <p className="font-semibold text-foreground">
                    {index + 1}. {area.area}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-pink-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(area.incidents / 25) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-primary min-w-8">{area.incidents}</span>
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
