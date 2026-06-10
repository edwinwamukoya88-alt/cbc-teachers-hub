'use client'

import { useRequireAuth } from '@/modules/auth/hooks/useRequireAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ReportCommentsPage() {
  useRequireAuth()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Generate Report Comments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Student Name</Label>
            <Input placeholder="Enter student name" />
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Select onValueChange={() => {}}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="science">Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>Generate Comments</Button>
        </CardContent>
      </Card>
    </div>
  )
}
