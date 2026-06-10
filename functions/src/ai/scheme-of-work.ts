import * as functions from 'firebase-functions'

export const aiSchemeOfWork = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  const { grade, learningArea, term, year, weeksCount } = data

  return {
    id: 'mock-scheme-id',
    output: `# Scheme of Work: ${learningArea}\n\n**Grade:** ${grade}\n**Term:** ${term}\n**Year:** ${year}\n\n| Week | Strand | Sub-Strand | Learning Outcomes | Activities | Resources |\n|------|--------|------------|------------------|------------|-----------|\n| 1 | ... | ... | ... | ... | ... |`,
    outputFormat: 'markdown',
    model: 'gpt-4o',
    tokensUsed: 0,
  }
})
