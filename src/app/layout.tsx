import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { QueryProvider } from "@/components/QueryProvider"
import { AuthProvider } from "@/modules/auth/providers/AuthProvider"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "CBC Teachers Hub - AI-Powered CBC Teaching Platform",
    template: "%s | CBC Teachers Hub",
  },
  description: "Generate lesson plans, exams, schemes of work, rubrics, report cards and more — all aligned to KICD CBC standards.",
  keywords: ["CBC", "Kenya", "teacher", "lesson plans", "KICD", "education", "AI"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "CBC Teachers Hub",
    description: "AI-Powered CBC Teaching Platform for Kenyan educators",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
        <Analytics />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
