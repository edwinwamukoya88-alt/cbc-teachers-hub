'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../providers/AuthProvider'
import type { UserRole } from '@/types'

export function useRequireRole(allowedRoles: UserRole[]) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !allowedRoles.includes(user.role))) {
      router.push('/dashboard')
    }
  }, [user, loading, router, allowedRoles])

  return { user, loading, isAuthorized: user ? allowedRoles.includes(user.role) : false }
}
