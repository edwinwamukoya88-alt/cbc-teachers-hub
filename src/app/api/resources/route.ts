import { NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getAdminDb } from '@/lib/ai/firestore'
import { verifyAuthToken } from '@/lib/ai/auth'

const RESOURCE_TYPES = [
  'lesson_plan', 'scheme_of_work', 'exam', 'rubric', 'notes',
  'revision_paper', 'project', 'teaching_aid', 'worksheet',
  'marking_scheme', 'presentation',
] as const

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    let uid: string
    try {
      const decoded = await verifyAuthToken(token)
      uid = decoded.uid
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { title, type, grade, learningArea, content, generatedContentId } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (!type || !RESOURCE_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Valid resource type is required' }, { status: 400 })
    }

    if (!grade?.trim()) {
      return NextResponse.json({ error: 'Grade is required' }, { status: 400 })
    }

    const db = getAdminDb()

    const userDoc = await db.collection('users').doc(uid).get()
    const userData = userDoc.data()
    const authorName = userData?.displayName ?? 'Unknown'

    const ref = await db.collection('resources').add({
      title: title.trim(),
      type,
      grade: grade.trim(),
      learningArea: learningArea?.trim() ?? '',
      content: content?.trim() ?? '',
      source: generatedContentId ? 'ai_generated' : 'community',
      authorId: uid,
      authorName,
      status: 'draft',
      isPremium: false,
      downloads: 0,
      rating: 0,
      ratingCount: 0,
      views: 0,
      tags: [],
      seoSlug: title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    if (generatedContentId) {
      await db.collection('generated_content').doc(generatedContentId).update({
        isSharedToResourceCentre: true,
      })
    }

    const newDoc = await ref.get()
    const resource = { id: ref.id, ...newDoc.data() }

    return NextResponse.json({ success: true, resource }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    try {
      await verifyAuthToken(token)
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const grade = searchParams.get('grade')
    const learningArea = searchParams.get('learningArea')

    const db = getAdminDb()
    let query: FirebaseFirestore.Query = db.collection('resources')

    if (type) {
      query = query.where('type', '==', type)
    }
    if (grade) {
      query = query.where('grade', '==', grade)
    }
    if (learningArea) {
      query = query.where('learningArea', '==', learningArea)
    }

    query = query.orderBy('createdAt', 'desc').limit(50)

    const snapshot = await query.get()
    const resources = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ success: true, resources })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
