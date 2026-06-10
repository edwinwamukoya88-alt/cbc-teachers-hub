'use client'

import { useState, useEffect } from 'react'
import { fetchResources } from '../utils'
import type { Resource } from '@/types'

export function useResources(filters?: { grade?: string; learningArea?: string; type?: string; status?: string }) {
  const [resources, setResources] = useState<(Resource & { id: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchResources(filters)
        setResources(data)
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [filters?.grade, filters?.learningArea, filters?.type, filters?.status])

  return { resources, loading }
}
