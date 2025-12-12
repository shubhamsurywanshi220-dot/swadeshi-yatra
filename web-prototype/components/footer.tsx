export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground">📍</span>
              </div>
              <span className="font-bold text-lg">Swadeshi Yatra</span>
            </div>
            <p className="text-sm text-muted-foreground">Empowering Indian Tourism for an Atmanirbhar Bharat</p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-bold mb-3 text-foreground">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Destinations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Local Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Experiences
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Hotels & Stays
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-3 text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Safety Tips
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-3 text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">✉️ support@swadeshi.in</li>
              <li className="flex items-center gap-2 text-muted-foreground">📞 +91-1800-YATRA-10</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Swadeshi Yatra. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                📘
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                📷
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                𝕏
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
