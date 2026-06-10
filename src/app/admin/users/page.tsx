'use client'

import { useRequireRole } from '@/modules/auth/hooks/useRequireRole'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminUsersPage() {
  useRequireRole(['super_admin'])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">User list will appear here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
