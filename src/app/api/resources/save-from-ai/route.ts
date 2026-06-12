import { NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getAdminDb } from '@/lib/ai/firestore'
import { verifyAuthToken } from '@/lib/ai/auth'

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

    const { generatedContentId } = await request.json()

    if (!generatedContentId) {
      return NextResponse.json({ error: 'generatedContentId is required' }, { status: 400 })
    }

    const db = getAdminDb()

    const genDoc = await db.collection('generated_content').doc(generatedContentId).get()
    if (!genDoc.exists) {
      return NextResponse.json({ error: 'Generated content not found' }, { status: 404 })
    }

    const genData = genDoc.data()!

    if (genData.userId !== uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (genData.isSharedToResourceCentre) {
      return NextResponse.json({ error: 'Already saved to Resource Centre' }, { status: 409 })
    }

    const userDoc = await db.collection('users').doc(uid).get()
    const userData = userDoc.data()
    const authorName = userData?.displayName ?? 'Unknown'

    const typeMapping: Record<string, string> = {
      lesson_plan: 'lesson_plan',
      exam: 'exam',
      scheme_of_work: 'scheme_of_work',
      rubric: 'rubric',
      report_comment: 'lesson_plan',
      report_card: 'lesson_plan',
    }

    const resourceType = typeMapping[genData.type] ?? 'lesson_plan'

    const ref = await db.collection('resources').add({
      title: (genData.inputs?.topic as string) ?? (genData.inputs?.subject as string) ?? `AI Generated ${genData.type}`,
      type: resourceType,
      grade: (genData.inputs?.grade as string) ?? '',
      learningArea: (genData.inputs?.learningArea as string) ?? (genData.inputs?.subject as string) ?? '',
      content: genData.output ?? '',
      source: 'ai_generated',
      authorId: uid,
      authorName,
      status: 'draft',
      isPremium: false,
      downloads: 0,
      rating: 0,
      ratingCount: 0,
      views: 0,
      tags: [],
      seoSlug: '',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    await genDoc.ref.update({
      isSharedToResourceCentre: true,
    })

    const newDoc = await ref.get()
    const resource = { id: ref.id, ...newDoc.data() }

    return NextResponse.json({ success: true, resource }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
