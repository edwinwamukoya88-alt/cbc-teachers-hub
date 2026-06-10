'use client'

import { useRequireAuth } from '@/modules/auth/hooks/useRequireAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export default function ResourcesPage() {
  useRequireAuth()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Resource Centre</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Browse Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Search and browse CBC-aligned teaching resources.</p>
        </CardContent>
      </Card>
    </div>
  )
}
