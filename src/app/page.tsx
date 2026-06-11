'use client'

import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { redirect } from 'next/navigation'
import DashboardContent from './(dashboard)/dashboard-content'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
      } else {
        redirect('/login')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div style={{ padding: 48 }}>Loading...</div>
  }

  if (!user) {
    return null
  }

  return <DashboardContent />
}
