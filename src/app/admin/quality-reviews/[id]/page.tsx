'use client'

import { useRequireRole } from '@/modules/auth/hooks/useRequireRole'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  useRequireRole(['super_admin'])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Review Detail</h1>
      <Card>
        <CardHeader>
          <CardTitle>Quality Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Detailed review with admin override controls.</p>
        </CardContent>
      </Card>
    </div>
  )
}
