"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import DestinationGallery from "@/components/destination-gallery"
import LocalBusinessDirectory from "@/components/local-business-directory"
import SOSFeature from "@/components/sos-feature"
import ReviewSystem from "@/components/review-system"
import Footer from "@/components/footer"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <main className="bg-background">
      <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Hero isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <DestinationGallery />
      <LocalBusinessDirectory />
      <SOSFeature />
      <ReviewSystem />
      <Footer />
    </main>
  )
}
