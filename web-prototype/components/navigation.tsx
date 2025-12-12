"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Navigation({
  isLoggedIn,
  setIsLoggedIn,
}: { isLoggedIn: boolean; setIsLoggedIn: (val: boolean) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold">📍</span>
            </div>
            <span className="font-bold text-lg text-foreground">Swadeshi Yatra</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#destinations" className="text-foreground hover:text-primary transition">
              Destinations
            </a>
            <a href="#businesses" className="text-foreground hover:text-primary transition">
              Local Businesses
            </a>
            <a href="#safety" className="text-foreground hover:text-primary transition">
              Safety
            </a>
            <a href="#reviews" className="text-foreground hover:text-primary transition">
              Reviews
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Button variant="outline" onClick={() => setIsLoggedIn(true)}>
                  Sign In
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setIsLoggedIn(true)}
                >
                  Join Now
                </Button>
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold">
                  S
                </div>
                <Button variant="ghost" onClick={() => setIsLoggedIn(false)}>
                  Sign Out
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground">
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <a href="#destinations" className="block text-foreground hover:text-primary">
              Destinations
            </a>
            <a href="#businesses" className="block text-foreground hover:text-primary">
              Local Businesses
            </a>
            <a href="#safety" className="block text-foreground hover:text-primary">
              Safety
            </a>
            <a href="#reviews" className="block text-foreground hover:text-primary">
              Reviews
            </a>
            <div className="flex gap-2 pt-2">
              {!isLoggedIn ? (
                <>
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsLoggedIn(true)}>
                    Sign In
                  </Button>
                  <Button className="flex-1 bg-primary text-primary-foreground" onClick={() => setIsLoggedIn(true)}>
                    Join
                  </Button>
                </>
              ) : (
                <Button variant="ghost" className="w-full" onClick={() => setIsLoggedIn(false)}>
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
