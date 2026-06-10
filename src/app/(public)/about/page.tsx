import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About - CBC Teachers Hub',
  description: 'About CBC Teachers Hub.',
}

export default function AboutPage() {
  return (
    <div className="container py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About CBC Teachers Hub</h1>
        <p className="text-lg text-muted-foreground mb-8">
          We are building Africa&apos;s most powerful AI platform for CBC teachers. Our mission is to reduce teacher workload
          and improve educational quality across Kenya through the power of artificial intelligence.
        </p>
        <p className="text-lg text-muted-foreground mb-8">
          Every tool is aligned with KICD curriculum standards, ensuring that generated content is classroom-ready
          and curriculum-compliant from day one.
        </p>
      </div>
    </div>
  )
}
