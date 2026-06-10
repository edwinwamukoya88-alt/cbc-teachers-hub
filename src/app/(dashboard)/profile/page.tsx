'use client'

import { useRequireAuth } from '@/modules/auth/hooks/useRequireAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Phone } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useRequireAuth()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{user?.phone ?? 'No phone number'}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Plan: <span className="font-medium capitalize">{user?.plan ?? 'free'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
