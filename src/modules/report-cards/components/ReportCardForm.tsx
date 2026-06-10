'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { useReportCard } from '../hooks/useReportCard'
import type { ReportCardInput, ReportCard } from '../types'

interface SubjectInput {
  learningArea: string
  catScore: string
  midTermScore: string
  endTermScore: string
}

export function ReportCardForm() {
  const [studentName, setStudentName] = useState('')
  const [grade, setGrade] = useState('')
  const [term, setTerm] = useState('1')
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [subjects, setSubjects] = useState<SubjectInput[]>([])
  const [result, setResult] = useState<ReportCard | null>(null)
  const { generate, loading, error } = useReportCard()

  const addSubject = () => {
    setSubjects([...subjects, { learningArea: '', catScore: '', midTermScore: '', endTermScore: '' }])
  }

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index))
  }

  const updateSubject = (index: number, field: keyof SubjectInput, value: string) => {
    const updated = [...subjects]
    updated[index] = { ...updated[index], [field]: value }
    setSubjects(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const input: ReportCardInput = {
      studentName,
      grade,
      term: parseInt(term),
      year: parseInt(year),
      subjects: subjects.map((s) => ({
        learningArea: s.learningArea,
        catScore: s.catScore ? parseInt(s.catScore) : undefined,
        midTermScore: s.midTermScore ? parseInt(s.midTermScore) : undefined,
        endTermScore: s.endTermScore ? parseInt(s.endTermScore) : undefined,
      })),
      language: 'en',
    }

    try {
      const report = await generate(input)
      setResult(report)
    } catch {
      // error handled by hook
    }
  }

  if (result) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{result.studentName} - Report Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium capitalize">Overall: {result.overallPerformanceRating}</p>
            <p className="text-sm text-muted-foreground mt-2">{result.strengthsAnalysis}</p>
          </CardContent>
        </Card>
        <Button variant="outline" onClick={() => setResult(null)}>
          Generate Another
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Student Name</Label>
            <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Grade</Label>
            <Input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="e.g., Grade 4" required />
          </div>
          <div className="space-y-2">
            <Label>Term</Label>
            <Select value={term || null} onValueChange={(v) => setTerm(v ?? '1')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Term 1</SelectItem>
                <SelectItem value="2">Term 2</SelectItem>
                <SelectItem value="3">Term 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subjects</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addSubject}>
            <Plus className="mr-2 h-4 w-4" /> Add Subject
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjects.length === 0 && (
            <p className="text-sm text-muted-foreground">Add at least one subject to generate a report card.</p>
          )}
          {subjects.map((subject, index) => (
            <div key={index} className="flex items-end gap-2 p-3 border rounded-lg">
              <div className="flex-1 space-y-2">
                <Label>Learning Area</Label>
                <Input
                  value={subject.learningArea}
                  onChange={(e) => updateSubject(index, 'learningArea', e.target.value)}
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>
              <div className="w-20 space-y-2">
                <Label>CAT</Label>
                <Input
                  type="number"
                  value={subject.catScore}
                  onChange={(e) => updateSubject(index, 'catScore', e.target.value)}
                  min={0}
                  max={100}
                />
              </div>
              <div className="w-20 space-y-2">
                <Label>Mid-Term</Label>
                <Input
                  type="number"
                  value={subject.midTermScore}
                  onChange={(e) => updateSubject(index, 'midTermScore', e.target.value)}
                  min={0}
                  max={100}
                />
              </div>
              <div className="w-20 space-y-2">
                <Label>End-Term</Label>
                <Input
                  type="number"
                  value={subject.endTermScore}
                  onChange={(e) => updateSubject(index, 'endTermScore', e.target.value)}
                  min={0}
                  max={100}
                />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeSubject(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading || subjects.length === 0}>
        {loading ? 'Generating...' : 'Generate Report Card'}
      </Button>
    </form>
  )
}
