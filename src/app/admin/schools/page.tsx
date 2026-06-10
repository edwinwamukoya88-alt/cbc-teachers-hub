'use client'

import { useRequireRole } from '@/modules/auth/hooks/useRequireRole'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminSchoolsPage() {
  useRequireRole(['super_admin'])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Schools</h1>
      <Card>
        <CardHeader>
          <CardTitle>Registered Schools</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">School list will appear here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
