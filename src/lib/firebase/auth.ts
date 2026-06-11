import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, sendPasswordResetEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { getAuthInstance } from '@/lib/firebase/config'

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const auth = getAuthInstance()

  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error: any) {
    if (error?.code === 'auth/cancelled-popup-request' || error?.code === 'auth/popup-blocked' || error?.code === 'auth/popup-closed-by-user') {
      await signInWithRedirect(auth, provider)
      return null
    }
    throw error
  }
}

export const logOut = async () => {
  await signOut(getAuthInstance())
}

export const resetPassword = async (email: string) => {
  const auth = getAuthInstance()
  return await sendPasswordResetEmail(auth, email)
}

export const signIn = async (email: string, password: string) => {
  const auth = getAuthInstance()
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export const signUp = async (email: string, password: string) => {
  const auth = getAuthInstance()
  const result = await createUserWithEmailAndPassword(auth, email, password)
  return result.user
}
