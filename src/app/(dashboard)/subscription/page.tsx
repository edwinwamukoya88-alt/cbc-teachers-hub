'use client'

import { useRequireAuth } from '@/modules/auth/hooks/useRequireAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function SubscriptionPage() {
  useRequireAuth()
  const router = useRouter()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Subscription</h1>
      <Card>
        <CardHeader>
          <CardTitle>Current Plan: Free</CardTitle>
          <CardDescription>Upgrade to Teacher Pro for unlimited access</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/pricing')}>View Plans</Button>
        </CardContent>
      </Card>
    </div>
  )
}
