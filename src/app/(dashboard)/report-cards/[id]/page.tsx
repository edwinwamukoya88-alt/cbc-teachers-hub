import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Report Card - CBC Teachers Hub',
}

export default function ReportCardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Report Card</h1>
      <p className="text-muted-foreground">Loading report card...</p>
    </div>
  )
}
