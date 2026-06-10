'use client'

import { useRequireRole } from '@/modules/auth/hooks/useRequireRole'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminResourcesPage() {
  useRequireRole(['super_admin'])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Resource Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Resource list with moderation controls will appear here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
