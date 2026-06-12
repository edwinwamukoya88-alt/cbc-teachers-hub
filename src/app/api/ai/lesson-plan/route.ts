import { NextResponse } from 'next/server'
import { verifyAuthToken, generateWithFallback, buildLessonPlanPrompt, checkPlanLimits, incrementUsage, saveGeneratedContent } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const auth = await verifyAuthToken(request.headers.get('Authorization'))
    const body = await request.json()
    const { grade, learningArea, strand, subStrand, learningOutcomes, coreCompetencies, numberOfLessons } = body

    if (!grade?.trim()) return NextResponse.json({ success: false, data: 'Grade is required' }, { status: 400 })
    if (!learningArea?.trim()) return NextResponse.json({ success: false, data: 'Learning area is required' }, { status: 400 })
    if (!strand?.trim()) return NextResponse.json({ success: false, data: 'Strand is required' }, { status: 400 })

    const limitCheck = await checkPlanLimits(auth.uid, 'lessonPlans')
    if (!limitCheck.allowed) {
      return NextResponse.json({ success: false, data: limitCheck.message! }, { status: 403 })
    }

    const prompt = buildLessonPlanPrompt({
      grade: grade.trim(),
      learningArea: learningArea.trim(),
      strand: strand.trim(),
      subStrand: subStrand?.trim(),
      learningOutcomes: learningOutcomes?.trim(),
      coreCompetencies: Array.isArray(coreCompetencies) ? coreCompetencies : undefined,
      numberOfLessons: numberOfLessons ? Number(numberOfLessons) : undefined,
    })

    const result = await generateWithFallback(prompt)
    const contentId = await saveGeneratedContent(auth.uid, 'lesson_plan', body, result.output, result.model, result.tokensUsed)
    await incrementUsage(auth.uid, 'lessonPlans', result.tokensUsed)

    return NextResponse.json({ success: true, data: result.output, id: contentId, model: result.model })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('lesson-plan API error:', err)
    return NextResponse.json({ success: false, data: message }, { status: 500 })
  }
}
