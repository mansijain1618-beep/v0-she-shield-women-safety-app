"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Heart, Check, Clock, MapPin, Plus, Trash2, Users, AlertCircle } from "lucide-react"

interface CheckInLog {
  id: string
  timestamp: string
  location: string
  status: "safe" | "delayed" | "pending"
  coordinates?: { lat: number; lng: number }
  notifiedContacts: string[]
}

interface TrustedContact {
  id: string
  name: string
  phone: string
  email: string
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
  const [notes, setNotes] = useState("")
  const [suggestedCities, setSuggestedCities] = useState<string[]>([])
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")

  useEffect(() => {
    const savedLogs = localStorage.getItem("checkInLogs")
    const savedContacts = localStorage.getItem("trustedContacts")

    if (savedLogs) setCheckInLogs(JSON.parse(savedLogs))
    if (savedContacts) setTrustedContacts(JSON.parse(savedContacts))
  }, [])

  const handleLocationChange = (value: string) => {
    setLocation(value)
    if (value.length > 0) {
      const filtered = INDIAN_CITIES.filter((city) => city.toLowerCase().startsWith(value.toLowerCase()))
      setSuggestedCities(filtered)
    } else {
      setSuggestedCities([])
    }
  }

  const handleCheckIn = () => {
    if (!location.trim()) {
      alert("Please enter a location")
      return
    }

    // Get user's current location if available
    let coordinates: { lat: number; lng: number } | undefined

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          sendCheckIn(coordinates)
        },
        () => {
          sendCheckIn(undefined)
        },
      )
    } else {
      sendCheckIn(undefined)
    }
  }

  const sendCheckIn = (coordinates: { lat: number; lng: number } | undefined) => {
    const newLog: CheckInLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString("en-IN"),
      location: location || "Safe Location",
      status: "safe",
      coordinates,
      notifiedContacts: trustedContacts.map((c) => c.name),
    }

    const updated = [newLog, ...checkInLogs]
    setCheckInLogs(updated)
    localStorage.setItem("checkInLogs", JSON.stringify(updated))

    // Simulate sending notifications to contacts
    if (trustedContacts.length > 0) {
      const contactList = trustedContacts.map((c) => c.name).join(", ")
      alert(`✓ Check-in sent to ${contactList}!\nLocation: ${location}\nTime: ${new Date().toLocaleTimeString()}`)
    } else {
      alert("✓ Check-in recorded! Add trusted contacts to send notifications.")
    }

    setLocation("")
    setNotes("")
    setSuggestedCities([])
    setShowCheckInForm(false)
  }

  const handleAddContact = () => {
    if (!contactName.trim() || !contactPhone.trim() || !contactEmail.trim()) {
      alert("Please fill all fields")
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <Navbar />

      <div className="pt-12 pb-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-2 animate-slide-up">Check-In System</h1>
          <p className="text-foreground/70 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Stay safe with real-time check-ins and trusted contact notifications.
          </p>

          {/* Trusted Contacts Section */}
          <div
            className="bg-card rounded-2xl p-6 shadow-lg mb-8 border border-border animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Users className="w-6 h-6" />
                Trusted Contacts ({trustedContacts.length})
              </h2>
              {!showContactForm && (
                <button
                  onClick={() => setShowContactForm(true)}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold hover:opacity-90 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Contact
                </button>
              )}
            </div>

            {showContactForm && (
              <div className="bg-background rounded-xl p-4 mb-4 border border-border space-y-3 animate-slide-up">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddContact}
                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-bold hover:opacity-90 transition"
                  >
                    Save Contact
                  </button>
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 bg-muted text-foreground py-2 rounded-lg font-bold hover:bg-muted/80 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {trustedContacts.length === 0 ? (
              <div className="bg-background rounded-xl p-6 text-center border border-border">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground/70">
                  No trusted contacts yet. Add your first contact to enable notifications.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {trustedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-background rounded-lg p-4 border border-border flex justify-between items-start animate-slide-in"
                  >
                    <div>
                      <p className="font-bold text-foreground">{contact.name}</p>
                      <p className="text-sm text-foreground/60">{contact.phone}</p>
                      <p className="text-sm text-foreground/60">{contact.email}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveContact(contact.id)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition"
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
            className="bg-card rounded-2xl p-6 shadow-lg mb-8 border border-border animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            {!showCheckInForm ? (
              <button
                onClick={() => setShowCheckInForm(true)}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-accent text-primary-foreground py-4 px-6 rounded-xl font-bold hover:shadow-lg transition hover:scale-105 animate-pulse-scale"
              >
                <Heart className="w-6 h-6 animate-bounce-soft" />
                Send Check-In Notification
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Current Location</label>
                  <input
                    type="text"
                    placeholder="Start typing a city name..."
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  />
                  {suggestedCities.length > 0 && (
                    <div className="mt-2 border-2 border-border rounded-lg bg-background max-h-40 overflow-y-auto animate-slide-up">
                      {suggestedCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setLocation(city)
                            setSuggestedCities([])
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-accent/20 transition flex items-center gap-2 text-foreground"
                        >
                          <MapPin className="w-4 h-4 text-primary" />
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {trustedContacts.length === 0 && (
                  <div className="bg-accent/10 border border-accent rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/70">
                      Add trusted contacts above to send notifications with your check-in
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleCheckIn}
                    className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Send Check-In
                  </button>
                  <button
                    onClick={() => {
                      setShowCheckInForm(false)
                      setSuggestedCities([])
                    }}
                    className="flex-1 bg-muted text-foreground py-3 rounded-xl font-bold hover:bg-muted/80 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Check-In History */}
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-2xl font-bold text-foreground mb-4">Recent Check-Ins</h2>
            {checkInLogs.length === 0 ? (
              <div className="bg-card rounded-2xl p-8 text-center shadow-lg border border-border">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground/70">No check-ins yet. Send your first one to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {checkInLogs.map((log, idx) => (
                  <div
                    key={log.id}
                    className="bg-card rounded-2xl p-4 shadow-md border border-border flex items-start justify-between animate-slide-in"
                    style={{ animationDelay: `${0.05 * idx}s` }}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        {log.location}
                      </p>
                      <p className="text-sm text-foreground/60 flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        {log.timestamp}
                      </p>
                      {log.notifiedContacts.length > 0 && (
                        <p className="text-xs text-primary mt-2 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Notified: {log.notifiedContacts.join(", ")}
                        </p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold flex items-center gap-1 whitespace-nowrap">
                      <Check className="w-4 h-4" />
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
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
