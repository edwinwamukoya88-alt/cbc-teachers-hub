'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  FileText,
  CalendarRange,
  ClipboardCheck,
  CheckSquare,
  FileSpreadsheet,
  BookOpen,
  CreditCard,
  User,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'

const teacherNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/lesson-plans', label: 'Lesson Plans', icon: FileText },
  { href: '/schemes', label: 'Schemes of Work', icon: CalendarRange },
  { href: '/exams', label: 'Exams', icon: ClipboardCheck },
  { href: '/rubrics', label: 'Rubrics', icon: CheckSquare },
  { href: '/report-cards', label: 'Report Cards', icon: GraduationCap },
  { href: '/report-comments', label: 'Comments', icon: FileSpreadsheet },
  { href: '/resources', label: 'Resources', icon: BookOpen },
  { href: '/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/profile', label: 'Profile', icon: User },
]

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: User },
  { href: '/admin/schools', label: 'Schools', icon: GraduationCap },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/admin/resources', label: 'Resources', icon: BookOpen },
  { href: '/admin/quality-reviews', label: 'Quality Reviews', icon: ShieldCheck },
  { href: '/admin/ai-usage', label: 'AI Usage', icon: Search },
]

const BASE_PREFIX = ''

function getNavContext(pathname: string) {
  if (pathname.startsWith('/admin')) return { prefix: '/admin', items: adminNavItems }
  if (pathname.startsWith('/teacher')) return { prefix: '/teacher', items: teacherNavItems }
  return { prefix: '', items: teacherNavItems }
}

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { prefix, items } = getNavContext(pathname)
  const dashboardHref = prefix ? `${prefix}/dashboard` : '/dashboard'

  return (
    <aside
      className={cn(
        'border-r bg-sidebar flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href={dashboardHref} className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span>CBC Hub</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {items.map((item) => {
            const Icon = item.icon
            const href = `${prefix}${item.href}`
            const isActive = pathname === href
            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </aside>
  )
}
