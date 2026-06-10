import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog - CBC Teachers Hub',
  description: 'Tips, guides, and resources for CBC teachers.',
}

export default function BlogPage() {
  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <p className="text-muted-foreground">Blog posts coming soon.</p>
    </div>
  )
}
