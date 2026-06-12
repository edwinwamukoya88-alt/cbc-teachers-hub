import { Timestamp } from 'firebase/firestore'

export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'parent'
export type AccountType = 'independent_teacher' | 'parent' | 'school_admin'
export type Plan = 'free' | 'teacher_pro' | 'school'
export type Language = 'en' | 'sw'
export type SubscriptionStatus = 'active' | 'grace_period' | 'expired' | 'cancelled'
export type ResourceStatus = 'draft' | 'pending_review' | 'published' | 'rejected'
export type ResourceType = 'lesson_plan' | 'scheme_of_work' | 'exam' | 'rubric' | 'notes' | 'revision_paper' | 'project' | 'teaching_aid' | 'worksheet' | 'marking_scheme' | 'presentation'
export type PerformanceLevel = 'exceeds' | 'meets' | 'approaching' | 'below'
export type OverallRating = 'excellent' | 'high_achiever' | 'average' | 'developing' | 'needs_intensive_support'
export type ExamType = 'cat' | 'mid_term' | 'end_term'

export interface User {
  uid: string
  email: string
  displayName: string
  role: UserRole
  accountType: AccountType
  avatarUrl?: string
  phone?: string
  schoolId?: string
  plan: Plan
  isActive: boolean
  preferences: {
    language: Language
    biblicalIntegration: boolean
    darkMode: boolean
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Subscription {
  userId: string
  entityType: 'user' | 'school'
  plan: 'teacher_pro' | 'school'
  status: SubscriptionStatus
  pesapalOrderId: string
  pesapalSubscriptionId?: string
  amount: number
  currency: 'KES'
  currentPeriodStart: Timestamp
  currentPeriodEnd: Timestamp
  gracePeriodEnd?: Timestamp
  cancelledAt?: Timestamp
  paymentMethod: 'mpesa' | 'airtel_money' | 'card' | 'bank'
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface AIUsageMonth {
  lessonPlans: number
  exams: number
  schemesOfWork: number
  rubrics: number
  reportComments: number
  reportCards: number
  homeworkHelp: number
  smartSearchQueries: number
  qualityChecks: number
  totalTokensUsed: number
  totalCostUsd: number
  month: string
}

export interface School {
  name: string
  county: string
  subCounty: string
  type: 'public' | 'private' | 'faith_based'
  level: 'primary' | 'junior_secondary' | 'both'
  logoUrl?: string
  contactEmail: string
  contactPhone: string
  adminUserId: string
  plan: 'free' | 'school'
  maxTeachers?: number
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface SchoolMember {
  userId: string
  role: 'school_admin' | 'teacher' | 'parent'
  subjects?: string[]
  classes?: string[]
  invitedAt: Timestamp
  joinedAt: Timestamp
  isActive: boolean
}

export interface Grade {
  name: string
  level: 'pre_primary' | 'lower_primary' | 'upper_primary' | 'junior_secondary'
  order: number
}

export interface LearningArea {
  name: string
  code: string
}

export interface Strand {
  name: string
  order: number
}

export interface SubStrand {
  name: string
  specificLearningOutcomes: string[]
  suggestedActivities: string[]
  suggestedResources: string[]
  order: number
}

export interface Resource {
  title: string
  description: string
  type: ResourceType
  grade: string
  learningArea: string
  strand?: string
  subStrand?: string
  term?: number
  source: 'curated' | 'ai_generated' | 'community'
  authorId: string
  authorName: string
  fileUrl?: string
  content?: string
  thumbnailUrl?: string
  status: ResourceStatus
  isPremium: boolean
  price?: number
  qualityScore?: number
  originalityScore?: number
  curriculumAlignmentScore?: number
  classroomReadinessScore?: number
  publishingRecommendation?: 'approved' | 'approved_with_recommendations' | 'revision_required' | 'high_similarity'
  qualityReviewId?: string
  downloads: number
  rating: number
  ratingCount: number
  views: number
  tags: string[]
  seoSlug: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface GeneratedContent {
  userId: string
  type: 'lesson_plan' | 'exam' | 'scheme_of_work' | 'rubric' | 'report_comment' | 'report_card'
  inputs: Record<string, unknown>
  output: string
  outputFormat: 'markdown' | 'json'
  model: 'gpt-4o' | 'gemini-pro'
  tokensUsed: number
  isSavedToLibrary: boolean
  isSharedToResourceCentre: boolean
  language: Language
  createdAt: Timestamp
}

export interface QualityReview {
  resourceId: string
  reviewedBy: 'ai' | 'admin'
  adminUserId?: string
  originalityScore: number
  curriculumAlignmentScore: number
  classroomReadinessScore: number
  educationalQualityScore: number
  overallScore: number
  aiWritingLikelihoodScore: number
  duplicateContentDetected: boolean
  similarResourceIds: string[]
  originalityAnalysis: string
  curriculumReview: string
  qualityObservations: string
  improvementSuggestions: string[]
  recommendation: 'approved' | 'approved_with_recommendations' | 'revision_required' | 'high_similarity'
  adminOverride?: {
    decision: 'approved' | 'rejected'
    reason: string
    timestamp: Timestamp
  }
  createdAt: Timestamp
}

export interface SubjectResult {
  learningArea: string
  catScore?: number
  midTermScore?: number
  endTermScore?: number
  averageScore: number
  grade: string
  performanceLevel: PerformanceLevel
  strengths: string
  areasForImprovement: string
  comment: string
}

export interface ReportCard {
  userId: string
  schoolId?: string
  studentName: string
  studentId?: string
  grade: string
  term: number
  year: number
  subjects: SubjectResult[]
  overallPerformanceRating: OverallRating
  strengthsAnalysis: string
  areasForImprovement: string
  competencyEvaluation: {
    criticalThinking: PerformanceLevel
    communication: PerformanceLevel
    collaboration: PerformanceLevel
    creativity: PerformanceLevel
    selfEfficacy: PerformanceLevel
    digitalLiteracy?: PerformanceLevel
  }
  teacherComment: string
  behaviorComment: string
  effortComment: string
  parentFeedbackSummary: string
  homeSupportSuggestions: string[]
  motivationMessage: string
  revisionTopics: string[]
  studyStrategies: string[]
  teacherInterventions: string[]
  parentalSupportTips: string[]
  model: 'gpt-4o' | 'gemini-pro'
  language: Language
  exportedPdfUrl?: string
  createdAt: Timestamp
}

export interface BlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImageUrl: string
  authorId: string
  authorName: string
  tags: string[]
  category: string
  status: 'draft' | 'published'
  publishedAt?: Timestamp
  seoTitle: string
  seoDescription: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface DiaryEntry {
  schoolId: string
  classId: string
  teacherId: string
  teacherName: string
  date: Timestamp
  category: 'homework' | 'assignment' | 'project' | 'reminder' | 'examination' | 'school_event' | 'cbc_activity' | 'holiday_assignment'
  title: string
  description: string
  learningArea?: string
  strand?: string
  attachments: { type: 'document' | 'pdf' | 'image' | 'video'; url: string; name: string; size: number }[]
  dueDate?: Timestamp
  isGraded: boolean
  maxScore?: number
  targetStudents: 'all' | string[]
  submissionRequired: boolean
  reminderSent: boolean
  reminderSchedule?: Timestamp[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface MarketplaceTransaction {
  resourceId: string
  buyerId: string
  sellerId: string
  amount: number
  platformCommission: number
  sellerEarnings: number
  pesapalOrderId: string
  status: 'pending' | 'completed' | 'refunded'
  paymentMethod: 'mpesa' | 'airtel_money' | 'card' | 'bank'
  createdAt: Timestamp
}

export interface ReportCardInput {
  studentName: string
  grade: string
  term: number
  year: number
  subjects: {
    learningArea: string
    catScore?: number
    midTermScore?: number
    endTermScore?: number
    teacherObservations?: string
  }[]
  behaviorNotes?: string
  attendancePercentage?: number
  language: Language
}
