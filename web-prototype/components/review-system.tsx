"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const reviews = [
  {
    id: 1,
    author: "Priya Sharma",
    destination: "Taj Mahal",
    rating: 5,
    text: "Amazing experience! The app made it so easy to find the best time to visit. Highly recommended!",
    date: "2 days ago",
  },
  {
    id: 2,
    author: "Raj Kumar",
    destination: "Kerala Backwaters",
    rating: 5,
    text: "Connected with a local guide through the app. He made the trip unforgettable. Supporting local businesses is great!",
    date: "1 week ago",
  },
  {
    id: 3,
    author: "Ananya Gupta",
    destination: "Jaipur City Palace",
    rating: 4,
    text: "Good information about the destination. Would love more detailed maps and guided tours.",
    date: "2 weeks ago",
  },
  {
    id: 4,
    author: "Vikram Singh",
    destination: "Varanasi Ghats",
    rating: 5,
    text: "The SOS feature gave me confidence to travel solo. Really impressed with the safety measures!",
    date: "3 weeks ago",
  },
]

export default function ReviewSystem() {
  const [newReview, setNewReview] = useState("")

  const handleSubmitReview = () => {
    if (newReview.trim()) {
      alert("Thank you! Your review has been submitted and will appear after moderation.")
      setNewReview("")
    }
  }

  return (
    <section id="reviews" className="py-16 md:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-12">
          <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
            Experiences
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Traveler Reviews & Ratings</h2>
          <p className="text-lg text-muted-foreground">
            Read authentic reviews from fellow travelers and share your experience
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reviews Column */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-foreground">{review.author}</h4>
                    <p className="text-sm text-muted-foreground">{review.destination}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>

                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-lg">
                      {i < review.rating ? "⭐" : "☆"}
                    </span>
                  ))}
                </div>

                <p className="text-foreground">{review.text}</p>
              </Card>
            ))}
          </div>

          {/* Write Review Section */}
          <Card className="p-6 h-fit sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-foreground">Share Your Experience</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Destination</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                  <option>Select a destination...</option>
                  <option>Taj Mahal</option>
                  <option>Varanasi Ghats</option>
                  <option>Kerala Backwaters</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button key={num} className="text-xl hover:scale-110 transition">
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Your Review</label>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Share your travel experience..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  rows={4}
                />
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleSubmitReview}
              >
                💬 Submit Review
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
