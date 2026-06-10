import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const aiQualityCheck = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  const { resourceId } = data

  if (!resourceId) throw new functions.https.HttpsError('invalid-argument', 'Resource ID is required')

  const db = admin.firestore()
  const resourceDoc = await db.collection('resources').doc(resourceId).get()

  if (!resourceDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Resource not found')
  }

  // Mock quality check scores
  const review = {
    resourceId,
    reviewedBy: 'ai',
    originalityScore: 85,
    curriculumAlignmentScore: 90,
    classroomReadinessScore: 80,
    educationalQualityScore: 88,
    overallScore: 86,
    aiWritingLikelihoodScore: 15,
    duplicateContentDetected: false,
    similarResourceIds: [],
    originalityAnalysis: 'Content appears original with appropriate structure and examples.',
    curriculumReview: 'Well-aligned with CBC curriculum standards.',
    qualityObservations: 'Clear, well-organized, and ready for classroom use.',
    improvementSuggestions: ['Add more practical activities', 'Include differentiation strategies'],
    recommendation: 'approved',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }

  await db.collection('quality_reviews').add(review)

  // Update resource status based on quality scores
  const recommendation = review.overallScore >= 75 ? 'approved' as const : 'revision_required' as const
  await resourceDoc.ref.update({
    qualityScore: review.overallScore,
    originalityScore: review.originalityScore,
    curriculumAlignmentScore: review.curriculumAlignmentScore,
    classroomReadinessScore: review.classroomReadinessScore,
    publishingRecommendation: recommendation,
    status: recommendation === 'approved' ? 'published' : 'pending_review',
  })

  return {
    reviewId: resourceId,
    ...review,
  }
})
