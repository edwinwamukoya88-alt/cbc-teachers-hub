'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged, updateProfile, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { getAuthInstance, getFirestoreInstance } from '@/lib/firebase/config'
import { signIn, signUp as fbSignUp, logOut, resetPassword } from '@/lib/firebase/auth'
import type { User, Plan, UserRole, AccountType } from '@/types'

function setSessionCookie(uid: string, role: string) {
  const payload = btoa(JSON.stringify({ uid, role }))
  document.cookie = `session=${payload};path=/;max-age=${60 * 60 * 24 * 14};SameSite=Lax`
}

function clearSessionCookie() {
  document.cookie = 'session=;path=/;max-age=0;SameSite=Lax'
}

export function getDashboardRoute(accountType: AccountType | null): string {
  switch (accountType) {
    case 'independent_teacher':
      return '/teacher/dashboard'
    case 'school_admin':
      return '/school/dashboard'
    case 'parent':
      return '/parent/dashboard'
    default:
      return '/dashboard'
  }
}

interface AuthContextValue {
  user: User | null
  firebaseUser: FirebaseUser | null
  role: UserRole | null
  accountType: AccountType | null
  plan: Plan | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<FirebaseUser>
  signUp: (email: string, password: string, displayName: string, accountType: AccountType) => Promise<FirebaseUser>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  getDashboardRoute: () => string
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuthInstance()
    const db = getFirestoreInstance()

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)

      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid))
          if (userDoc.exists()) {
            const userData = { uid: fbUser.uid, ...userDoc.data() } as User
            setUser(userData)
            setSessionCookie(fbUser.uid, userData.role)
          } else {
            console.warn(`[Firebase Auth] No Firestore doc found for user ${fbUser.uid}`)
            setUser(null)
            clearSessionCookie()
          }
        } catch (err) {
          console.error(`[Firebase Auth] Failed to fetch user doc for ${fbUser.uid}:`, err)
          setUser(null)
          clearSessionCookie()
        }
      } else {
        setUser(null)
        clearSessionCookie()
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const handleSignUp = async (
    email: string,
    password: string,
    displayName: string,
    accountType: AccountType,
  ): Promise<FirebaseUser> => {
    const auth = getAuthInstance()
    const db = getFirestoreInstance()
    const fbUser = await fbSignUp(email, password)
    await updateProfile(fbUser, { displayName })

    const role = accountType === 'school_admin' ? 'school_admin' : 'teacher'

    await setDoc(doc(db, 'users', fbUser.uid), {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName,
      role,
      accountType,
      plan: 'free' as Plan,
      isActive: true,
      preferences: {
        language: 'en',
        biblicalIntegration: false,
        darkMode: false,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    setSessionCookie(fbUser.uid, role)

    return fbUser
  }

  const handleSignIn = async (email: string, password: string) => {
    const fbUser = await signIn(email, password)
    const db = getFirestoreInstance()
    const userDoc = await getDoc(doc(db, 'users', fbUser.uid))
    if (userDoc.exists()) {
      const data = userDoc.data() as User
      setSessionCookie(fbUser.uid, data.role)
    }
    return fbUser
  }

  const handleSignOut = async () => {
    await logOut()
    clearSessionCookie()
  }

  const value: AuthContextValue = {
    user,
    firebaseUser,
    role: user?.role ?? null,
    accountType: user?.accountType ?? null,
    plan: user?.plan ?? null,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword,
    getDashboardRoute: () => getDashboardRoute(user?.accountType ?? null),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
