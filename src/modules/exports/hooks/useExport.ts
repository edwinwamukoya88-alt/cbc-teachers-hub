'use client'

import { useState } from 'react'
import { httpsCallable, getFunctions } from 'firebase/functions'
import { getApp } from '@/lib/firebase/config'

export function useExport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportPdf = async (contentId: string, type: string) => {
    setLoading(true)
    setError(null)

    try {
      const functions = getFunctions(getApp())
      const callable = httpsCallable(functions, 'export-pdf')
      const response = await callable({ contentId, type })
      return (response.data as { url: string }).url
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Export failed'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const exportExcel = async (contentId: string, type: string) => {
    setLoading(true)
    setError(null)

    try {
      const functions = getFunctions(getApp())
      const callable = httpsCallable(functions, 'export-excel')
      const response = await callable({ contentId, type })
      return (response.data as { url: string }).url
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Export failed'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { exportPdf, exportExcel, loading, error }
}
