"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const businesses = [
  {
    id: 1,
    name: "Raj Kumar - Local Guide",
    type: "Tour Guide",
    location: "Jaipur, Rajasthan",
    rating: 4.9,
    languages: "English, Hindi, German",
    phone: "+91-9876543210",
    experience: "12 years",
  },
  {
    id: 2,
    name: "Artisan Handicrafts Co.",
    type: "Handicrafts",
    location: "Jaipur, Rajasthan",
    rating: 4.7,
    languages: "English, Hindi",
    phone: "+91-9876543211",
    experience: "25 years",
  },
  {
    id: 3,
    name: "Kerala Backwater Tours",
    type: "Houseboat Service",
    location: "Kochi, Kerala",
    rating: 4.8,
    languages: "English, Hindi, Malayalam",
    phone: "+91-9876543212",
    experience: "8 years",
  },
  {
    id: 4,
    name: "Himalayan Trek Guides",
    type: "Adventure Guide",
    location: "Rishikesh, Uttarakhand",
    rating: 4.6,
    languages: "English, Hindi",
    phone: "+91-9876543213",
    experience: "10 years",
  },
  {
    id: 5,
    name: "Goa Local Experiences",
    type: "Experience Provider",
    location: "Goa",
    rating: 4.7,
    languages: "English, Hindi, Portuguese",
    phone: "+91-9876543214",
    experience: "6 years",
  },
  {
    id: 6,
    name: "Varanasi Spiritual Tours",
    type: "Spiritual Guide",
    location: "Varanasi, Uttar Pradesh",
    rating: 4.9,
    languages: "English, Hindi, Sanskrit",
    phone: "+91-9876543215",
    experience: "15 years",
  },
]

export default function LocalBusinessDirectory() {
  return (
    <section id="businesses" className="py-16 md:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-12">
          <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
            Support Local
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Local Business Directory</h2>
          <p className="text-lg text-muted-foreground">
            Connect with local guides, artisans, and small businesses empowering Indian tourism
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Card key={business.id} className="p-6 hover:shadow-lg transition">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{business.name}</h3>
                  <p className="text-sm text-primary font-semibold mt-1">{business.type}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">📍 {business.location}</div>
                  <div className="flex items-center gap-2 text-muted-foreground">📞 {business.phone}</div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    👥 {business.experience} experience
                  </div>
                </div>

                <div className="py-2 border-y border-border">
                  <p className="text-xs font-semibold text-foreground mb-1">Languages</p>
                  <p className="text-sm text-muted-foreground">{business.languages}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {"⭐".repeat(Math.floor(business.rating))}
                    <span className="text-sm font-semibold">{business.rating}</span>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            Browse All Local Businesses
          </Button>
        </div>
      </div>
    </section>
  )
}
