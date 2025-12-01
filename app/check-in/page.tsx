"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Heart, Check, Clock, MapPin, Plus, Trash2, Users, AlertCircle, Navigation, Send, Target } from "lucide-react"

interface CheckInLog {
  id: string
  timestamp: string
  location: string
  status: "safe" | "emergency" | "pending"
  coordinates?: { lat: number; lng: number }
  notifiedContacts: string[]
  message?: string
}

interface TrustedContact {
  id: string
  name: string
  phone: string
  email: string
}

interface NearbyPoliceStation {
  id: number
  name: string
  lat: number
  lng: number
  phone: string
  distance: number
}

const INDIAN_CITIES = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Indore",
  "Kochi",
  "Surat",
  "Noida",
  "Gurgaon",
  "Bhopal",
  "Visakhapatnam",
]

export default function CheckInPage() {
  const [checkInLogs, setCheckInLogs] = useState<CheckInLog[]>([])
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([])
  const [showCheckInForm, setShowCheckInForm] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [location, setLocation] = useState("")
  const [message, setMessage] = useState("")
  const [suggestedCities, setSuggestedCities] = useState<string[]>([])
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyPolice, setNearbyPolice] = useState<NearbyPoliceStation[]>([])
  const [isTracking, setIsTracking] = useState(false)
  const [selectedCity, setSelectedCity] = useState("")
  const [checkInType, setCheckInType] = useState<"safe" | "emergency">("safe")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const savedLogs = localStorage.getItem("checkInLogs")
    const savedContacts = localStorage.getItem("trustedContacts")

    if (savedLogs) setCheckInLogs(JSON.parse(savedLogs))
    if (savedContacts) setTrustedContacts(JSON.parse(savedContacts))

    getLocationAndNearbyPolice()
  }, [])

  const getLocationAndNearbyPolice = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCoordinates(newCoords)

          if (selectedCity) {
            try {
              const response = await fetch("/api/nearby-police", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  latitude: newCoords.lat,
                  longitude: newCoords.lng,
                  city: selectedCity,
                }),
              })
              const data = await response.json()
              if (data.success) {
                setNearbyPolice(data.data.stations)
              }
            } catch (error) {
              console.error("Failed to fetch police stations:", error)
            }
          }
        },
        () => {
          console.log("Location access denied")
        },
      )
    }
  }

  const handleLocationChange = (value: string) => {
    setLocation(value)
    setSelectedCity(value)
    if (value.length > 0) {
      const filtered = INDIAN_CITIES.filter((city) => city.toLowerCase().startsWith(value.toLowerCase()))
      setSuggestedCities(filtered)
    } else {
      setSuggestedCities([])
    }
  }

  const handleCheckIn = async () => {
    if (!location.trim()) {
      alert("Please enter a location")
      return
    }

    if (!coordinates) {
      alert("Unable to get your location. Please enable location services.")
      return
    }

    if (trustedContacts.length === 0) {
      alert("Please add at least one trusted contact")
      return
    }

    setSending(true)

    try {
      const response = await fetch("/api/send-email-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contacts: trustedContacts,
          location,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          message: message || `${checkInType === "emergency" ? "EMERGENCY" : "Safety"} check-in from ${location}`,
          userName: "SheShield User",
          checkInType,
        }),
      })

      const alertData = await response.json()

      if (response.ok && alertData.success) {
        const newLog: CheckInLog = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString("en-IN"),
          location: location || "Safe Location",
          status: checkInType,
          coordinates,
          notifiedContacts: trustedContacts.map((c) => c.name),
          message,
        }

        const updated = [newLog, ...checkInLogs]
        setCheckInLogs(updated)
        localStorage.setItem("checkInLogs", JSON.stringify(updated))

        const contactList = trustedContacts.map((c) => c.name).join(", ")
        alert(
          `✓ ${checkInType.toUpperCase()} Check-in sent!\n\nNotified: ${contactList}\nLocation: ${location}\nCoordinates: ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}\n\nEmails will be sent to: ${trustedContacts.map((c) => c.email).join(", ")}`,
        )

        setLocation("")
        setMessage("")
        setSuggestedCities([])
        setShowCheckInForm(false)
        setCheckInType("safe")
      } else {
        alert("Failed to send check-in. Please try again.")
      }
    } catch (error) {
      console.error("Check-in error:", error)
      alert("Failed to send check-in. Please try again.")
    } finally {
      setSending(false)
    }
  }

  const handleAddContact = () => {
    if (!contactName.trim() || !contactPhone.trim() || !contactEmail.trim()) {
      alert("Please fill all fields")
      return
    }

    // Validate email format
    if (!contactEmail.includes("@")) {
      alert("Please enter a valid email address")
      return
    }

    const newContact: TrustedContact = {
      id: Date.now().toString(),
      name: contactName,
      phone: contactPhone,
      email: contactEmail,
    }

    const updated = [...trustedContacts, newContact]
    setTrustedContacts(updated)
    localStorage.setItem("trustedContacts", JSON.stringify(updated))

    setContactName("")
    setContactPhone("")
    setContactEmail("")
    setShowContactForm(false)
    alert(`✓ ${contactName} added as trusted contact!`)
  }

  const handleRemoveContact = (id: string) => {
    const updated = trustedContacts.filter((c) => c.id !== id)
    setTrustedContacts(updated)
    localStorage.setItem("trustedContacts", JSON.stringify(updated))
  }

  const toggleTracking = () => {
    setIsTracking(!isTracking)
    if (!isTracking) {
      const interval = setInterval(() => {
        getLocationAndNearbyPolice()
      }, 10000)
      return () => clearInterval(interval)
    }
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-background via-background to-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-accent/15 to-primary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 animate-slide-up">
            Check-In System
          </h1>
          <p className="text-foreground/70 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Stay connected with loved ones and nearby emergency services
          </p>

          {/* Trusted Contacts Section */}
          <div
            className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8 border-2 border-primary/20 animate-slide-up hover:border-primary/40 hover:shadow-2xl transition-all"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-xl">
                  <Users className="w-7 h-7 animate-bounce-light" />
                </div>
                Trusted Contacts ({trustedContacts.length})
              </h2>
              {!showContactForm && (
                <button
                  onClick={() => setShowContactForm(true)}
                  className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all transform flex items-center gap-2 animate-glow-gradient"
                >
                  <Plus className="w-5 h-5" />
                  Add Contact
                </button>
              )}
            </div>

            {showContactForm && (
              <div className="bg-card rounded-2xl p-6 mb-6 border-2 border-primary/30 space-y-4 animate-slide-in-left">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 bg-background transition"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (e.g., +91-9876543210)"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 bg-background transition"
                />
                <input
                  type="email"
                  placeholder="Email Address (required for alerts)"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 bg-background transition"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAddContact}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    Save Contact
                  </button>
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 bg-muted text-foreground py-3 rounded-xl font-bold hover:bg-muted/80 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {trustedContacts.length === 0 ? (
              <div className="bg-background rounded-2xl p-8 text-center border-2 border-primary/20">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-xl w-fit mx-auto mb-4">
                  <Users className="w-16 h-16 text-accent/70 animate-bounce-light" />
                </div>
                <p className="text-foreground/70 text-lg">Add trusted contacts to send them safety alerts</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trustedContacts.map((contact, idx) => (
                  <div
                    key={contact.id}
                    className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-4 border-2 border-primary/20 flex justify-between items-start hover:border-primary/50 transition animate-slide-up"
                    style={{ animationDelay: `${0.05 * idx}s` }}
                  >
                    <div>
                      <p className="font-bold text-foreground text-lg">{contact.name}</p>
                      <p className="text-sm text-foreground/60 flex items-center gap-1 mt-1">
                        <Send className="w-3 h-3" /> {contact.phone}
                      </p>
                      <p className="text-sm text-foreground/60">{contact.email}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveContact(contact.id)}
                      className="text-destructive hover:bg-destructive/20 p-2 rounded-lg transition hover:scale-110"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Check-In Form */}
          <div
            className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8 border-2 border-secondary/20 animate-slide-up hover:border-secondary/40 hover:shadow-2xl transition-all"
            style={{ animationDelay: "0.3s" }}
          >
            {!showCheckInForm ? (
              <div className="space-y-4">
                <button
                  onClick={() => setShowCheckInForm(true)}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground py-5 px-8 rounded-2xl font-bold hover:shadow-2xl transition-all hover:scale-105 animate-pulse-scale"
                >
                  <Heart className="w-7 h-7 animate-heartbeat" />
                  Send Safety Check-In
                </button>

                <button
                  onClick={toggleTracking}
                  className={`w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-bold transition-all hover:scale-105 ${
                    isTracking
                      ? "bg-destructive/20 text-destructive border-2 border-destructive animate-pulse"
                      : "bg-secondary/20 text-secondary border-2 border-secondary/50"
                  }`}
                >
                  <Navigation className={`w-6 h-6 ${isTracking ? "animate-rotate-slow" : ""}`} />
                  {isTracking ? "Tracking Active" : "Enable Live Tracking"}
                </button>
              </div>
            ) : (
              <div className="space-y-5 animate-slide-in-left">
                {/* Check-In Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Alert Type</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCheckInType("safe")}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all border-2 ${
                        checkInType === "safe"
                          ? "bg-primary text-primary-foreground border-primary shadow-lg"
                          : "bg-background text-foreground border-primary/30 hover:border-primary"
                      }`}
                    >
                      <Check className="w-5 h-5 inline mr-2" />
                      Safe Arrival
                    </button>
                    <button
                      onClick={() => setCheckInType("emergency")}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all border-2 ${
                        checkInType === "emergency"
                          ? "bg-destructive text-destructive-foreground border-destructive shadow-lg animate-pulse"
                          : "bg-background text-foreground border-destructive/30 hover:border-destructive"
                      }`}
                    >
                      <AlertCircle className="w-5 h-5 inline mr-2" />
                      Emergency
                    </button>
                  </div>
                </div>

                {/* Location Input */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Current Location</label>
                  <input
                    type="text"
                    placeholder="Start typing a city name..."
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 bg-background transition"
                  />
                  {coordinates && (
                    <p className="text-xs text-foreground/60 mt-2">
                      📍 {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                    </p>
                  )}
                  {suggestedCities.length > 0 && (
                    <div className="mt-2 border-2 border-primary/30 rounded-xl bg-card max-h-40 overflow-y-auto animate-slide-in-left">
                      {suggestedCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setLocation(city)
                            setSuggestedCities([])
                            setSelectedCity(city)
                            getLocationAndNearbyPolice()
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-primary/20 transition flex items-center gap-2 text-foreground border-b border-primary/10 last:border-b-0"
                        >
                          <MapPin className="w-5 h-5 text-primary" />
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom Message */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Message (Optional)</label>
                  <textarea
                    placeholder="Add any additional information..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 bg-background transition resize-none"
                    rows={3}
                  />
                </div>

                {nearbyPolice.length > 0 && (
                  <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-4">
                    <h3 className="font-bold text-destructive flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5" />
                      Nearby Police Stations
                    </h3>
                    <div className="space-y-2">
                      {nearbyPolice.map((station) => (
                        <div key={station.id} className="bg-card rounded-lg p-3 border border-destructive/20">
                          <p className="font-semibold text-foreground">{station.name}</p>
                          <p className="text-sm text-foreground/60">
                            📍 {station.distance.toFixed(1)} km | ☎️ {station.phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {trustedContacts.length === 0 && (
                  <div className="bg-accent/10 border-2 border-accent rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5 animate-bounce-light" />
                    <p className="text-sm text-foreground/70">Add trusted contacts above to send them notifications</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleCheckIn}
                    disabled={sending || trustedContacts.length === 0}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground py-4 px-8 rounded-2xl font-bold hover:shadow-xl transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? "Sending..." : "Send Check-In"}
                  </button>
                  <button
                    onClick={() => setShowCheckInForm(false)}
                    className="flex-1 bg-muted text-foreground py-4 px-8 rounded-2xl font-bold hover:bg-muted/80 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Check-In History */}
          {checkInLogs.length > 0 && (
            <div
              className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-primary/20 animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <Clock className="w-7 h-7" />
                Recent Check-Ins
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {checkInLogs.slice(0, 5).map((log, idx) => (
                  <div
                    key={log.id}
                    className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-xl border-l-4 border-primary animate-slide-up"
                    style={{ animationDelay: `${0.05 * idx}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{log.location}</p>
                        <p className="text-sm text-foreground/60">{log.timestamp}</p>
                        {log.coordinates && (
                          <p className="text-xs text-foreground/50">
                            📍 {log.coordinates.lat.toFixed(4)}, {log.coordinates.lng.toFixed(4)}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${log.status === "safe" ? "bg-green-500/20 text-green-700" : "bg-red-500/20 text-red-700"}`}
                      >
                        {log.status.toUpperCase()}
                      </span>
                    </div>
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
