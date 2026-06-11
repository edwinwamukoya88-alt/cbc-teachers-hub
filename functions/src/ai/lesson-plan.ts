import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const aiLessonPlan = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  const { grade, learningArea, strand, subStrand, learningOutcomes, coreCompetencies } = data

  // TODO: Call Gemini/OpenAI with prompt template
  // TODO: Save to generated_content
  // TODO: Update ai_usage counter

  const comps = Array.isArray(coreCompetencies) ? coreCompetencies.join(', ') : ''

  return {
    id: 'mock-lesson-plan-id',
    output: `# CBC Lesson Plan

**Grade:** ${grade ?? 'N/A'}
**Learning Area:** ${learningArea ?? 'N/A'}
**Strand:** ${strand ?? 'N/A'}
**Sub-Strand:** ${subStrand ?? 'N/A'}
**Core Competencies:** ${comps || 'N/A'}

## Specific Learning Outcomes
${learningOutcomes ? `- ${learningOutcomes.split('\n').join('\n- ')}` : '- ...'}

## Introduction (10 min)
- Engage learners with a starter activity linking to prior knowledge
- Communicate the learning outcomes

## Development (30 min)
- Step 1: Introduce key concepts using examples and demonstrations
- Step 2: Guided practice with teacher support
- Step 3: Group or pair work applying the concepts

## Assessment (10 min)
- Review questions or exit ticket to check understanding
- Provide feedback and corrections

## Resources
- Textbook, charts, manipulatives, digital tools

## Differentiation
- Support: Scaffolded tasks for struggling learners
- Extension: Enrichment tasks for advanced learners

## Reflection
- What worked well? What needs improvement?`,
    outputFormat: 'markdown',
    model: 'gemini-pro',
    tokensUsed: 0,
  }
})
