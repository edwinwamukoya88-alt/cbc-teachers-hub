import { NextResponse } from 'next/server'
import { verifyAuthToken, generateWithFallback, buildExamPrompt, checkPlanLimits, incrementUsage, saveGeneratedContent } from '@/lib/ai'

const VALID_EXAM_TYPES = ['cat', 'mid_term', 'end_term'] as const

export async function POST(request: Request) {
  try {
    const auth = await verifyAuthToken(request.headers.get('Authorization'))
    const body = await request.json()
    const { grade, learningArea, examType, strand, term, totalMarks, duration } = body

    if (!grade?.trim()) return NextResponse.json({ success: false, data: 'Grade is required' }, { status: 400 })
    if (!learningArea?.trim()) return NextResponse.json({ success: false, data: 'Learning area is required' }, { status: 400 })
    if (!examType || !VALID_EXAM_TYPES.includes(examType)) {
      return NextResponse.json({ success: false, data: 'Exam type must be cat, mid_term, or end_term' }, { status: 400 })
    }

    const limitCheck = await checkPlanLimits(auth.uid, 'exams')
    if (!limitCheck.allowed) {
      return NextResponse.json({ success: false, data: limitCheck.message! }, { status: 403 })
    }

    const prompt = buildExamPrompt({
      grade: grade.trim(),
      learningArea: learningArea.trim(),
      examType,
      strand: strand?.trim(),
      term: term ? Number(term) : undefined,
      totalMarks: totalMarks ? Number(totalMarks) : undefined,
      duration: duration?.trim(),
    })

    const result = await generateWithFallback(prompt)
    const contentId = await saveGeneratedContent(auth.uid, 'exam', body, result.output, result.model, result.tokensUsed)
    await incrementUsage(auth.uid, 'exams', result.tokensUsed)

    return NextResponse.json({ success: true, data: result.output, id: contentId, model: result.model })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('exam-generator API error:', err)
    return NextResponse.json({ success: false, data: message }, { status: 500 })
  }
}
