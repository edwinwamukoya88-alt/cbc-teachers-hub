'use client'

import { useState } from 'react'
import { httpsCallable, getFunctions } from 'firebase/functions'
import { getApp } from '@/lib/firebase/config'
import type { ReportCardInput, ReportCard } from '../types'

export function useReportCard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async (input: ReportCardInput): Promise<ReportCard> => {
    setLoading(true)
    setError(null)

    try {
      const functions = getFunctions(getApp())
      const callable = httpsCallable(functions, 'ai-report-card')
      const response = await callable(input)
      return response.data as ReportCard
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Report card generation failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { generate, loading, error }
}
