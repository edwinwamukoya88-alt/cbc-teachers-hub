'use client'

import { useState } from 'react'
import { httpsCallable, getFunctions } from 'firebase/functions'
import { getApp } from '@/lib/firebase/config'
import type { QualityReviewResult } from '../types'

export function useQualityReview() {
  const [result, setResult] = useState<QualityReviewResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const check = async (resourceId: string) => {
    setLoading(true)
    setError(null)

    try {
      const functions = getFunctions(getApp())
      const callable = httpsCallable(functions, 'ai-quality-check')
      const response = await callable({ resourceId })
      setResult(response.data as QualityReviewResult)
      return response.data as QualityReviewResult
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Quality check failed'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { check, result, loading, error }
}
