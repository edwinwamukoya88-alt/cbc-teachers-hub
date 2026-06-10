import { initializeApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: ReturnType<typeof initializeApp> | null = null
let auth: ReturnType<typeof getAuth> | null = null
let db: ReturnType<typeof getFirestore> | null = null
let storage: ReturnType<typeof getStorage> | null = null

try {
  if (typeof window !== 'undefined') {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)

    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099')
    }
  }
} catch {
  // Firebase not available during SSR
}

const throwIfMissing = (name: string) => {
  throw new Error(
    `Firebase ${name} is not initialized. Ensure NEXT_PUBLIC_FIREBASE_* env vars are set and this code runs client-side only.`
  )
}

export function getApp(): ReturnType<typeof initializeApp> {
  if (!app) throwIfMissing('app')
  return app!
}

export function getAuthInstance(): ReturnType<typeof getAuth> {
  if (!auth) throwIfMissing('auth')
  return auth!
}

export function getFirestoreInstance(): ReturnType<typeof getFirestore> {
  if (!db) throwIfMissing('firestore')
  return db!
}

export function getStorageInstance(): ReturnType<typeof getStorage> {
  if (!storage) throwIfMissing('storage')
  return storage!
}

export { app, auth, db, storage }
