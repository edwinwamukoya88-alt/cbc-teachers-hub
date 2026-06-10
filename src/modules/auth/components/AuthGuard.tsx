'use client'

import { ReactNode } from 'react'
import { useAuth } from '../providers/AuthProvider'
import type { UserRole } from '@/types'

interface AuthGuardProps {
  children: ReactNode
  allowedRoles?: UserRole[]
  fallback?: ReactNode
}

export function AuthGuard({ children, allowedRoles, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return fallback ?? null
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return fallback ?? null
  }

  return <>{children}</>
}
