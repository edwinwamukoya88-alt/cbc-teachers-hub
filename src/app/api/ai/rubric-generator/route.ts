import { NextResponse } from 'next/server'
import { verifyAuthToken, generateWithFallback, buildRubricPrompt, checkPlanLimits, incrementUsage, saveGeneratedContent } from '@/lib/ai'

const VALID_RUBRIC_TYPES = ['analytical', 'holistic'] as const

export async function POST(request: Request) {
  try {
    const auth = await verifyAuthToken(request.headers.get('Authorization'))
    const body = await request.json()
    const { grade, learningArea, assessmentTask, rubricType, criteria } = body

    if (!grade?.trim()) return NextResponse.json({ success: false, data: 'Grade is required' }, { status: 400 })
    if (!learningArea?.trim()) return NextResponse.json({ success: false, data: 'Learning area is required' }, { status: 400 })
    if (!assessmentTask?.trim()) return NextResponse.json({ success: false, data: 'Assessment task is required' }, { status: 400 })
    if (!rubricType || !VALID_RUBRIC_TYPES.includes(rubricType)) {
      return NextResponse.json({ success: false, data: 'Rubric type must be analytical or holistic' }, { status: 400 })
    }

    const limitCheck = await checkPlanLimits(auth.uid, 'rubrics')
    if (!limitCheck.allowed) {
      return NextResponse.json({ success: false, data: limitCheck.message! }, { status: 403 })
    }

    const prompt = buildRubricPrompt({
      grade: grade.trim(),
      learningArea: learningArea.trim(),
      assessmentTask: assessmentTask.trim(),
      rubricType,
      criteria: Array.isArray(criteria) ? criteria : undefined,
    })

    const result = await generateWithFallback(prompt)
    const contentId = await saveGeneratedContent(auth.uid, 'rubric', body, result.output, result.model, result.tokensUsed)
    await incrementUsage(auth.uid, 'rubrics', result.tokensUsed)

    return NextResponse.json({ success: true, data: result.output, id: contentId, model: result.model })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('rubric-generator API error:', err)
    return NextResponse.json({ success: false, data: message }, { status: 500 })
  }
}
