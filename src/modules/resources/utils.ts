import { collection, getDocs, query, where, orderBy, limit as firestoreLimit } from 'firebase/firestore'
import { getFirestoreInstance, getStorageInstance } from '@/lib/firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import type { Resource } from '@/types'

export const fetchResources = async (filters?: {
  grade?: string
  learningArea?: string
  type?: string
  status?: string
  limitCount?: number
}) => {
  const db = getFirestoreInstance()
  const constraints: import('firebase/firestore').QueryConstraint[] = []
  if (filters?.grade) constraints.push(where('grade', '==', filters.grade))
  if (filters?.learningArea) constraints.push(where('learningArea', '==', filters.learningArea))
  if (filters?.type) constraints.push(where('type', '==', filters.type))
  if (filters?.status) constraints.push(where('status', '==', filters.status))
  constraints.push(orderBy('createdAt', 'desc'))
  constraints.push(firestoreLimit(filters?.limitCount ?? 50))

  const q = query(collection(db, 'resources'), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as (Resource & { id: string })[]
}

export const uploadResourceFile = async (file: File, path: string) => {
  const storage = getStorageInstance()
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
