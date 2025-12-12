"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SOSFeature() {
  const [sosActive, setSosActive] = useState(false)

  const handleSOS = () => {
    setSosActive(!sosActive)
    if (!sosActive) {
      alert("🚨 SOS Activated! Emergency services and your emergency contacts have been notified.")
    } else {
      alert("✓ SOS Deactivated")
    }
  }

  return (
    <section id="safety" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-12">
          <div className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            Safety First
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Emergency Safety Features</h2>
          <p className="text-lg text-muted-foreground">Travel with confidence knowing help is just one tap away</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* SOS Button */}
          <Card className="p-8 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-background border-2 border-red-200">
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all text-4xl ${sosActive ? "bg-red-500 animate-pulse" : "bg-red-100"}`}
            >
              {sosActive ? "🚨" : "⚠️"}
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">Emergency SOS</h3>
            <p className="text-center text-muted-foreground mb-6">One-tap emergency alert system</p>
            <Button
              size="lg"
              className={`${sosActive ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"} text-white w-full`}
              onClick={handleSOS}
            >
              {sosActive ? "SOS ACTIVE - Click to Deactivate" : "ACTIVATE SOS"}
            </Button>
          </Card>

          {/* Features */}
          <div className="space-y-4">
            <Card className="p-6 hover:shadow-lg transition">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                  📍
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Live Location Sharing</h4>
                  <p className="text-sm text-muted-foreground">
                    Share your real-time GPS location with emergency contacts and authorities
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                  📞
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Auto Contact Alert</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically notify emergency contacts and local authorities in real-time
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                  🔄
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Travel Companion Alert</h4>
                  <p className="text-sm text-muted-foreground">
                    Notify your travel companions and send your location instantly
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
