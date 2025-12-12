"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Hero({
  isLoggedIn,
  setIsLoggedIn,
}: { isLoggedIn: boolean; setIsLoggedIn: (val: boolean) => void }) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`Searching for destinations matching: "${searchQuery}"`)
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
                Discover India's Hidden Treasures
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Explore authentic Indian destinations, support local businesses, and travel safely with Swadeshi Yatra -
                empowering Atmanirbhar Bharat.
              </p>
            </div>

            {/* Search Box */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search destinations, cities, or experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                Search
              </Button>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Explore Destinations
              </Button>
              {!isLoggedIn && (
                <Button size="lg" variant="outline" onClick={() => setIsLoggedIn(true)}>
                  Create Account
                </Button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span>Secure & Trusted</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>500+ Destinations</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden md:block">
            <div className="relative h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl overflow-hidden flex items-center justify-center">
              <img src="/indian-temples-and-monuments.jpg" alt="Indian destinations" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
