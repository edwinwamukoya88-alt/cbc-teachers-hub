import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

function getAdminAuth() {
  const apps = getApps()
  if (apps.length > 0) return getAuth(apps[0])

  const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
  if (!serviceAccount) {
    throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT environment variable is not set')
  }

  const app = initializeApp({
    credential: cert(JSON.parse(serviceAccount)),
  })

  return getAuth(app)
}

export async function verifyAuthToken(authHeader: string | null): Promise<{ uid: string }> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header')
  }

  const token = authHeader.split('Bearer ')[1]
  const adminAuth = getAdminAuth()
  const decoded = await adminAuth.verifyIdToken(token)

  return { uid: decoded.uid }
}
