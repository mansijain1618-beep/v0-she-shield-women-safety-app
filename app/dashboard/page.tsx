"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BarChart3, Users, AlertTriangle, TrendingUp } from "lucide-react"

interface DashboardStats {
  totalReports?: number
  activeUsers?: number
  highRiskAreas?: number
  responseRate?: number
  womenReached?: string
  helplines?: number
  casesResolved?: string
  citiesCovered?: number
  commonCrimes?: Array<{ crime: string; percentage: number; count: number }>
  monthlyIncidents?: Array<{ month: string; incidents: number }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 324,
    activeUsers: 1200,
    highRiskAreas: 12,
    responseRate: 94,
    womenReached: "28.5M",
    helplines: 150,
    casesResolved: "89%",
    citiesCovered: 18,
    commonCrimes: [
      { crime: "Eve Teasing", percentage: 35, count: 4250 },
      { crime: "Workplace Harassment", percentage: 28, count: 3400 },
      { crime: "Domestic Violence", percentage: 22, count: 2680 },
      { crime: "Cybercrime", percentage: 10, count: 1220 },
      { crime: "Stalking", percentage: 5, count: 610 },
    ],
    monthlyIncidents: [
      { month: "Jan", incidents: 1200 },
      { month: "Feb", incidents: 1150 },
      { month: "Mar", incidents: 1400 },
      { month: "Apr", incidents: 1380 },
      { month: "May", incidents: 1520 },
      { month: "Jun", incidents: 1650 },
      { month: "Jul", incidents: 1580 },
      { month: "Aug", incidents: 1720 },
    ],
  })

  const statsData = stats.monthlyIncidents || []
  const riskDistribution =
    stats.commonCrimes?.map((crime) => ({
      name: crime.crime,
      value: crime.percentage,
      count: crime.count,
    })) || []

  const chartColors = ["#b19cd9", "#db7093", "#9370db", "#da70d6", "#c8a2d0"]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/3 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-slide-down">
            <h1 className="text-4xl font-bold text-primary mb-2">Safety Dashboard</h1>
            <p className="text-muted-foreground">Real-time statistics and community insights across India</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-2xl p-6 shadow-md border-2 border-primary/30 hover:border-primary/60 transition animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Reports</p>
                  <p className="text-4xl font-bold text-primary mt-2">{stats.totalReports}</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-primary/30 animate-pulse-scale" />
              </div>
            </div>

            <div
              className="bg-card rounded-2xl p-6 shadow-md border-2 border-primary/30 hover:border-primary/60 transition animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Active Users</p>
                  <p className="text-4xl font-bold text-primary mt-2">{(stats.activeUsers / 1000).toFixed(1)}K</p>
                </div>
                <Users className="w-12 h-12 text-primary/30 animate-pulse-scale" />
              </div>
            </div>

            <div
              className="bg-card rounded-2xl p-6 shadow-md border-2 border-primary/30 hover:border-primary/60 transition animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">High-Risk Areas</p>
                  <p className="text-4xl font-bold text-primary mt-2">{stats.highRiskAreas}</p>
                </div>
                <BarChart3 className="w-12 h-12 text-primary/30 animate-pulse-scale" />
              </div>
            </div>

            <div
              className="bg-card rounded-2xl p-6 shadow-md border-2 border-primary/30 hover:border-primary/60 transition animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Response Rate</p>
                  <p className="text-4xl font-bold text-primary mt-2">{stats.responseRate}%</p>
                </div>
                <TrendingUp className="w-12 h-12 text-primary/30 animate-pulse-scale" />
              </div>
            </div>

            <div
              className="bg-card rounded-2xl p-6 shadow-md border-2 border-primary/30 hover:border-primary/60 transition animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Women Reached</p>
                  <p className="text-3xl font-bold text-primary mt-2">{stats.womenReached}</p>
                  <p className="text-xs text-muted-foreground mt-1">+12% this year</p>
                </div>
                <Users className="w-12 h-12 text-primary/30 animate-pulse-scale" />
              </div>
            </div>

            <div
              className="bg-card rounded-2xl p-6 shadow-md border-2 border-primary/30 hover:border-primary/60 transition animate-slide-up"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Active Helplines</p>
                  <p className="text-3xl font-bold text-primary mt-2">{stats.helplines}+</p>
                  <p className="text-xs text-muted-foreground mt-1">24/7 Available</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-primary/30 animate-pulse-scale" />
              </div>
            </div>

            <div
              className="bg-card rounded-2xl p-6 shadow-md border-2 border-primary/30 hover:border-primary/60 transition animate-slide-up"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Cases Resolved</p>
                  <p className="text-3xl font-bold text-primary mt-2">{stats.casesResolved}</p>
                  <p className="text-xs text-muted-foreground mt-1">Up from 82%</p>
                </div>
                <BarChart3 className="w-12 h-12 text-primary/30 animate-pulse-scale" />
              </div>
            </div>

            <div
              className="bg-card rounded-2xl p-6 shadow-md border-2 border-primary/30 hover:border-primary/60 transition animate-slide-up"
              style={{ animationDelay: "0.7s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Coverage</p>
                  <p className="text-3xl font-bold text-primary mt-2">{stats.citiesCovered} Cities</p>
                  <p className="text-xs text-muted-foreground mt-1">Pan-India</p>
                </div>
                <TrendingUp className="w-12 h-12 text-primary/30 animate-pulse-scale" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-card rounded-2xl p-6 shadow-md border-2 border-primary/30 animate-slide-up">
              <h2 className="text-2xl font-bold text-foreground mb-4">Monthly Incidents Across India</h2>
              {statsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3d2d4d" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "2px solid #b19cd9",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="incidents" fill="#b19cd9" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">Loading data...</div>
              )}
            </div>

            <div
              className="bg-card rounded-2xl p-6 shadow-md border-2 border-primary/30 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
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
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${value}%`}
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "2px solid #b19cd9",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">Loading data...</div>
              )}
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-card rounded-2xl p-6 shadow-md border-2 border-primary/30 animate-slide-up">
            <h2 className="text-2xl font-bold text-foreground mb-4">Coverage Across India Cities</h2>
            <div className="space-y-3">
              {[
                { city: "Delhi", coverage: 95, users: 125000 },
                { city: "Mumbai", coverage: 92, users: 98000 },
                { city: "Bangalore", coverage: 88, users: 75000 },
                { city: "Hyderabad", coverage: 85, users: 62000 },
                { city: "Pune", coverage: 82, users: 54000 },
                { city: "Bhopal", coverage: 78, users: 42000 },
                { city: "Kolkata", coverage: 80, users: 58000 },
              ].map((city, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition"
                >
                  <div>
                    <p className="font-semibold text-foreground">{city.city}</p>
                    <p className="text-sm text-muted-foreground">{city.users.toLocaleString()} active users</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-primary/20 rounded-full h-2">
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
