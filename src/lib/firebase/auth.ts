import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth'
import { getAuthInstance } from './config'

const getAuth = () => {
  const instance = getAuthInstance()
  if (!instance) throw new Error('Auth not initialized')
  return instance
}

export const signIn = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(getAuth(), email, password)
  return result.user
}

export const signUp = async (email: string, password: string, displayName: string) => {
  const result = await createUserWithEmailAndPassword(getAuth(), email, password)
  await updateProfile(result.user, { displayName })
  return result.user
}

export const logOut = async () => {
  await signOut(getAuth())
}

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(getAuth(), email)
}

export const getCurrentUser = (): User | null => getAuth()?.currentUser ?? null

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(getAuth(), provider)
  return result.user
}
