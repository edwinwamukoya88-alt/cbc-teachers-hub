'use client'

import { useState } from 'react'
import { httpsCallable, getFunctions } from 'firebase/functions'
import { getApp } from '@/lib/firebase/config'
import type { AIGenerateOptions, AIGenerateResult } from '../types'

export function useAIGenerate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AIGenerateResult | null>(null)

  const generate = async (options: AIGenerateOptions) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const functions = getFunctions(getApp())
      const callable = httpsCallable(functions, `ai-${options.type}`)
      const response = await callable(options)
      setResult(response.data as AIGenerateResult)
      return response.data as AIGenerateResult
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { generate, loading, error, result }
}
