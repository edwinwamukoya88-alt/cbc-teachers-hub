import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const aiReportCard = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  const { studentName, grade, term, year, subjects, behaviorNotes, attendancePercentage, language } = data

  console.log('Generating report card for:', studentName, grade, term, year)

  const db = admin.firestore()

  const reportCard = {
    userId: context.auth.uid,
    studentName,
    grade,
    term,
    year,
    subjects: subjects.map((s: { learningArea: string; catScore?: number; midTermScore?: number; endTermScore?: number }) => {
      const scores = [s.catScore, s.midTermScore, s.endTermScore].filter((x): x is number => x != null)
      const averageScore = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0
      return {
        learningArea: s.learningArea,
        catScore: s.catScore ?? null,
        midTermScore: s.midTermScore ?? null,
        endTermScore: s.endTermScore ?? null,
        averageScore,
        grade: averageScore >= 80 ? 'A' : averageScore >= 70 ? 'B' : averageScore >= 50 ? 'C' : 'D',
        performanceLevel: averageScore >= 70 ? 'exceeds' : averageScore >= 50 ? 'meets' : averageScore >= 30 ? 'approaching' : 'below',
        strengths: `${s.learningArea}: Consistent performance`,
        areasForImprovement: `Continue practicing ${s.learningArea}`,
        comment: `${studentName} ${averageScore >= 50 ? 'has shown good progress' : 'would benefit from additional support'} in ${s.learningArea}.`,
      }
    }),
    overallPerformanceRating: 'average' as const,
    strengthsAnalysis: `${studentName} demonstrates interest and participation in learning activities.`,
    areasForImprovement: 'Focus on consistent study habits and timely submission of assignments.',
    competencyEvaluation: {
      criticalThinking: 'meets' as const,
      communication: 'meets' as const,
      collaboration: 'meets' as const,
      creativity: 'approaching' as const,
      selfEfficacy: 'meets' as const,
    },
    teacherComment: `${studentName} is a diligent learner who actively participates in class activities. Continued effort in all learning areas is encouraged.`,
    behaviorComment: behaviorNotes ?? 'Demonstrates good behavior and follows school rules.',
    effortComment: 'Shows consistent effort in most learning areas.',
    parentFeedbackSummary: 'Your child is making steady progress. Encourage daily reading and homework completion.',
    homeSupportSuggestions: ['Create a daily reading routine', 'Provide a quiet study space', 'Review classwork together'],
    motivationMessage: `Keep up the great work, ${studentName}! Your dedication to learning is inspiring.`,
    revisionTopics: [],
    studyStrategies: ['Create a study timetable', 'Use flashcards for key concepts', 'Practice past exam papers'],
    teacherInterventions: ['Additional worksheets for weak areas', 'One-on-one sessions as needed'],
    parentalSupportTips: ['Monitor homework completion', 'Communicate regularly with teachers', 'Celebrate achievements'],
    model: 'gpt-4o',
    language: language ?? 'en',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  } as admin.firestore.DocumentData

  const ref = await db.collection('report_cards').add(reportCard)

  return {
    id: ref.id,
    ...reportCard,
  }
})
