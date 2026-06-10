'use client'

import { useAuth } from '@/modules/auth/providers/AuthProvider'
import { AI_USAGE_LIMITS } from '@/lib/constants'

export function usePlanLimits() {
  const { user } = useAuth()
  const plan = user?.plan ?? 'free'

  return {
    plan,
    limits: AI_USAGE_LIMITS[plan],
    isFree: plan === 'free',
    isPro: plan === 'teacher_pro',
    isSchool: plan === 'school',
  }
}
