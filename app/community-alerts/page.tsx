"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { AlertCircle, MapPin, Clock, Eye, Send } from "lucide-react"

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
    // Load reports from localStorage
    const saved = localStorage.getItem("communityReports")
    if (saved) {
      setReports(JSON.parse(saved))
    } else {
      // Add sample reports
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

    alert("Report submitted successfully! Your report helps keep our community safe.")
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 border-green-300 text-green-700"
      case "medium":
        return "bg-yellow-100 border-yellow-300 text-yellow-700"
      case "high":
        return "bg-red-100 border-red-300 text-red-700"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50">
      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-2">Community Alert Reporting</h1>
          <p className="text-gray-600 mb-8">Report incidents anonymously and view community safety insights</p>

          {/* Report Form */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-8 border-2 border-pink-100">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 px-6 rounded-xl font-bold hover:bg-opacity-90 transition"
              >
                <AlertCircle className="w-6 h-6" />
                Report an Incident
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Incident Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full px-4 py-2 border-2 border-pink-100 rounded-lg focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="suspicious">Suspicious Activity</option>
                    <option value="harassment">Harassment</option>
                    <option value="assault">Assault</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Where did this happen?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-pink-100 rounded-lg focus:outline-none focus:border-primary bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                  <textarea
                    placeholder="Describe what happened..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-pink-100 rounded-lg focus:outline-none focus:border-primary bg-white resize-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-foreground">Report anonymously</span>
                </label>

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmitReport}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Submit Report
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 text-foreground py-3 rounded-xl font-bold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reports List */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Recent Reports</h2>
            {reports.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-md border-2 border-pink-100">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No reports yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-foreground text-lg capitalize">{report.type}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4" /> {report.location}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getRiskColor(report.riskLevel)}`}
                      >
                        {report.riskLevel.charAt(0).toUpperCase() + report.riskLevel.slice(1)} Risk
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3">{report.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {report.timestamp}
                      </p>
                      {report.anonymous && (
                        <p className="flex items-center gap-2">
                          <Eye className="w-4 h-4" /> Anonymous
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
