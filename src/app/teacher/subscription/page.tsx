'use client'

import { useState } from 'react'
import { useAuth } from '@/modules/auth/providers/AuthProvider'
import { useRequireAuth } from '@/modules/auth/hooks/useRequireAuth'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { Loader2, Check, CreditCard } from 'lucide-react'
import { getAuthInstance } from '@/lib/firebase/config'
import { useSubscription } from '@/modules/billing/hooks/useSubscription'

export default function TeacherSubscriptionPage() {
  useRequireAuth()
  const { user } = useAuth()
  const { subscription, loading: subLoading } = useSubscription()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpgrade = async () => {
    setLoading(true)
    setError('')

    try {
      const auth = getAuthInstance()
      const token = await auth.currentUser?.getIdToken()

      if (!token) {
        setError('You must be signed in')
        return
      }

      const res = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: 'teacher_pro' }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Failed to create checkout')
        return
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (subLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const isPro = subscription?.plan === 'teacher_pro' && subscription?.status === 'active'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Subscription</h1>

      {isPro ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle>Teacher Pro</CardTitle>
              <Badge className="bg-green-600">Active</Badge>
            </div>
            <CardDescription>You have unlimited access to all AI features.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              KSh 499/month &middot; Next billing:{' '}
              {subscription?.currentPeriodEnd
                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              Payment method: {subscription?.paymentMethod ?? 'M-Pesa'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Upgrade to Teacher Pro</CardTitle>
            <CardDescription>Unlock unlimited AI-powered teaching tools.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold">KSh 499</span>
              <span className="text-muted-foreground ml-1">/mo</span>
            </div>
            <ul className="space-y-2">
              {[
                'Unlimited Lesson Plans',
                'Unlimited Exams',
                'Unlimited Report Cards',
                'Unlimited Smart Search',
                'Unlimited Quality Checks',
                'PDF & Excel Export',
                'Premium Resources',
                'Priority Support',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button className="w-full" size="lg" onClick={handleUpgrade} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to Pesapal...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Upgrade Now
                </>
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
