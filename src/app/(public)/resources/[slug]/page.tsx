import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resource - CBC Teachers Hub',
}

export default function PublicResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-8">Resource</h1>
      <p className="text-muted-foreground">Resource detail coming soon.</p>
    </div>
  )
}
