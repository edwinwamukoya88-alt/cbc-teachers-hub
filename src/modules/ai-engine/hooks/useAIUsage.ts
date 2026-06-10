'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { getFirestoreInstance } from '@/lib/firebase/config'
import { useAuth } from '@/modules/auth/providers/AuthProvider'
import { AI_USAGE_LIMITS } from '@/lib/constants'
import type { AIUsageInfo } from '../types'

export function useAIUsage() {
  const { user } = useAuth()
  const [usage, setUsage] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  const plan = user?.plan ?? 'free'
  const limits = AI_USAGE_LIMITS[plan]

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchUsage = async () => {
      try {
        const db = getFirestoreInstance()
        const now = new Date()
        const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        const usageDoc = await getDocs(
          query(collection(db, 'ai_usage', user.uid, 'monthly'),
          where('__name__', '==', yearMonth))
        )
        if (!usageDoc.empty) {
          setUsage(usageDoc.docs[0].data() as Record<string, number>)
        }
      } catch {
        // Default to zeros
      } finally {
        setLoading(false)
      }
    }

    fetchUsage()
  }, [user])

  const getFeatureInfo = (feature: keyof typeof limits): AIUsageInfo => {
    const used = usage[feature] ?? 0
    const limit = limits[feature]
    return { feature, used, limit, remaining: Math.max(0, limit - used) }
  }

  const isAtLimit = (feature: string): boolean => {
    const info = getFeatureInfo(feature as keyof typeof limits)
    return info.used >= info.limit
  }

  return { usage, limits, loading, getFeatureInfo, isAtLimit }
}
