'use client'

import { useAuth } from '@/modules/auth/providers/AuthProvider'
import { usePlanLimits } from '@/modules/billing/hooks/usePlanLimits'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, LogOut, Moon, Sun, User, Sparkles } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

const planMeta: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' }> = {
  free: { label: 'Free', variant: 'outline' },
  teacher_pro: { label: 'Pro', variant: 'default' },
  school: { label: 'School', variant: 'secondary' },
}

export function Header() {
  const { user, signOut, firebaseUser } = useAuth()
  const { plan } = usePlanLimits()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const meta = planMeta[plan] ?? planMeta.free

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="flex-1" />
      <Badge variant={meta.variant} className="hidden sm:inline-flex gap-1 items-center">
        <Sparkles className="h-3 w-3" />
        {meta.label}
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="h-8 w-8"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 relative">
        <Bell className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {firebaseUser?.displayName?.charAt(0)?.toUpperCase() ?? 'T'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{user?.displayName ?? 'Teacher'}</span>
              <span className="text-xs text-muted-foreground capitalize">{plan} plan</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            <User className="mr-2 h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
