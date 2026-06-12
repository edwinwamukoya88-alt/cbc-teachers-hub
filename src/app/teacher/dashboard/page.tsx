'use client'

import { useRequireAuth } from '@/modules/auth/hooks/useRequireAuth'
import { useAIUsage } from '@/modules/ai-engine/hooks/useAIUsage'
import { useSubscription } from '@/modules/billing/hooks/useSubscription'
import { usePlanLimits } from '@/modules/billing/hooks/usePlanLimits'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  FileText,
  ClipboardCheck,
  CalendarRange,
  Sparkles,
  GraduationCap,
  Zap,
  ChevronRight,
  CreditCard,
  BookOpen,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const quickActions = [
  {
    label: 'Generate Lesson Plan',
    description: 'Create a detailed CBC-aligned lesson plan',
    icon: FileText,
    href: '/lesson-plans',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950',
  },
  {
    label: 'Generate Exam',
    description: 'Create CATs, mid-term, or end-term exams',
    icon: ClipboardCheck,
    href: '/exams',
    color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950',
  },
  {
    label: 'Generate Scheme of Work',
    description: 'Plan your term with structured schemes',
    icon: CalendarRange,
    href: '/schemes',
    color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-950',
  },
]

const usageFeatures = [
  { key: 'lessonPlans', label: 'Lesson Plans', icon: FileText },
  { key: 'exams', label: 'Exams', icon: ClipboardCheck },
  { key: 'schemesOfWork', label: 'Schemes of Work', icon: CalendarRange },
  { key: 'rubrics', label: 'Rubrics', icon: BookOpen },
]

function UsageBar({ used, limit, label, icon: Icon }: { used: number; limit: number; label: string; icon: React.ElementType }) {
  const pct = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="font-medium tabular-nums">{used} / {limit}</span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  )
}

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    free: 'bg-muted text-muted-foreground',
    teacher_pro: 'bg-primary/10 text-primary border-primary/20',
    school: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800',
  }
  return (
    <Badge variant="outline" className={styles[plan] ?? styles.free}>
      {plan === 'teacher_pro' ? 'Teacher Pro' : plan === 'school' ? 'School' : 'Free'}
    </Badge>
  )
}

export default function TeacherDashboardPage() {
  useRequireAuth()
  const router = useRouter()
  const { user } = useRequireAuth()
  const { usage, limits, loading: usageLoading } = useAIUsage()
  const { subscription, loading: subLoading } = useSubscription()
  const { plan, isFree } = usePlanLimits()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.displayName?.split(' ')[0] ?? 'Teacher'}</h1>
          <p className="text-muted-foreground">Here&apos;s an overview of your teaching toolkit</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">
            {isFree ? 'Free plan' : `${plan === 'teacher_pro' ? 'Teacher Pro' : 'School'} plan`}
          </span>
          <PlanBadge plan={plan} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Usage */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                AI Usage This Month
              </CardTitle>
              <CardDescription>Your monthly AI generation quota</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {usageLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              usageFeatures.map((f) => {
                const used = usage[f.key] ?? 0
                const limit = limits[f.key] ?? 0
                return (
                  <UsageBar
                    key={f.key}
                    label={f.label}
                    icon={f.icon}
                    used={used}
                    limit={limit}
                  />
                )
              })
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <a
              href="/subscription"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View plan details
              <ChevronRight className="h-3 w-3" />
            </a>
          </CardFooter>
        </Card>

        {/* Subscription Status */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Subscription
              </CardTitle>
              <PlanBadge plan={plan} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {subLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <p className="text-xl font-bold capitalize">
                    {plan === 'teacher_pro' ? 'Teacher Pro' : plan === 'school' ? 'School' : 'Free'}
                  </p>
                </div>
                {subscription?.status && subscription.status !== 'active' && (
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={subscription.status === 'grace_period' ? 'warning' as any : 'destructive' as any}>
                      {subscription.status.replace('_', ' ')}
                    </Badge>
                  </div>
                )}
                {subscription?.currentPeriodEnd && (
                  <div>
                    <p className="text-sm text-muted-foreground">Renewal Date</p>
                    <p className="text-sm font-medium">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-KE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {isFree && (
                  <div className="rounded-lg bg-muted p-3 text-sm space-y-2">
                    <div className="flex items-center gap-2 font-medium">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      Unlock more with Teacher Pro
                    </div>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-1.5 before:content-['•'] before:text-primary">500 AI generations/month</li>
                      <li className="flex items-center gap-1.5 before:content-['•'] before:text-primary">All resource types</li>
                      <li className="flex items-center gap-1.5 before:content-['•'] before:text-primary">Priority support</li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            {isFree ? (
              <Button className="w-full gap-1" onClick={() => router.push('/subscription')}>
                Upgrade to Pro
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="outline" className="w-full gap-1" onClick={() => router.push('/subscription')}>
                Manage Plan
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Card
                key={action.label}
                className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                onClick={() => router.push(action.href)}
              >
                <CardContent className="flex items-start gap-4 p-5">
                  <div className={`rounded-lg p-2.5 shrink-0 ${action.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm">{action.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
