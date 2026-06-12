'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/modules/auth/providers/AuthProvider'
import { useRequireAuth } from '@/modules/auth/hooks/useRequireAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getAuthInstance } from '@/lib/firebase/config'
import {
  BookOpen,
  Plus,
  Search,
  Loader2,
  FileText,
  CalendarRange,
  ClipboardCheck,
  CheckSquare,
  FileSpreadsheet,
  GraduationCap,
} from 'lucide-react'

const RESOURCE_TYPES = [
  { value: 'lesson_plan', label: 'Lesson Plan', icon: FileText },
  { value: 'scheme_of_work', label: 'Scheme of Work', icon: CalendarRange },
  { value: 'exam', label: 'Exam', icon: ClipboardCheck },
  { value: 'rubric', label: 'Rubric', icon: CheckSquare },
  { value: 'notes', label: 'Notes', icon: FileSpreadsheet },
  { value: 'revision_paper', label: 'Revision Paper', icon: GraduationCap },
  { value: 'project', label: 'Project', icon: BookOpen },
  { value: 'worksheet', label: 'Worksheet', icon: FileText },
] as const

const CBC_GRADES = [
  'PP1', 'PP2',
  'Grade 1', 'Grade 2', 'Grade 3',
  'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9',
] as const

const TYPE_ICONS: Record<string, React.ElementType> = {
  lesson_plan: FileText,
  scheme_of_work: CalendarRange,
  exam: ClipboardCheck,
  rubric: CheckSquare,
  notes: FileSpreadsheet,
  revision_paper: GraduationCap,
  project: BookOpen,
  worksheet: FileText,
  teaching_aid: BookOpen,
  marking_scheme: ClipboardCheck,
  presentation: GraduationCap,
}

interface ResourceItem {
  id: string
  title: string
  type: string
  grade: string
  learningArea: string
  content?: string
  authorName: string
  status: string
  createdAt?: { _seconds?: number; toDate?: () => Date } | string
  source?: string
}

function ResourceCard({ resource }: { resource: ResourceItem }) {
  const Icon = TYPE_ICONS[resource.type] ?? BookOpen
  const dateStr = resource.createdAt
    ? typeof resource.createdAt === 'object' && 'toDate' in resource.createdAt
      ? (resource.createdAt as { toDate: () => Date }).toDate().toLocaleDateString('en-KE')
      : typeof resource.createdAt === 'object' && '_seconds' in resource.createdAt
        ? new Date((resource.createdAt as { _seconds: number })._seconds * 1000).toLocaleDateString('en-KE')
        : typeof resource.createdAt === 'string'
          ? new Date(resource.createdAt).toLocaleDateString('en-KE')
          : ''
    : ''

  return (
    <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">{resource.title}</CardTitle>
              <CardDescription className="text-xs">
                {resource.authorName} &middot; {dateStr}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0 text-[10px]">
            {resource.type.replace(/_/g, ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5">
            {resource.grade}
          </span>
          {resource.learningArea && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5">
              {resource.learningArea}
            </span>
          )}
          {resource.source && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 capitalize">
              {resource.source.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ResourcesPage() {
  useRequireAuth()
  const { user } = useAuth()

  const [resources, setResources] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('')
  const [filterGrade, setFilterGrade] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [formTitle, setFormTitle] = useState('')
  const [formType, setFormType] = useState('')
  const [formGrade, setFormGrade] = useState('')
  const [formLearningArea, setFormLearningArea] = useState('')
  const [formContent, setFormContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchResources = useCallback(async () => {
    try {
      const auth = getAuthInstance()
      const token = await auth.currentUser?.getIdToken()
      if (!token) return

      const params = new URLSearchParams()
      if (filterType) params.set('type', filterType)
      if (filterGrade) params.set('grade', filterGrade)

      const res = await fetch(`/api/resources?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setResources(data.resources)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [filterType, filterGrade])

  useEffect(() => {
    setLoading(true)
    fetchResources()
  }, [fetchResources])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')

    try {
      const auth = getAuthInstance()
      const token = await auth.currentUser?.getIdToken()
      if (!token) {
        setFormError('You must be signed in')
        return
      }

      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formTitle,
          type: formType,
          grade: formGrade,
          learningArea: formLearningArea,
          content: formContent,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error ?? 'Failed to save resource')
        return
      }

      setFormTitle('')
      setFormType('')
      setFormGrade('')
      setFormLearningArea('')
      setFormContent('')
      setShowForm(false)
      fetchResources()
    } catch {
      setFormError('Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = formTitle.trim() && formType && formGrade.trim()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Resource Centre</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Cancel' : 'Add Resource'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Resource</CardTitle>
            <CardDescription>Share a teaching resource with the community.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Grade 4 Science Lesson on Plants"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formType} onValueChange={(v) => { if (v) setFormType(v) }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESOURCE_TYPES.map((rt) => (
                        <SelectItem key={rt.value} value={rt.value}>
                          {rt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Select value={formGrade} onValueChange={(v) => { if (v) setFormGrade(v) }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {CBC_GRADES.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="learningArea">Learning Area</Label>
                  <Input
                    id="learningArea"
                    placeholder="e.g. Science, Mathematics, English"
                    value={formLearningArea}
                    onChange={(e) => setFormLearningArea(e.target.value)}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Paste or type your resource content here..."
                    className="min-h-32"
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                  />
                </div>
              </div>

              {formError && <p className="text-sm text-destructive">{formError}</p>}

              <Button type="submit" disabled={!canSubmit || submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Resource'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Browse Resources
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="w-40">
                <Select value={filterType} onValueChange={(v) => { if (v !== null) { setFilterType(v); setLoading(true) } }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    {RESOURCE_TYPES.map((rt) => (
                      <SelectItem key={rt.value} value={rt.value}>
                        {rt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-36">
                <Select value={filterGrade} onValueChange={(v) => { if (v !== null) { setFilterGrade(v); setLoading(true) } }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All grades</SelectItem>
                    {CBC_GRADES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {(filterType || filterGrade) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setFilterType(''); setFilterGrade('') }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : resources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                {filterType || filterGrade
                  ? 'No resources match your filters.'
                  : 'No resources yet. Add your first resource!'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
