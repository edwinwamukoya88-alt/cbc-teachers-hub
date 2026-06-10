import * as functions from 'firebase-functions'

export const aiExam = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  const { grade, learningArea, examType, difficulty, numberOfQuestions } = data

  return {
    id: 'mock-exam-id',
    output: `# ${examType.toUpperCase()} Exam: ${learningArea}\n\n**Grade:** ${grade}\n**Total Marks:** 100\n\n## Section A (30 marks)\n1. ...\n\n## Section B (40 marks)\n...\n\n## Marking Scheme\n...`,
    outputFormat: 'markdown',
    model: 'gpt-4o',
    tokensUsed: 0,
  }
})
