export interface LessonPlanInputs {
  grade: string
  learningArea: string
  strand: string
  subStrand?: string
  learningOutcomes?: string
  coreCompetencies?: string[]
  numberOfLessons?: number
}

export function buildLessonPlanPrompt(inputs: LessonPlanInputs): string {
  const comps = inputs.coreCompetencies?.length ? inputs.coreCompetencies.join(', ') : 'N/A'
  return `You are a senior Kenyan CBC curriculum expert with 20 years of experience. Generate a detailed, classroom-ready lesson plan in markdown format.

Grade: ${inputs.grade}
Learning Area: ${inputs.learningArea}
Strand: ${inputs.strand}
Sub-Strand: ${inputs.subStrand ?? 'N/A'}
Number of Lessons: ${inputs.numberOfLessons ?? 1}
Core Competencies: ${comps}
Specific Learning Outcomes: ${inputs.learningOutcomes ?? 'To be determined by the teacher'}

Include ALL of the following sections with detailed content:

# Lesson Plan: ${inputs.learningArea} - ${inputs.strand}

## 1. Learning Outcomes
- List 3-5 specific, measurable learning outcomes aligned to CBC standards

## 2. Learning Resources
- Textbooks, manipulatives, digital tools, charts, realia

## 3. Introduction (10 minutes)
- Engaging starter activity linking to prior knowledge
- Key inquiry question to spark curiosity

## 4. Main Activities (30 minutes)
- Step-by-step learner-centered activities
- Group work, pair work, individual tasks
- Teacher facilitation notes for each step
- Differentiation: support for struggling learners and extension for fast learners

## 5. Assessment (10 minutes)
- Formative assessment strategies (observations, Q&A, exit tickets)
- Summative assessment if applicable

## 6. Conclusion (5 minutes)
- Recap of key takeaways
- Link to next lesson
- Home activity or assignment

## 7. Reflection
- What worked well?
- What could be improved?
- Notes for the next lesson`
}

export interface ExamInputs {
  grade: string
  learningArea: string
  examType: 'cat' | 'mid_term' | 'end_term'
  strand?: string
  term?: number
  totalMarks?: number
  duration?: string
}

export function buildExamPrompt(inputs: ExamInputs): string {
  const marks = inputs.totalMarks ?? (inputs.examType === 'cat' ? 30 : 100)
  return `You are a senior Kenyan CBC examiner with 20 years of experience. Generate a professional, standards-aligned exam paper in markdown format.

Grade: ${inputs.grade}
Learning Area: ${inputs.learningArea}
Exam Type: ${inputs.examType === 'cat' ? 'Continuous Assessment Test' : inputs.examType === 'mid_term' ? 'Mid-Term Exam' : 'End of Term Exam'}
Strand/Theme: ${inputs.strand ?? 'All strands covered this term'}
Term: ${inputs.term ?? 'Current'}
Total Marks: ${marks}
Duration: ${inputs.duration ?? (inputs.examType === 'cat' ? '40 minutes' : '1 hour 40 minutes')}
Competency Level: Assessment of knowledge, understanding, application, and reasoning

Generate the paper in this structure:

# ${inputs.learningArea} - ${inputs.examType === 'cat' ? 'Continuous Assessment Test' : inputs.examType === 'mid_term' ? 'Mid-Term Examination' : 'End of Term Examination'}
**Grade:** ${inputs.grade} &nbsp;&nbsp;&nbsp; **Term:** ${inputs.term ?? 'Current'} &nbsp;&nbsp;&nbsp; **Marks:** ${marks}

## Instructions to Learners
- Answer ALL questions in the spaces provided
- Read each question carefully before answering
- Time: ${inputs.duration ?? '1 hour 40 minutes'}

${inputs.examType === 'cat' ? `
## Section A: Objective Questions (${Math.round(marks * 0.3)} marks)
- 5-10 multiple choice or fill-in-the-blank questions  
- Test basic recall and understanding

## Section B: Structured Questions (${Math.round(marks * 0.4)} marks)
- 3-5 short answer questions requiring brief explanations
- Test application and comprehension

## Section C: Extended Response (${Math.round(marks * 0.3)} marks)
- 1-2 questions requiring detailed written responses
- Test analysis, evaluation, and creativity
` : `
## Section A: Objective Questions (${Math.round(marks * 0.2)} marks)
- 10-15 multiple choice or matching questions
- Covers all topics

## Section B: Short Answer (${Math.round(marks * 0.3)} marks)
- 5-8 questions testing understanding and application

## Section C: Structured Questions (${Math.round(marks * 0.3)} marks)
- 3-4 questions requiring explanations and demonstrations

## Section D: Problem Solving / Essay (${Math.round(marks * 0.2)} marks)
- 1-2 higher-order thinking questions
- Require analysis, synthesis and evaluation
`}

## Marking Scheme
For each question, provide:
- Correct answer / model response
- Mark allocation per item
- Alternative acceptable answers where applicable`
}

export interface SchemeOfWorkInputs {
  grade: string
  learningArea: string
  term: number
  year: number
  numberOfWeeks?: number
  strand?: string
}

export function buildSchemeOfWorkPrompt(inputs: SchemeOfWorkInputs): string {
  const weeks = inputs.numberOfWeeks ?? 13
  return `You are a senior Kenyan CBC curriculum designer with 20 years of experience. Generate a comprehensive Scheme of Work in markdown format.

Grade: ${inputs.grade}
Learning Area: ${inputs.learningArea}
Term: ${inputs.term}
Year: ${inputs.year}
Number of Weeks: ${weeks}
Strand / Topic: ${inputs.strand ?? 'All strands for this grade and term'}

Generate the scheme as a markdown TABLE with the following structure:

# SCHEME OF WORK
**Learning Area:** ${inputs.learningArea} &nbsp;&nbsp;&nbsp; **Grade:** ${inputs.grade}
**Term:** ${inputs.term} &nbsp;&nbsp;&nbsp; **Year:** ${inputs.year}

| Week | Strand / Theme | Sub-Strand / Sub-Theme | Specific Learning Outcomes | Key Inquiry Questions | Learning Experiences | Resources | Assessment Methods | Reflection |
|------|-------|----------|------------------------|---------------------|---------------------|-----------|-------------------|------------|
| 1 | ... | ... | ... | ... | ... | ... | ... | ... |

Fill the table with ${weeks} weeks of detailed content. Ensure:
- Logical progression from simple to complex concepts
- CBC competency-based approach with learner-centered experiences
- Integration of core competencies: Communication & Collaboration, Critical Thinking, Creativity & Imagination, Citizenship, Digital Literacy, Self-Efficacy
- Variety of assessment methods (observations, portfolios, written tests, projects)
- Adequate coverage for the term
- Each week includes at least 2-3 learning experiences`
}

export interface RubricInputs {
  grade: string
  learningArea: string
  assessmentTask: string
  rubricType: 'analytical' | 'holistic'
  criteria?: string[]
}

export function buildRubricPrompt(inputs: RubricInputs): string {
  const criteria = inputs.criteria?.length ? inputs.criteria.join(', ') : 'Content Knowledge, Skill Demonstration, Presentation/Organization, Creativity/Originality'
  return `You are a senior Kenyan CBC assessment expert with 20 years of experience. Generate a detailed, standards-aligned rubric in markdown format.

Grade: ${inputs.grade}
Learning Area: ${inputs.learningArea}
Assessment Task: ${inputs.assessmentTask}
Rubric Type: ${inputs.rubricType === 'analytical' ? 'Analytical (criteria-based with detailed descriptors)' : 'Holistic (overall performance levels with general descriptors)'}
Criteria to Assess: ${criteria}

Performance Levels (CBC-aligned):
- Exceeds Expectations (4) - Outstanding performance beyond grade level
- Meets Expectations (3) - Competent performance at grade level
- Approaching Expectations (2) - Developing but not yet meeting expectations
- Below Expectations (1) - Needs significant support

Generate in this structure:

# Assessment Rubric: ${inputs.assessmentTask}
**Grade:** ${inputs.grade} &nbsp;&nbsp;&nbsp; **Learning Area:** ${inputs.learningArea}

## Task Description
Brief description of what learners are expected to do

${inputs.rubricType === 'analytical' ? `
## Analytical Rubric

| Criteria | Exceeds (4) | Meets (3) | Approaching (2) | Below (1) | Score |
|----------|-------------|-----------|-----------------|-----------|-------|
| ${criteria.split(', ').join(` | Exemplary description | Competent description | Developing description | Minimal description |  |\n| `)} | Exemplary description | Competent description | Developing description | Minimal description |  |

## Scoring Guide
- **Total Points:** ___
- **Exceeds:** ___ - ___ points
- **Meets:** ___ - ___ points  
- **Approaching:** ___ - ___ points
- **Below:** Below ___ points

## Feedback Section
Space for teacher comments per criterion
` : `
## Holistic Rubric

| Level | Score | Descriptor |
|-------|-------|------------|
| **Exceeds Expectations** | 4 | Comprehensive description of overall performance at the highest level |
| **Meets Expectations** | 3 | Description of solid, competent performance meeting all requirements |
| **Approaching Expectations** | 2 | Description of developing performance with some gaps |
| **Below Expectations** | 1 | Description of performance needing significant improvement |

## Overall Score: ___ / 4
## Teacher Comments:
`}`
}

export interface ReportCommentsInputs {
  studentName: string
  grade: string
  subject: string
  performanceLevel?: 'exceeds' | 'meets' | 'approaching' | 'below'
  scores?: number[]
  strengths?: string
  areasForImprovement?: string
  language?: 'en' | 'sw'
}

export function buildReportCommentsPrompt(inputs: ReportCommentsInputs): string {
  const avgScore = inputs.scores?.length
    ? Math.round(inputs.scores.reduce((a: number, b: number) => a + b, 0) / inputs.scores.length)
    : undefined

  return `You are a senior Kenyan CBC teacher writing end-of-term report comments. Write a professional, personalized, and constructive report comment in markdown format.

Student Name: ${inputs.studentName}
Grade: ${inputs.grade}
Subject: ${inputs.subject}
Overall Performance: ${inputs.performanceLevel ?? (avgScore != null ? (avgScore >= 70 ? 'exceeds' : avgScore >= 50 ? 'meets' : avgScore >= 30 ? 'approaching' : 'below') : 'meets')}
Average Score: ${avgScore != null ? `${avgScore}%` : 'N/A'}
Strengths: ${inputs.strengths ?? 'To be observed'}
Areas for Improvement: ${inputs.areasForImprovement ?? 'To be observed'}
Language: ${inputs.language === 'sw' ? 'Kiswahili' : 'English'}

Generate the comment in this structure:

# Report Comment: ${inputs.subject}

## ${inputs.studentName}
A personalized, narrative comment (4-6 sentences) that:
1. Opens with a positive statement about the student's attitude and effort
2. Describes specific strengths observed in ${inputs.subject}
3. Addresses areas for growth constructively and specifically
4. Provides actionable recommendations for improvement
5. Closes with encouragement and motivation

## Subject Grade
- Current Achievement: ${inputs.performanceLevel ?? (avgScore != null ? (avgScore >= 70 ? 'Exceeds Expectations' : avgScore >= 50 ? 'Meets Expectations' : avgScore >= 30 ? 'Approaching Expectations' : 'Below Expectations') : 'Meets Expectations')}
- Score: ${avgScore != null ? `${avgScore}%` : 'N/A'}

## Key Strengths
- Bullet list of 2-3 specific strengths

## Areas for Growth
- Bullet list of 2-3 specific areas

## Recommendations for Parents
- Bullet list of 2-3 practical suggestions for home support

${inputs.language === 'sw' ? `
---

## Tafsiri kwa Kiswahili
Tafsiri ya maoni haya kwa Kiswahili.
` : ''}`
}
