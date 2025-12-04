"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { AlertCircle, MapPin, Clock, Send, Shield } from "lucide-react"

interface Report {
  id: string
  type: "harassment" | "assault" | "suspicious" | "other"
  location: string
  timestamp: string
  description: string
  riskLevel: "low" | "medium" | "high"
  anonymous: boolean
}

export default function CommunityAlertsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [showForm, setShowForm] = useState(false)
  const [reportType, setReportType] = useState<"harassment" | "assault" | "suspicious" | "other">("suspicious")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [anonymous, setAnonymous] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("communityReports")
    if (saved) {
      setReports(JSON.parse(saved))
    } else {
      const sampleReports: Report[] = [
        {
          id: "1",
          type: "suspicious",
          location: "Central Park",
          timestamp: new Date(Date.now() - 3600000).toLocaleString(),
          description: "Suspicious activity near park entrance at night",
          riskLevel: "medium",
          anonymous: true,
        },
        {
          id: "2",
          type: "harassment",
          location: "Downtown Bus Station",
          timestamp: new Date(Date.now() - 7200000).toLocaleString(),
          description: "Verbal harassment from stranger",
          riskLevel: "low",
          anonymous: true,
        },
      ]
      setReports(sampleReports)
      localStorage.setItem("communityReports", JSON.stringify(sampleReports))
    }
  }, [])

  const handleSubmitReport = () => {
    if (!location.trim() || !description.trim()) {
      alert("Please fill in all fields")
      return
    }

    const newReport: Report = {
      id: Date.now().toString(),
      type: reportType,
      location,
      timestamp: new Date().toLocaleString(),
      description,
      riskLevel: reportType === "assault" ? "high" : reportType === "harassment" ? "medium" : "low",
      anonymous,
    }

    const updated = [newReport, ...reports]
    setReports(updated)
    localStorage.setItem("communityReports", JSON.stringify(updated))

    setLocation("")
    setDescription("")
    setReportType("suspicious")
    setShowForm(false)
    alert("Report submitted anonymously. Thank you for keeping the community safe!")
  }

  const handleDeleteReport = (id: string) => {
    const updated = reports.filter((r) => r.id !== id)
    setReports(updated)
    localStorage.setItem("communityReports", JSON.stringify(updated))
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-500/20 text-red-700 border-red-300"
      case "medium":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-300"
      case "low":
        return "bg-green-500/20 text-green-700 border-green-300"
      default:
        return "bg-muted text-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-80 h-80 bg-gradient-to-br from-accent/15 to-primary/10 rounded-full blur-3xl animate-blob-1"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-gradient-to-tl from-secondary/15 to-accent/10 rounded-full blur-3xl animate-blob-2"></div>
      </div>

      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 animate-slide-up">
            Community Alerts
          </h1>
          <p className="text-foreground/70 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Share and view community safety reports. All submissions are anonymous.
          </p>

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground py-5 px-8 rounded-2xl font-bold hover:shadow-2xl transition-all hover:scale-105 mb-8 animate-slide-up animate-glow-gradient"
              style={{ animationDelay: "0.2s" }}
            >
              <Send className="w-6 h-6" />
              Report an Incident
            </button>
          ) : (
            <div
              className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-primary/20 mb-8 animate-slide-in-left"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Submit Anonymous Report
              </h2>

              <div className="space-y-4">
                {/* Report Type */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Incident Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "harassment" as const, label: "Harassment" },
                      { value: "assault" as const, label: "Assault" },
                      { value: "suspicious" as const, label: "Suspicious Activity" },
                      { value: "other" as const, label: "Other" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setReportType(option.value)}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all border-2 ${
                          reportType === option.value
                            ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground border-primary"
                            : "bg-background text-foreground border-primary/20 hover:border-primary/50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Where did this happen?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 bg-background transition"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                  <textarea
                    placeholder="Describe what happened (optional details help the community)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 bg-background transition resize-none"
                    rows={4}
                  />
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="w-4 h-4 border-2 border-primary rounded"
                  />
                  <label htmlFor="anonymous" className="text-sm font-semibold text-foreground">
                    Post anonymously (recommended)
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmitReport}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105"
                  >
                    Submit Report
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-muted text-foreground py-3 rounded-xl font-bold hover:bg-muted/80 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reports List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mb-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              Community Reports
            </h2>
            {reports.length === 0 ? (
              <div
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 text-center border-2 border-primary/20 animate-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                <AlertCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-foreground/70">No reports yet. Be the first to share community insights!</p>
              </div>
            ) : (
              reports.map((report, idx) => (
                <div
                  key={report.id}
                  className={`bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-l-4 transition-all hover:shadow-lg animate-slide-up ${
                    report.riskLevel === "high"
                      ? "border-l-red-500 bg-gradient-to-r from-red-500/5 to-transparent"
                      : report.riskLevel === "medium"
                        ? "border-l-yellow-500 bg-gradient-to-r from-yellow-500/5 to-transparent"
                        : "border-l-green-500 bg-gradient-to-r from-green-500/5 to-transparent"
                  }`}
                  style={{ animationDelay: `${0.4 + idx * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`px-3 py-1 rounded-lg text-sm font-bold ${getRiskColor(report.riskLevel)} border`}
                      >
                        {report.riskLevel.toUpperCase()}
                      </div>
                      <span className="text-sm text-foreground/70 capitalize">{report.type}</span>
                    </div>
                    {report.anonymous && <span className="text-xs text-foreground/60">Anonymous</span>}
                  </div>

                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {report.location}
                  </p>
                  <p className="text-foreground/70 mb-3">{report.description}</p>
                  <p className="text-xs text-foreground/60 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {report.timestamp}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
