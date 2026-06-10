'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { getAuthInstance, getFirestoreInstance } from '@/lib/firebase/config'
import { signIn, signUp, logOut, resetPassword } from '@/lib/firebase/auth'
import type { User, Plan, UserRole } from '@/types'

interface AuthContextValue {
  user: User | null
  firebaseUser: FirebaseUser | null
  role: UserRole | null
  plan: Plan | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<FirebaseUser>
  signUp: (email: string, password: string, displayName: string) => Promise<FirebaseUser>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
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
            setUser({ uid: fbUser.uid, ...userDoc.data() } as User)
          } else {
            setUser(null)
          }
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextValue = {
    user,
    firebaseUser,
    role: user?.role ?? null,
    plan: user?.plan ?? null,
    loading,
    signIn,
    signUp,
    signOut: logOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
