'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { signInWithGoogle } from '@/lib/firebase/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await signInWithEmailAndPassword(getAuth(), email, password)
      window.location.href = '/'
    } catch (err: any) {
      setError(err?.message ?? 'Sign in failed')
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')

    try {
      const user = await signInWithGoogle()
      if (user) {
        window.location.href = '/'
      }
    } catch (err: any) {
      setError(err?.message ?? 'Google sign in failed')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>CBC Teachers Hub</h1>

      <form onSubmit={handleEmailSignIn}>
        <div style={{ marginBottom: 16 }}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" style={{ width: '100%', padding: 10, marginBottom: 12 }}>
          Sign In
        </button>
      </form>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        style={{ width: '100%', padding: 10 }}
      >
        Sign in with Google
      </button>
    </div>
  )
}
