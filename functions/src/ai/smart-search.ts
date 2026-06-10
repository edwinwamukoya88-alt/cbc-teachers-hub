import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const aiSmartSearch = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  const { raw, grade, learningArea, strand, resourceType } = data

  console.log('Smart search:', raw, grade, learningArea, strand, resourceType)

  const db = admin.firestore()

  // Build query from filters
  let query: FirebaseFirestore.Query = db.collection('resources').where('status', '==', 'published')

  if (grade) query = query.where('grade', '==', grade)
  if (learningArea) query = query.where('learningArea', '==', learningArea)
  if (resourceType) query = query.where('type', '==', resourceType)

  query = query.orderBy('downloads', 'desc').limit(20)

  const snapshot = await query.get()
  const resources = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))

  return {
    resources,
    suggestedFilters: {
      grades: grade ? [grade] : [],
      learningAreas: learningArea ? [learningArea] : [],
      types: resourceType ? [resourceType] : [],
    },
    recommendations: resources.slice(0, 3).map((r: Record<string, unknown>) => ({
      title: r.title as string,
      reason: 'Popular resource in this category',
      id: r.id as string,
    })),
    searchSummary: grade ? `Showing ${grade} ${learningArea ?? ''} resources` : `Showing ${resources.length} resources`,
  }
})
