'use client'

import { useAuth } from '@/modules/auth/providers/AuthProvider'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Home, FileText, BookOpen, User, GraduationCap } from 'lucide-react'
import { usePathname } from 'next/navigation'

const mobileNavItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/lesson-plans', label: 'Plans', icon: FileText },
  { href: '/resources', label: 'Resources', icon: BookOpen },
  { href: '/report-cards', label: 'Reports', icon: GraduationCap },
  { href: '/profile', label: 'Profile', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around h-14">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
