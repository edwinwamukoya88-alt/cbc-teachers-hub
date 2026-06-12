import { NextResponse } from 'next/server'
import { verifyAuthToken, generateWithFallback, buildReportCommentsPrompt, checkPlanLimits, incrementUsage, saveGeneratedContent } from '@/lib/ai'

const VALID_PERFORMANCE_LEVELS = ['exceeds', 'meets', 'approaching', 'below'] as const
const VALID_LANGUAGES = ['en', 'sw'] as const

export async function POST(request: Request) {
  try {
    const auth = await verifyAuthToken(request.headers.get('Authorization'))
    const body = await request.json()
    const { studentName, grade, subject, performanceLevel, scores, strengths, areasForImprovement, language } = body

    if (!studentName?.trim()) return NextResponse.json({ success: false, data: 'Student name is required' }, { status: 400 })
    if (!grade?.trim()) return NextResponse.json({ success: false, data: 'Grade is required' }, { status: 400 })
    if (!subject?.trim()) return NextResponse.json({ success: false, data: 'Subject is required' }, { status: 400 })
    if (performanceLevel && !VALID_PERFORMANCE_LEVELS.includes(performanceLevel)) {
      return NextResponse.json({ success: false, data: 'Performance level must be exceeds, meets, approaching, or below' }, { status: 400 })
    }
    if (language && !VALID_LANGUAGES.includes(language)) {
      return NextResponse.json({ success: false, data: 'Language must be en or sw' }, { status: 400 })
    }

    const limitCheck = await checkPlanLimits(auth.uid, 'reportComments')
    if (!limitCheck.allowed) {
      return NextResponse.json({ success: false, data: limitCheck.message! }, { status: 403 })
    }

    const prompt = buildReportCommentsPrompt({
      studentName: studentName.trim(),
      grade: grade.trim(),
      subject: subject.trim(),
      performanceLevel,
      scores: Array.isArray(scores) ? scores.map(Number) : undefined,
      strengths: strengths?.trim(),
      areasForImprovement: areasForImprovement?.trim(),
      language,
    })

    const result = await generateWithFallback(prompt)
    const contentId = await saveGeneratedContent(auth.uid, 'report_comment', body, result.output, result.model, result.tokensUsed)
    await incrementUsage(auth.uid, 'reportComments', result.tokensUsed)

    return NextResponse.json({ success: true, data: result.output, id: contentId, model: result.model })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('report-comments API error:', err)
    return NextResponse.json({ success: false, data: message }, { status: 500 })
  }
}
