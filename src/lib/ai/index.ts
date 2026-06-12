export { generateWithFallback } from './client'
export { verifyAuthToken } from './auth'
export { logAIUsage, saveGeneratedContent } from './firestore'
export { checkPlanLimits, incrementUsage, UPGRADE_MESSAGE } from './limits'
export {
  buildLessonPlanPrompt,
  buildExamPrompt,
  buildSchemeOfWorkPrompt,
  buildRubricPrompt,
  buildReportCommentsPrompt,
} from './prompts'
export type {
  LessonPlanInputs,
  ExamInputs,
  SchemeOfWorkInputs,
  RubricInputs,
  ReportCommentsInputs,
} from './prompts'
