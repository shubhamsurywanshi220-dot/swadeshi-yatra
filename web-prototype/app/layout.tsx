import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Poppins } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Swadeshi Yatra - Indian Tourism",
  description: "Empowering Indian Tourism for an Atmanirbhar Bharat",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#FF6B35",
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  )
}
