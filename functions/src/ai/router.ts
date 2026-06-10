export const MODEL_ROUTING: Record<string, { primary: 'gemini' | 'openai'; fallback: 'gemini' | 'openai' }> = {
  lesson_plan:     { primary: 'gemini', fallback: 'openai' },
  exam:            { primary: 'openai', fallback: 'gemini' },
  scheme_of_work:  { primary: 'openai', fallback: 'gemini' },
  rubric:          { primary: 'gemini', fallback: 'openai' },
  report_comment:  { primary: 'gemini', fallback: 'openai' },
  report_card:     { primary: 'openai', fallback: 'gemini' },
  smart_search:    { primary: 'gemini', fallback: 'openai' },
  quality_check:   { primary: 'gemini', fallback: 'openai' },
  homework_help:   { primary: 'gemini', fallback: 'openai' },
}
