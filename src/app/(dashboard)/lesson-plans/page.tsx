'use client'

import { useState } from 'react'
import { useRequireAuth } from '@/modules/auth/hooks/useRequireAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

const GRADES = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9',
]

export default function LessonPlansPage() {
  useRequireAuth()

  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('')
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState('')
  const [loading, setLoading] = useState(false)
  const [lessonPlan, setLessonPlan] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!subject.trim() || !grade || !topic.trim() || !duration.trim()) {
      toast.error('Please fill in all fields.')
      return
    }

    setLoading(true)
    setLessonPlan(null)
    setCopied(false)

    try {
      const res = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          grade,
          topic: topic.trim(),
          duration: duration.trim(),
        }),
      })

      const data = await res.json()

      if (!data.success) {
        toast.error("We couldn't generate the lesson plan. Please try again.")
        return
      }

      setLessonPlan(data.lessonPlan)
    } catch {
      toast.error("We couldn't generate the lesson plan. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!lessonPlan) return
    try {
      await navigator.clipboard.writeText(lessonPlan)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy to clipboard.')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Generate CBC Lesson Plan</h1>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
          <CardDescription>
            Fill in the details below to generate a CBC-aligned lesson plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g. Mathematics, English, Science"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select value={grade} onValueChange={(value) => setGrade(value ?? '')} disabled={loading}>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g. Addition of Numbers, Parts of Speech"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g. 40 minutes, 1 hour"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Generating...' : 'Generate Lesson Plan'}
          </Button>
        </CardContent>
      </Card>

      {lessonPlan && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">Generated Lesson Plan</CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{lessonPlan}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
