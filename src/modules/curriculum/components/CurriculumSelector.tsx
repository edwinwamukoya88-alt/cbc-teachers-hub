'use client'

import { useCurriculumSelector } from '../hooks/useCurriculumSelector'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

export function CurriculumSelector() {
  const {
    grades,
    selectedGrade,
    setSelectedGrade,
    learningAreas,
    selectedArea,
    setSelectedArea,
    strands,
    selectedStrand,
    setSelectedStrand,
    subStrands,
    selectedSubStrand,
    setSelectedSubStrand,
    loading,
  } = useCurriculumSelector()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Grade</label>
        <Select value={selectedGrade || null} onValueChange={(v) => setSelectedGrade(v ?? '')}>
          <SelectTrigger>
            <SelectValue placeholder="Select grade" />
          </SelectTrigger>
          <SelectContent>
            {grades.map((grade) => (
              <SelectItem key={(grade as unknown as { id: string }).id} value={(grade as unknown as { id: string }).id}>
                {grade.name as string}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Learning Area</label>
        {loading && !learningAreas.length ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select value={selectedArea || null} onValueChange={(v) => setSelectedArea(v ?? '')} disabled={!selectedGrade}>
            <SelectTrigger>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              {learningAreas.map((area) => (
                <SelectItem key={(area as unknown as { id: string }).id} value={(area as unknown as { id: string }).id}>
                  {(area as unknown as { name: string }).name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Strand</label>
        {loading && !strands.length ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select value={selectedStrand || null} onValueChange={(v) => setSelectedStrand(v ?? '')} disabled={!selectedArea}>
            <SelectTrigger>
              <SelectValue placeholder="Select strand" />
            </SelectTrigger>
            <SelectContent>
              {strands.map((strand) => (
                <SelectItem key={(strand as unknown as { id: string }).id} value={(strand as unknown as { id: string }).id}>
                  {(strand as unknown as { name: string }).name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sub-Strand</label>
        {loading && !subStrands.length ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select value={selectedSubStrand || null} onValueChange={(v) => setSelectedSubStrand(v ?? '')} disabled={!selectedStrand}>
            <SelectTrigger>
              <SelectValue placeholder="Select sub-strand" />
            </SelectTrigger>
            <SelectContent>
              {subStrands.map((ss) => (
                <SelectItem key={(ss as unknown as { id: string }).id} value={(ss as unknown as { id: string }).id}>
                  {(ss as unknown as { name: string }).name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  )
}
