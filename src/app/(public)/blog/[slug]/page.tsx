import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Post - CBC Teachers Hub',
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-8">Blog Post</h1>
      <p className="text-muted-foreground">Blog post content coming soon.</p>
    </div>
  )
}
