import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, sendPasswordResetEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { getAuthInstance } from '@/lib/firebase/config'

function logAuthError(context: string, error: unknown) {
  if (error instanceof Error) {
    const fbErr = error as any
    const code: string = fbErr.code ?? ''
    const status: number | undefined = fbErr.customData?.status

    console.error(
      `[Firebase Auth] ${context} failed`,
      `\n  Code: ${code || 'N/A'}`,
      `\n  Message: ${fbErr.message ?? error.message}`,
      `\n  Status: ${status ?? 'N/A'}`,
      `\n  Full error:`,
      error,
    )

    if (code === 'auth/network-request-failed' || status === 403) {
      console.warn(
        '[Firebase Auth] Firebase API key restricted or Identity Toolkit API blocked. ' +
        'Go to Google Cloud Console → APIs & Services → Credentials → API Keys → ' +
        'edit your Web key. Ensure "Identity Toolkit API" is enabled (APIs & Services → Library) ' +
        'and add your production domain (e.g. https://your-app.vercel.app/*) ' +
        'and http://localhost:3000/* for local dev to the HTTP referrer allowlist.'
      )
    }
  } else {
    console.error(`[Firebase Auth] ${context} failed with non-Error:`, error)
  }
}

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const auth = getAuthInstance()

  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error: any) {
    if (error?.code === 'auth/cancelled-popup-request' || error?.code === 'auth/popup-blocked' || error?.code === 'auth/popup-closed-by-user') {
      logAuthError('Google sign-in popup', error)
      await signInWithRedirect(auth, provider)
      return null
    }
    logAuthError('Google sign-in', error)
    throw error
  }
}

export const logOut = async () => {
  try {
    await signOut(getAuthInstance())
  } catch (error) {
    logAuthError('sign-out', error)
    throw error
  }
}

export const resetPassword = async (email: string) => {
  const auth = getAuthInstance()
  try {
    return await sendPasswordResetEmail(auth, email)
  } catch (error) {
    logAuthError('password reset', error)
    throw error
  }
}

export const signIn = async (email: string, password: string) => {
  const auth = getAuthInstance()
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    logAuthError('email/password sign-in', error)
    throw error
  }
}

export const signUp = async (email: string, password: string) => {
  const auth = getAuthInstance()
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    logAuthError('email/password sign-up', error)
    throw error
  }
}
