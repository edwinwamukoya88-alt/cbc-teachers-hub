export interface QualityReviewResult {
  reviewId: string
  originalityScore: number
  curriculumAlignmentScore: number
  classroomReadinessScore: number
  educationalQualityScore: number
  overallScore: number
  recommendation: 'approved' | 'approved_with_recommendations' | 'revision_required' | 'high_similarity'
  improvementSuggestions: string[]
}
