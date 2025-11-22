"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Scale, Heart, Shield, Phone } from "lucide-react"

interface Law {
  name: string
  description: string
  punishment: string
  applicable: string
}

interface Resource {
  name: string
  description?: string
  type?: string
  availability?: string
}

export default function ResourcesPage() {
  const [laws, setLaws] = useState<Law[]>([])
  const [resources, setResources] = useState({ mentalHealth: [], selfDefense: [] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"laws" | "mental-health" | "self-defense">("laws")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lawsResponse = await fetch("/api/laws")
        const lawsResult = await lawsResponse.json()
        if (lawsResult.success) {
          setLaws(lawsResult.laws)
        }

        const resourcesResponse = await fetch("/api/resources")
        const resourcesResult = await resourcesResponse.json()
        if (resourcesResult.success) {
          setResources({
            mentalHealth: resourcesResult.data.mentalHealth || [],
            selfDefense: resourcesResult.data.selfDefense || [],
          })
        }
      } catch (error) {
        console.log("[v0] Failed to fetch resources:", error)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50">
      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-2">Women's Resources & Rights</h1>
          <p className="text-gray-600 mb-8">Comprehensive guide to laws, rights, and support systems across India</p>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 flex-wrap">
            <button
              onClick={() => setActiveTab("laws")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === "laws"
                  ? "bg-primary text-white"
                  : "bg-white text-foreground border-2 border-pink-100 hover:border-primary"
              }`}
            >
              <Scale className="w-5 h-5" /> Laws & Rights
            </button>
            <button
              onClick={() => setActiveTab("mental-health")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === "mental-health"
                  ? "bg-primary text-white"
                  : "bg-white text-foreground border-2 border-pink-100 hover:border-primary"
              }`}
            >
              <Heart className="w-5 h-5" /> Mental Health
            </button>
            <button
              onClick={() => setActiveTab("self-defense")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === "self-defense"
                  ? "bg-primary text-white"
                  : "bg-white text-foreground border-2 border-pink-100 hover:border-primary"
              }`}
            >
              <Shield className="w-5 h-5" /> Self-Defense
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading resources...</p>
            </div>
          ) : (
            <>
              {/* Laws & Rights */}
              {activeTab === "laws" && (
                <div className="space-y-4">
                  {laws.length > 0 ? (
                    laws.map((law, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-primary hover:shadow-lg transition"
                      >
                        <h3 className="text-2xl font-bold text-primary mb-2">{law.name}</h3>
                        <p className="text-gray-700 mb-3 leading-relaxed">{law.description}</p>
                        <div className="grid md:grid-cols-2 gap-4 pt-3 border-t-2 border-pink-100">
                          <div>
                            <p className="text-sm text-gray-600 font-semibold mb-1">Punishment</p>
                            <p className="text-foreground font-medium">{law.punishment}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 font-semibold mb-1">Applicable</p>
                            <p className="text-foreground font-medium">{law.applicable}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">No laws found</div>
                  )}
                </div>
              )}

              {/* Mental Health Resources */}
              {activeTab === "mental-health" && (
                <div className="space-y-4">
                  {resources.mentalHealth.length > 0 ? (
                    resources.mentalHealth.map((resource: any, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-primary hover:shadow-lg transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-primary mb-2">{resource.name}</h3>
                            <p className="text-gray-700 mb-3">{resource.description}</p>
                            <div className="flex flex-wrap gap-4">
                              {resource.type && (
                                <span className="px-3 py-1 bg-pink-100 text-primary rounded-full text-sm font-medium">
                                  {resource.type}
                                </span>
                              )}
                              {resource.phone && (
                                <div className="flex items-center gap-2 text-primary font-semibold">
                                  <Phone className="w-4 h-4" />
                                  <a href={`tel:${resource.phone}`}>{resource.phone}</a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">No resources found</div>
                  )}
                </div>
              )}

              {/* Self-Defense Resources */}
              {activeTab === "self-defense" && (
                <div className="space-y-4">
                  {resources.selfDefense.length > 0 ? (
                    resources.selfDefense.map((resource: any, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-primary hover:shadow-lg transition"
                      >
                        <h3 className="text-2xl font-bold text-primary mb-4">{resource.name}</h3>
                        <p className="text-gray-700 mb-4">{resource.description}</p>
                        {resource.cities && (
                          <div>
                            <p className="font-semibold text-foreground mb-3">Available in:</p>
                            <div className="flex flex-wrap gap-2">
                              {resource.cities.map((city: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 bg-pink-100 text-primary rounded-full text-sm">
                                  {city}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {resource.tools && (
                          <div className="mt-4 space-y-2">
                            {resource.tools.map((tool: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
                                <span className="text-primary font-bold mt-1">✓</span>
                                <div>
                                  <p className="font-semibold text-foreground">{tool.name}</p>
                                  <p className="text-sm text-gray-600">{tool.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">No resources found</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
