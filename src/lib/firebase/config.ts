import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator, type Functions } from 'firebase/functions'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

/*
 * Firebase Authentication requires the Identity Toolkit API to be enabled in your Google Cloud project:
 *   https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com
 * If you see 403 PERMISSION_DENIED or auth/network-request-failed, the most likely causes are:
 *   1. Identity Toolkit API is not enabled for this project
 *   2. The Web API key has HTTP referrer restrictions that don't include your dev origin
 *   3. The API key is invalid or missing
 *
 * For localhost, add these to your API key's HTTP referrer allowlist in Google Cloud Console:
 *   http://localhost:3000/*
 *   http://localhost:3001/*
 */

const REQUIRED_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const

function validateEnvVars(): string | null {
  const missing: string[] = []
  const empty: string[] = []

  for (const key of REQUIRED_VARS) {
    const val = process.env[key]
    if (val === undefined) {
      missing.push(key)
    } else if (val.trim() === '') {
      empty.push(key)
    }
  }

  if (missing.length > 0) {
    return `Missing Firebase env vars: ${missing.join(', ')}`
  }
  if (empty.length > 0) {
    return `Empty Firebase env vars: ${empty.join(', ')}`
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!apiKey) {
    return 'Invalid Firebase API key or environment not configured'
  }
  if (!apiKey.startsWith('AIza')) {
    return (
      `Invalid Firebase API key or environment not configured. ` +
      `NEXT_PUBLIC_FIREBASE_API_KEY (${apiKey.substring(0, 8)}...) must start with "AIza".`
    )
  }

  return null
}

let appInstance: FirebaseApp | null = null
let authInstance: Auth | null = null
let dbInstance: Firestore | null = null
let storageInstance: FirebaseStorage | null = null
let functionsInstance: Functions | null = null
let initError: Error | null = null

function initFirebase() {
  if (appInstance) return

  if (typeof window === 'undefined') {
    initError = new Error('[Firebase] Cannot initialize on the server. Ensure this runs client-side only.')
    return
  }

  const validationError = validateEnvVars()
  if (validationError) {
    const msg = `[Firebase] ${validationError}`
    console.error(msg)
    initError = new Error(msg)
    return
  }

  /*
   * Dynamically resolve authDomain so localhost uses the current origin.
   * This avoids mismatches when the Firebase Auth SDK constructs redirect URLs
   * for OAuth flows (Google sign-in, email link, etc.) during local development.
   * On production the configured env var is used as-is.
   */
  const hostname = typeof location !== 'undefined' ? location.hostname : ''

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain:
      hostname === 'localhost' || hostname === '127.0.0.1'
        ? hostname
        : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  try {
    appInstance = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)
    authInstance = getAuth(appInstance)
    dbInstance = getFirestore(appInstance)
    storageInstance = getStorage(appInstance)
    functionsInstance = getFunctions(appInstance, 'us-central1')

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.info('[Firebase] Connecting to local emulators...')
      connectAuthEmulator(authInstance, 'http://127.0.0.1:9099', { disableWarnings: true })
      connectFirestoreEmulator(dbInstance, '127.0.0.1', 8080)
      connectFunctionsEmulator(functionsInstance, '127.0.0.1', 5001)
      console.info('[Firebase] Emulators connected')
    }

    console.info('[Firebase] Initialized successfully', firebaseConfig.projectId)
  } catch (err) {
    initError = err instanceof Error ? err : new Error('[Firebase] Unknown initialization error')
    console.error('[Firebase] Initialization failed:', initError.message, initError)
    appInstance = null
    authInstance = null
    dbInstance = null
    storageInstance = null
    functionsInstance = null
  }
}

initFirebase()

function throwIfMissing(name: string): never {
  const reason = initError ? ` Reason: ${initError.message}` : ''
  throw new Error(
    `Firebase ${name} is not initialized.${reason} Ensure NEXT_PUBLIC_FIREBASE_* env vars are set and this code runs client-side only.`
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
