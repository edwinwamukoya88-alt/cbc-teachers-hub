'use client'

import { useState } from 'react'
import { logOut } from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'
import AiLessonAssistant from './ai-lesson-assistant'

const sidebarNav = [
  { label: 'Dashboard', icon: '📊' },
  { label: 'Lesson Plans', icon: '📝' },
  { label: 'AI Assistant', icon: '🤖' },
  { label: 'Gradebook', icon: '📈' },
  { label: 'Students', icon: '👥' },
  { label: 'Settings', icon: '⚙️' },
]

export default function DashboardContent() {
  const router = useRouter()
  const [active, setActive] = useState('Dashboard')

  const handleLogout = async () => {
    await logOut()
    window.location.href = '/login'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: 240,
          background: '#1e293b',
          color: '#fff',
          padding: '24px 0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2 style={{ padding: '0 20px', marginBottom: 32, fontSize: 18 }}>
          CBC Teachers Hub
        </h2>
        <nav style={{ flex: 1 }}>
          {sidebarNav.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActive(item.label)}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 20px',
                border: 'none',
                background: active === item.label ? '#334155' : 'transparent',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 15,
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'transparent',
            color: '#f87171',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: 15,
          }}
        >
          🚪 Sign Out
        </button>
      </aside>

      <main style={{ flex: 1, padding: 32, background: '#f8fafc' }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, margin: 0 }}>{active}</h1>
        </header>

        {active === 'AI Assistant' ? (
          <AiLessonAssistant />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3>AI Lesson Assistant</h3>
              <p style={{ color: '#64748b' }}>Generate lesson plans and activities with AI.</p>
            </div>
            <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3>Recent Activity</h3>
              <p style={{ color: '#64748b' }}>No recent activity to display.</p>
            </div>
            <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3>Quick Actions</h3>
              <p style={{ color: '#64748b' }}>Create a new lesson or view your schedule.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
