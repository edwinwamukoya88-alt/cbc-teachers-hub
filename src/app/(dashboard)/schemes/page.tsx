'use client'

import { useRequireAuth } from '@/modules/auth/hooks/useRequireAuth'
import { CurriculumSelector } from '@/modules/curriculum/components/CurriculumSelector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SchemesPage() {
  useRequireAuth()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Generate Scheme of Work</h1>
      <Card>
        <CardHeader>
          <CardTitle>Scheme Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <CurriculumSelector />
          <div className="mt-6">
            <Button>Generate Scheme</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
