import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

export function getAdminDb() {
  const apps = getApps()
  if (apps.length > 0) return getFirestore(apps[0])

  const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
  if (!serviceAccount) {
    throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT environment variable is not set')
  }

  const app = initializeApp({
    credential: cert(JSON.parse(serviceAccount)),
  })

  return getFirestore(app)
}

export async function logAIUsage(
  uid: string,
  feature: string,
  tokensUsed: number,
): Promise<void> {
  const db = getAdminDb()
  const now = new Date()
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const ref = db.collection('ai_usage').doc(uid).collection('monthly').doc(yearMonth)

  await ref.set(
    {
      [feature]: FieldValue.increment(1),
      totalTokensUsed: FieldValue.increment(tokensUsed),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
}

export async function saveGeneratedContent(
  uid: string,
  type: string,
  inputs: Record<string, unknown>,
  output: string,
  model: string,
  tokensUsed: number,
): Promise<string> {
  const db = getAdminDb()
  const ref = await db.collection('generated_content').add({
    userId: uid,
    type,
    inputs,
    output,
    outputFormat: 'markdown',
    model,
    tokensUsed,
    isSavedToLibrary: false,
    isSharedToResourceCentre: false,
    language: 'en',
    createdAt: FieldValue.serverTimestamp(),
  })

  return ref.id
}
