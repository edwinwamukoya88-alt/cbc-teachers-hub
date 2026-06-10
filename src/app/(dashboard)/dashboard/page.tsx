'use client'

import { useRequireAuth } from '@/modules/auth/hooks/useRequireAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CalendarRange, ClipboardCheck, GraduationCap, BookOpen } from 'lucide-react'

const stats = [
  { label: 'Lesson Plans', icon: FileText, value: '0', href: '/lesson-plans' },
  { label: 'Schemes of Work', icon: CalendarRange, value: '0', href: '/schemes' },
  { label: 'Exams', icon: ClipboardCheck, value: '0', href: '/exams' },
  { label: 'Report Cards', icon: GraduationCap, value: '0', href: '/report-cards' },
]

export default function DashboardPage() {
  const { user } = useRequireAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.displayName ?? 'Teacher'}</h1>
        <p className="text-muted-foreground">Your CBC teaching dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <p className="text-sm text-muted-foreground">Create a lesson plan, generate an exam, or view resources to get started.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Your AI generation usage for this month will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
