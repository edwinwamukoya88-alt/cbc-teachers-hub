import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/ai/auth'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export async function POST(request: Request) {
  try {
    try {
      await verifyAuthToken(request.headers.get('Authorization'))
    } catch {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', lessonPlan: null },
        { status: 401 },
      )
    }

    let subject: string, grade: string, topic: string, duration: string

    try {
      const body = await request.json()
      subject = body.subject?.trim()
      grade = body.grade?.trim()
      topic = body.topic?.trim()
      duration = body.duration?.trim()
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Please fill in all fields.',
          lessonPlan: null,
        },
        { status: 400 },
      )
    }

    if (!subject || !grade || !topic || !duration) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please fill in all fields.',
          lessonPlan: null,
        },
        { status: 400 },
      )
    }

    const prompt = `You are a professional CBC teacher in Kenya. Create a detailed lesson plan for:
Subject: ${subject}
Grade: ${grade}
Topic: ${topic}
Duration: ${duration}

Include:
- Learning outcomes
- Key inquiry question
- Introduction activity
- Main activities
- Differentiation (for learners with different abilities)
- Assessment methods
- Conclusion`

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured')
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to generate lesson plan. Please try again.',
          lessonPlan: null,
        },
        { status: 500 },
      )
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    let response: Response
    try {
      response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        }),
        signal: controller.signal,
      })
    } catch (err: unknown) {
      clearTimeout(timeout)
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.error('Gemini API request timed out')
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to generate lesson plan. Please try again.',
            lessonPlan: null,
          },
          { status: 504 },
        )
      }
      console.error('Gemini API fetch error:', err)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to generate lesson plan. Please try again.',
          lessonPlan: null,
        },
        { status: 502 },
      )
    }

    clearTimeout(timeout)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'unknown')
      console.error(`Gemini API returned ${response.status}: ${errorText}`)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to generate lesson plan. Please try again.',
          lessonPlan: null,
        },
        { status: 502 },
      )
    }

    let data: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
    try {
      data = await response.json()
    } catch {
      console.error('Failed to parse Gemini API response body')
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to generate lesson plan. Please try again.',
          lessonPlan: null,
        },
        { status: 502 },
      )
    }

    const lessonPlan = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!lessonPlan) {
      console.error('Gemini response missing lesson plan text:', JSON.stringify(data))
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to generate lesson plan. Please try again.',
          lessonPlan: null,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      success: true,
      message: '',
      lessonPlan,
    })
  } catch (err) {
    console.error('Unexpected error in generate-lesson-plan API:', err)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate lesson plan. Please try again.',
        lessonPlan: null,
      },
      { status: 500 },
    )
  }
}
