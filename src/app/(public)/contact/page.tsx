import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact - CBC Teachers Hub',
  description: 'Contact the CBC Teachers Hub team.',
}

export default function ContactPage() {
  return (
    <div className="container py-20">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Get in touch with our team. We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    </div>
  )
}
