import { NextResponse } from 'next/server'
import { verifyAuthToken, generateWithFallback, buildSchemeOfWorkPrompt, checkPlanLimits, incrementUsage, saveGeneratedContent } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const auth = await verifyAuthToken(request.headers.get('Authorization'))
    const body = await request.json()
    const { grade, learningArea, term, year, numberOfWeeks, strand } = body

    if (!grade?.trim()) return NextResponse.json({ success: false, data: 'Grade is required' }, { status: 400 })
    if (!learningArea?.trim()) return NextResponse.json({ success: false, data: 'Learning area is required' }, { status: 400 })
    if (!term) return NextResponse.json({ success: false, data: 'Term is required' }, { status: 400 })
    if (!year) return NextResponse.json({ success: false, data: 'Year is required' }, { status: 400 })

    const limitCheck = await checkPlanLimits(auth.uid, 'schemesOfWork')
    if (!limitCheck.allowed) {
      return NextResponse.json({ success: false, data: limitCheck.message! }, { status: 403 })
    }

    const prompt = buildSchemeOfWorkPrompt({
      grade: grade.trim(),
      learningArea: learningArea.trim(),
      term: Number(term),
      year: Number(year),
      numberOfWeeks: numberOfWeeks ? Number(numberOfWeeks) : undefined,
      strand: strand?.trim(),
    })

    const result = await generateWithFallback(prompt)
    const contentId = await saveGeneratedContent(auth.uid, 'scheme_of_work', body, result.output, result.model, result.tokensUsed)
    await incrementUsage(auth.uid, 'schemesOfWork', result.tokensUsed)

    return NextResponse.json({ success: true, data: result.output, id: contentId, model: result.model })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('scheme-of-work API error:', err)
    return NextResponse.json({ success: false, data: message }, { status: 500 })
  }
}
