"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const destinations = [
  {
    id: 1,
    name: "Taj Mahal",
    city: "Agra, Uttar Pradesh",
    category: "Historical Monument",
    rating: 4.8,
    image: "/taj-mahal-mausoleum.png",
    description: "Marvel at the world-renowned monument of eternal love",
  },
  {
    id: 2,
    name: "Varanasi Ghats",
    city: "Varanasi, Uttar Pradesh",
    category: "Spiritual",
    rating: 4.7,
    image: "/varanasi-ghats.jpg",
    description: "Experience the spiritual heart of India",
  },
  {
    id: 3,
    name: "Jaipur City Palace",
    city: "Jaipur, Rajasthan",
    category: "Cultural Heritage",
    rating: 4.6,
    image: "/jaipur-city-palace.jpg",
    description: "Explore the pink city's architectural marvel",
  },
  {
    id: 4,
    name: "Backwaters of Kerala",
    city: "Kochi, Kerala",
    category: "Nature & Water",
    rating: 4.9,
    image: "/kerala-backwaters.jpg",
    description: "Serene houseboats and lush green landscapes",
  },
  {
    id: 5,
    name: "Rishikesh Yoga Capital",
    city: "Rishikesh, Uttarakhand",
    category: "Wellness",
    rating: 4.5,
    image: "/rishikesh-yoga.jpg",
    description: "Find peace and spiritual awakening",
  },
  {
    id: 6,
    name: "Goan Beaches",
    city: "Goa",
    category: "Beach & Adventure",
    rating: 4.4,
    image: "/goa-beaches.jpg",
    description: "Golden sands and azure waters await",
  },
]

export default function DestinationGallery() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <section id="destinations" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-12">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Explore
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Discover Popular Destinations</h2>
          <p className="text-lg text-muted-foreground">
            From ancient temples to modern marvels, explore India's diverse attractions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition group">
              <div className="relative overflow-hidden h-48 bg-muted">
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <button
                  onClick={() => toggleFavorite(destination.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:shadow-lg transition text-xl"
                >
                  {favorites.includes(destination.id) ? "❤️" : "🤍"}
                </button>
                <div className="absolute top-3 left-3 inline-block px-2 py-1 bg-white/90 text-xs font-semibold text-foreground rounded">
                  {destination.category}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{destination.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">📍 {destination.city}</p>
                </div>

                <p className="text-sm text-muted-foreground">{destination.description}</p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <span>{"⭐".repeat(Math.floor(destination.rating))}</span>
                    <span className="text-sm font-semibold ml-1">{destination.rating}</span>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            View All Destinations
          </Button>
        </div>
      </div>
    </section>
  )
}
