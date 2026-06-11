import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

function getAdminApp() {
  const apps = getApps()
  if (apps.length > 0) return apps[0]

  const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT

  if (!serviceAccount) {
    throw new Error(
      'FIREBASE_ADMIN_SERVICE_ACCOUNT environment variable is not set. ' +
      'Provide the full service account JSON string for server-side Firebase access.'
    )
  }

  return initializeApp({
    credential: cert(JSON.parse(serviceAccount)),
  })
}

export const adminAuth = getAuth(getAdminApp())
export const adminDb = getFirestore(getAdminApp())
export const adminStorage = getStorage(getAdminApp())
