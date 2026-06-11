import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator, type Functions } from 'firebase/functions'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let appInstance: FirebaseApp | null = null
let authInstance: Auth | null = null
let dbInstance: Firestore | null = null
let storageInstance: FirebaseStorage | null = null
let functionsInstance: Functions | null = null

try {
  if (typeof window !== 'undefined') {
    appInstance = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    authInstance = getAuth(appInstance)
    dbInstance = getFirestore(appInstance)
    storageInstance = getStorage(appInstance)
    functionsInstance = getFunctions(appInstance, 'us-central1')

    if (
      typeof location !== 'undefined' &&
      (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ) {
      connectAuthEmulator(authInstance, 'http://127.0.0.1:9099')
      connectFirestoreEmulator(dbInstance, '127.0.0.1', 8080)
      connectFunctionsEmulator(functionsInstance, '127.0.0.1', 5001)
    }
  }
} catch {
  // Firebase not available during SSR — getter functions will throw with a clear message
}

function throwIfMissing(name: string): never {
  throw new Error(
    `Firebase ${name} is not initialized. Ensure NEXT_PUBLIC_FIREBASE_* env vars are set and this code runs client-side only.`
  )
}

export function getApp(): FirebaseApp {
  if (!appInstance) throwIfMissing('app')
  return appInstance
}

export function getAuthInstance(): Auth {
  if (!authInstance) throwIfMissing('auth')
  return authInstance
}

export function getFirestoreInstance(): Firestore {
  if (!dbInstance) throwIfMissing('firestore')
  return dbInstance
}

export function getStorageInstance(): FirebaseStorage {
  if (!storageInstance) throwIfMissing('storage')
  return storageInstance
}

export function getFunctionsInstance(): Functions {
  if (!functionsInstance) throwIfMissing('functions')
  return functionsInstance
}
