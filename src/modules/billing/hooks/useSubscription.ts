'use client'

import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { getFirestoreInstance } from '@/lib/firebase/config'
import { useAuth } from '@/modules/auth/providers/AuthProvider'
import type { SubscriptionInfo } from '../types'

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetch = async () => {
      try {
        const db = getFirestoreInstance()
        const q = await getDoc(doc(db, 'subscriptions', user.uid))
        if (q.exists()) {
          const data = q.data()
          setSubscription({
            plan: data.plan,
            status: data.status,
            currentPeriodEnd: data.currentPeriodEnd?.toDate?.()?.toISOString(),
            paymentMethod: data.paymentMethod,
          })
        } else {
          setSubscription({ plan: 'free', status: 'active' })
        }
      } catch {
        setSubscription({ plan: 'free', status: 'active' })
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [user])

  return { subscription, loading }
}
