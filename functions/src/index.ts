import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

// AI Functions
export { aiLessonPlan } from './ai/lesson-plan'
export { aiExam } from './ai/exam-generator'
export { aiSchemeOfWork } from './ai/scheme-of-work'
export { aiRubric } from './ai/rubric-generator'
export { aiReportComments } from './ai/report-comments'
export { aiReportCard } from './ai/report-card'
export { aiSmartSearch } from './ai/smart-search'
export { aiQualityCheck } from './ai/quality-checker'
export { aiHomeworkHelp } from './ai/homework-assistant'

// Billing Functions
export { processPesapalIPN, createPesapalOrder, checkPesapalPayment } from './billing/pesapal'

// Export Functions
export { exportPdf } from './exports/pdf-generator'
export { exportExcel } from './exports/excel-generator'

// Auth Triggers
export { onUserCreate, onUserDelete } from './auth/triggers'
