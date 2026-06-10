import * as functions from 'firebase-functions'

export const aiReportComments = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  const { studentName, grade, subject, scores, strengths, areasForImprovement, language } = data

  return {
    id: 'mock-comment-id',
    output: `**${studentName} - ${subject}**\n\n${studentName} has demonstrated a ${scores >= 70 ? 'strong' : 'developing'} understanding of ${subject}. ${strengths ? `Key strengths include ${strengths}.` : ''} ${areasForImprovement ? `Areas for improvement: ${areasForImprovement}.` : ''} Recommended focus areas include consistent practice and active participation in class discussions.`,
    outputFormat: 'markdown',
    model: 'gemini-pro',
    tokensUsed: 0,
  }
})
