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
    })) || []

  const chartColors = ["#c366d9", "#e879c9", "#ff69b4", "#d47bde"]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl animate-blob-1"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-gradient-to-tl from-accent/15 to-primary/10 rounded-full blur-3xl animate-blob-2"></div>
      </div>

      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 animate-slide-up">
            Safety Dashboard
          </h1>
          <p className="text-foreground/70 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Real-time statistics and community insights across India
          </p>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Reports", value: "2,845", icon: AlertTriangle, color: "from-red-500/20 to-red-400/10" },
              { label: "Active Helplines", value: "150+", icon: Users, color: "from-primary/20 to-secondary/10" },
              {
                label: "Cases Resolved",
                value: "2,400+",
                icon: TrendingUp,
                color: "from-green-500/20 to-emerald-400/10",
              },
              { label: "Cities Covered", value: "18", icon: BarChart3, color: "from-accent/20 to-primary/10" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${stat.color} rounded-3xl p-6 shadow-lg border-2 border-primary/20 hover:border-primary/50 transition-all hover:shadow-xl animate-slide-up`}
                style={{ animationDelay: `${0.2 + idx * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/70 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-primary/20 rounded-2xl">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Incidents Chart */}
            <div
              className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-primary/20 animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Monthly Incidents Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(195, 102, 217, 0.2)" />
                  <XAxis dataKey="month" stroke="rgba(61, 31, 71, 0.6)" />
                  <YAxis stroke="rgba(61, 31, 71, 0.6)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "2px solid rgba(195, 102, 217, 0.3)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="incidents" fill="#c366d9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Crime Distribution Chart */}
            <div
              className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-primary/20 animate-slide-up"
              style={{ animationDelay: "0.5s" }}
            >
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Crime Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label
                    outerRadius={80}
                    fill="#c366d9"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "2px solid rgba(195, 102, 217, 0.3)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crime Details */}
          {stats?.commonCrimes && (
            <div
              className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-primary/20 animate-slide-up"
              style={{ animationDelay: "0.6s" }}
            >
              <h3 className="text-xl font-bold text-primary mb-6">Crime Breakdown</h3>
              <div className="space-y-4">
                {stats.commonCrimes.map((crime, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 border-l-4 border-primary animate-slide-up"
                    style={{ animationDelay: `${0.65 + idx * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{crime.crime}</p>
                      <span className="text-sm font-bold text-primary">{crime.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                        style={{ width: `${crime.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-foreground/60 mt-2">{crime.count} reported cases</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
