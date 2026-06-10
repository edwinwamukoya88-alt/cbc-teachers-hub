import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const aiLessonPlan = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  const { grade, learningArea, strand, subStrand, duration, biblicalIntegration, language } = data

  // TODO: Call Gemini/OpenAI with prompt template
  // TODO: Save to generated_content
  // TODO: Update ai_usage counter

  return {
    id: 'mock-lesson-plan-id',
    output: `# Lesson Plan: ${learningArea}\n\n**Grade:** ${grade}\n**Strand:** ${strand}\n**Sub-Strand:** ${subStrand}\n**Duration:** ${duration} minutes\n\n## Learning Outcomes\n- ...\n\n## Introduction\n- ...\n\n## Development\n- ...\n\n## Assessment\n- ...`,
    outputFormat: 'markdown',
    model: 'gemini-pro',
    tokensUsed: 0,
  }
})
