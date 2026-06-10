export const APP_NAME = 'CBC Teachers Hub'
export const APP_DESCRIPTION = 'AI-powered platform for Kenyan CBC teachers'

export const PLANS = {
  FREE: 'free',
  TEACHER_PRO: 'teacher_pro',
  SCHOOL: 'school',
} as const

export const AI_USAGE_LIMITS: Record<string, Record<string, number>> = {
  free: {
    lessonPlans: 10,
    exams: 3,
    schemesOfWork: 2,
    rubrics: 5,
    reportComments: 10,
    reportCards: 5,
    smartSearchQueries: 30,
    qualityChecks: 5,
    homeworkHelp: 0,
  },
  teacher_pro: {
    lessonPlans: 500,
    exams: 500,
    schemesOfWork: 500,
    rubrics: 500,
    reportComments: 500,
    reportCards: 500,
    smartSearchQueries: 500,
    qualityChecks: 500,
    homeworkHelp: 500,
  },
  school: {
    lessonPlans: 500,
    exams: 500,
    schemesOfWork: 500,
    rubrics: 500,
    reportComments: 500,
    reportCards: 500,
    smartSearchQueries: 500,
    qualityChecks: 500,
    homeworkHelp: 500,
  },
}

export const CBC_LEVELS = {
  PRE_PRIMARY: 'pre_primary',
  LOWER_PRIMARY: 'lower_primary',
  UPPER_PRIMARY: 'upper_primary',
  JUNIOR_SECONDARY: 'junior_secondary',
} as const

export const PERFORMANCE_LEVELS = ['exceeds', 'meets', 'approaching', 'below'] as const

export const RESOURCE_TYPES = [
  'lesson_plan', 'scheme_of_work', 'exam', 'rubric', 'notes',
  'revision_paper', 'project', 'teaching_aid', 'worksheet',
  'marking_scheme', 'presentation',
] as const

export const EXAM_TYPES = ['cat', 'mid_term', 'end_term'] as const

export const DIARY_CATEGORIES = [
  'homework', 'assignment', 'project', 'reminder',
  'examination', 'school_event', 'cbc_activity', 'holiday_assignment',
] as const

export const QUALITY_THRESHOLDS = {
  ORIGINALITY_MIN: 75,
  QUALITY_MIN: 75,
  CURRICULUM_ALIGNMENT_MIN: 75,
} as const
