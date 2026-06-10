import * as functions from 'firebase-functions'

export const aiHomeworkHelp = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  return {
    id: 'mock-homework-id',
    output: 'Homework help response will be generated here.',
    outputFormat: 'markdown',
    model: 'gemini-pro',
    tokensUsed: 0,
  }
})
