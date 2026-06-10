'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { getFirestoreInstance } from '@/lib/firebase/config'
import type { Grade, LearningArea, Strand, SubStrand } from '@/types'

export function useCurriculumSelector() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [selectedGrade, setSelectedGrade] = useState<string>('')
  const [learningAreas, setLearningAreas] = useState<LearningArea[]>([])
  const [selectedArea, setSelectedArea] = useState<string>('')
  const [strands, setStrands] = useState<Strand[]>([])
  const [selectedStrand, setSelectedStrand] = useState<string>('')
  const [subStrands, setSubStrands] = useState<SubStrand[]>([])
  const [selectedSubStrand, setSelectedSubStrand] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const db = getFirestoreInstance()
    const fetchGrades = async () => {
      const q = query(collection(db, 'curriculum'), orderBy('order'))
      const snapshot = await getDocs(q)
      setGrades(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as unknown as Grade[])
    }
    fetchGrades()
  }, [])

  useEffect(() => {
    if (!selectedGrade) {
      setLearningAreas([])
      setSelectedArea('')
      return
    }
    const db = getFirestoreInstance()
    setLoading(true)
    const fetch = async () => {
      const q = query(
        collection(db, 'curriculum', selectedGrade, 'learning_areas'),
        orderBy('name')
      )
      const snapshot = await getDocs(q)
      setLearningAreas(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as unknown as LearningArea[])
      setLoading(false)
    }
    fetch()
  }, [selectedGrade])

  useEffect(() => {
    if (!selectedGrade || !selectedArea) {
      setStrands([])
      setSelectedStrand('')
      return
    }
    const db = getFirestoreInstance()
    setLoading(true)
    const fetch = async () => {
      const q = query(
        collection(db, 'curriculum', selectedGrade, 'learning_areas', selectedArea, 'strands'),
        orderBy('order')
      )
      const snapshot = await getDocs(q)
      setStrands(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as unknown as Strand[])
      setLoading(false)
    }
    fetch()
  }, [selectedGrade, selectedArea])

  useEffect(() => {
    if (!selectedGrade || !selectedArea || !selectedStrand) {
      setSubStrands([])
      setSelectedSubStrand('')
      return
    }
    const db = getFirestoreInstance()
    setLoading(true)
    const fetch = async () => {
      const q = query(
        collection(
          db, 'curriculum', selectedGrade, 'learning_areas',
          selectedArea, 'strands', selectedStrand, 'sub_strands'
        ),
        orderBy('order')
      )
      const snapshot = await getDocs(q)
      setSubStrands(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as unknown as SubStrand[])
      setLoading(false)
    }
    fetch()
  }, [selectedGrade, selectedArea, selectedStrand])

  return {
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
  }
}
