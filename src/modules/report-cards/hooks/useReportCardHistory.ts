'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore'
import { getFirestoreInstance } from '@/lib/firebase/config'
import { useAuth } from '@/modules/auth/providers/AuthProvider'
import type { ReportCard } from '../types'

export function useReportCardHistory(studentName?: string) {
  const { user } = useAuth()
  const [reportCards, setReportCards] = useState<ReportCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetch = async () => {
      setLoading(true)
      try {
        const db = getFirestoreInstance()
        const q = query(
          collection(db, 'report_cards'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(50)
        )
        const snapshot = await getDocs(q)
        setReportCards(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as unknown as ReportCard[])
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [user, studentName])

  return { reportCards, loading }
}
