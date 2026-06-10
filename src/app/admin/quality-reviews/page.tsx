'use client'

import { useRequireRole } from '@/modules/auth/hooks/useRequireRole'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminQualityReviewsPage() {
  useRequireRole(['super_admin'])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quality Reviews</h1>
      <Card>
        <CardHeader>
          <CardTitle>Flagged Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Resources pending admin review will appear here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
