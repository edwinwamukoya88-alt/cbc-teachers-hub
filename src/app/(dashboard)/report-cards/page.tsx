'use client'

import { useRequireAuth } from '@/modules/auth/hooks/useRequireAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Plus, FileText } from 'lucide-react'

export default function ReportCardsPage() {
  useRequireAuth()
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Report Cards</h1>
          <p className="text-muted-foreground">Generate and manage CBC report cards</p>
        </div>
        <Button onClick={() => router.push('/report-cards/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Report Card
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generated Report Cards
          </CardTitle>
          <CardDescription>Your generated report cards will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No report cards generated yet. Create your first one to get started.</p>
        </CardContent>
      </Card>
    </div>
  )
}
