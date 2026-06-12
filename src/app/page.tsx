'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CalendarRange, ClipboardCheck, GraduationCap, Sparkles, BookOpen, Search, ShieldCheck } from 'lucide-react'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Footer } from '@/components/layout/Footer'

const features = [
  { title: 'Lesson Plans', description: 'Generate CBC-aligned lesson plans with AI in seconds.', icon: FileText },
  { title: 'Schemes of Work', description: 'Create termly schemes mapped to KICD strands.', icon: CalendarRange },
  { title: 'Exams & Marking Schemes', description: 'Generate exams with Bloom\'s taxonomy distribution.', icon: ClipboardCheck },
  { title: 'Report Cards', description: 'Full CBC report cards with competency radar charts.', icon: GraduationCap },
  { title: 'Smart Search', description: 'AI-powered search across the resource library.', icon: Search },
  { title: 'Quality Checker', description: 'Auto-verify resources for curriculum alignment.', icon: ShieldCheck },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
      <section className="container py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            AI-Powered CBC Teaching Platform
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Teach CBC Smarter
            <span className="block text-primary">with AI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate lesson plans, schemes of work, exams, rubrics, and report cards — all aligned to KICD CBC standards.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => router.push('/signup')}>Start Free</Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/pricing')}>View Pricing</Button>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Everything You Need</h2>
          <p className="text-muted-foreground mt-2">AI tools built for the Kenyan CBC curriculum</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="border-t bg-muted/50 py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Teaching?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of Kenyan teachers using AI to save time and improve quality.
          </p>
          <Button size="lg" onClick={() => router.push('/signup')}>Get Started Free</Button>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  )
}
