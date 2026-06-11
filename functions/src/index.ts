import * as admin from 'firebase-admin'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as dotenv from 'dotenv'

dotenv.config()

admin.initializeApp()

// AI Functions
export { aiLessonPlan as aiLessonPlanV1 } from './ai/lesson-plan'
export { aiExam } from './ai/exam-generator'
export { aiSchemeOfWork } from './ai/scheme-of-work'
export { aiRubric } from './ai/rubric-generator'
export { aiReportComments } from './ai/report-comments'
export { aiReportCard } from './ai/report-card'
export { aiSmartSearch } from './ai/smart-search'
export { aiQualityCheck } from './ai/quality-checker'
export { aiHomeworkHelp } from './ai/homework-assistant'

// Billing Functions
export { processPesapalIPN, createPesapalOrder, checkPesapalPayment } from './billing/pesapal'

// Export Functions
export { exportPdf } from './exports/pdf-generator'
export { exportExcel } from './exports/excel-generator'

// Auth Triggers
export { onUserCreate, onUserDelete } from './auth/triggers'

// ---------------------------------------------------------------------------
// V2: AI Lesson Plan (Gemini 2.5 Flash)
// ---------------------------------------------------------------------------

const apiKey = process.env.GEMINI_API_KEY
const hasGeminiKey = !!apiKey
console.log("GEMINI_API_KEY configured:", hasGeminiKey)

export const aiLessonPlan = onCall({ cors: true }, async (request) => {
  try {
    console.log("📥 aiLessonPlan invoked")
    console.log("  auth:", !!request.auth, "uid:", request.auth?.uid ?? "none")
    console.log("  data:", JSON.stringify(request.data))
    console.log("  env: GEMINI_API_KEY=" + hasGeminiKey)

    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'You must be signed in to generate a lesson plan')
    }

    if (!apiKey) {
      throw new HttpsError('failed-precondition', 'GEMINI_API_KEY environment variable is not set')
    }

    const { grade, learningArea, strand, subStrand, learningOutcomes, coreCompetencies } = request.data ?? {}

    if (!grade || !learningArea || !strand) {
      throw new HttpsError(
        'invalid-argument',
        `Missing required fields. Received: grade=${typeof grade} learningArea=${typeof learningArea} strand=${typeof strand}`
      )
    }

    const comps = Array.isArray(coreCompetencies) ? coreCompetencies.join(', ') : ''

    const prompt = `You are a Kenyan CBC curriculum expert. Generate a detailed, structured lesson plan in markdown format for the following:

Grade: ${grade}
Learning Area: ${learningArea}
Strand: ${strand}
Sub-Strand: ${subStrand ?? 'N/A'}
Core Competencies: ${comps || 'N/A'}
Specific Learning Outcomes: ${learningOutcomes ?? 'N/A'}

Include the following sections:
- Lesson Title
- Learning Outcomes
- Introduction (10 min)
- Development (30 min) with step-by-step activities
- Assessment (10 min)
- Resources
- Differentiation (support and extension)
- Reflection`

    console.log("🤖 Calling Gemini API...")
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    const output = result.response.text()
    console.log("✅ Gemini API response received, length:", output.length)

    // TODO: Save to generated_content collection
    // TODO: Update ai_usage counter

    console.log("📤 Returning lesson plan to client")
    return {
      id: `lesson-${Date.now()}`,
      output,
      outputFormat: 'markdown',
      model: 'gemini-2.5-flash',
      tokensUsed: result.response.usageMetadata?.totalTokenCount ?? 0,
    }
  } catch (err: any) {
    console.error("❌ FULL FUNCTION ERROR:", err)
    console.error("❌ ERROR STACK:", err?.stack)

    if (err instanceof HttpsError) {
      throw err
    }

    const message = err?.message ?? JSON.stringify(err)
    throw new HttpsError('internal', message)
  }
})
