import * as functions from 'firebase-functions'

export const aiRubric = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  const { grade, learningArea, assessmentTask, rubricType } = data

  return {
    id: 'mock-rubric-id',
    output: `# Rubric: ${assessmentTask}\n\n**Grade:** ${grade}\n**Learning Area:** ${learningArea}\n**Type:** ${rubricType}\n\n| Criteria | Exceeds (4) | Meets (3) | Approaching (2) | Below (1) |\n|----------|-------------|-----------|-----------------|-----------|\n| ... | ... | ... | ... | ... |`,
    outputFormat: 'markdown',
    model: 'gemini-pro',
    tokensUsed: 0,
  }
})
