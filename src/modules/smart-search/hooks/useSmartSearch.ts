'use client'

import { useState, useCallback } from 'react'
import { httpsCallable, getFunctions } from 'firebase/functions'
import { getApp } from '@/lib/firebase/config'
import type { SmartSearchQuery, SmartSearchResult } from '../types'

export function useSmartSearch() {
  const [results, setResults] = useState<SmartSearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: SmartSearchQuery) => {
    setLoading(true)
    setError(null)

    try {
      const functions = getFunctions(getApp())
      const callable = httpsCallable(functions, 'ai-smart-search')
      const response = await callable(query)
      setResults(response.data as SmartSearchResult)
      return response.data as SmartSearchResult
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Search failed'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { search, results, loading, error }
}
