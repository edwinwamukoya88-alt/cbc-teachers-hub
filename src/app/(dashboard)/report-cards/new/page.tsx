'use client'

import { useRequireAuth } from '@/modules/auth/hooks/useRequireAuth'
import { ReportCardForm } from '@/modules/report-cards/components/ReportCardForm'

export default function NewReportCardPage() {
  useRequireAuth()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Report Card</h1>
      <ReportCardForm />
    </div>
  )
}
