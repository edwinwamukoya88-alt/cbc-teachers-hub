import { FieldValue } from 'firebase-admin/firestore'
import { getAdminDb } from './firestore'
import { AI_USAGE_LIMITS } from '@/lib/constants'

export const UPGRADE_MESSAGE = 'Upgrade to Teacher Pro to continue'

interface UserPlan {
  plan: string
  isActive: boolean
}

async function getUserPlan(uid: string): Promise<UserPlan> {
  const db = getAdminDb()

  const subDoc = await db.collection('subscriptions').doc(uid).get()
  if (subDoc.exists) {
    const subData = subDoc.data()!
    if (subData.status === 'active' || subData.status === 'grace_period') {
      const userDoc = await db.collection('users').doc(uid).get()
      const userPlan = (userDoc.data()?.plan as string) ?? 'free'
      return { plan: userPlan, isActive: true }
    }
  }

  const doc = await db.collection('users').doc(uid).get()

  if (!doc.exists) {
    return { plan: 'free', isActive: false }
  }

  const data = doc.data()!
  return {
    plan: data.plan ?? 'free',
    isActive: data.isActive !== false,
  }
}

async function getCurrentUsage(uid: string, featureType: string): Promise<number> {
  const db = getAdminDb()
  const now = new Date()
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const ref = db.collection('ai_usage').doc(uid).collection('monthly').doc(yearMonth)
  const doc = await ref.get()

  if (!doc.exists) return 0

  const data = doc.data()!
  return (data[featureType] as number) ?? 0
}

export async function checkPlanLimits(
  uid: string,
  featureType: string,
): Promise<{ allowed: boolean; message?: string; remaining?: number }> {
  const userPlan = await getUserPlan(uid)

  if (!userPlan.isActive) {
    return { allowed: false, message: 'Account is inactive. Contact support.' }
  }

  const limits = AI_USAGE_LIMITS[userPlan.plan]
  if (!limits) {
    return { allowed: false, message: UPGRADE_MESSAGE }
  }

  const limit = limits[featureType]
  if (limit == null) {
    return { allowed: false, message: `Unknown feature: ${featureType}` }
  }

  if (limit <= 0) {
    return { allowed: false, message: UPGRADE_MESSAGE }
  }

  const usage = await getCurrentUsage(uid, featureType)
  const remaining = limit - usage

  if (remaining <= 0) {
    return { allowed: false, message: UPGRADE_MESSAGE, remaining: 0 }
  }

  return { allowed: true, remaining }
}

export async function incrementUsage(
  uid: string,
  featureType: string,
  tokensUsed: number,
): Promise<void> {
  const db = getAdminDb()
  const now = new Date()
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const ref = db.collection('ai_usage').doc(uid).collection('monthly').doc(yearMonth)

  await ref.set(
    {
      [featureType]: FieldValue.increment(1),
      totalTokensUsed: FieldValue.increment(tokensUsed),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
}
