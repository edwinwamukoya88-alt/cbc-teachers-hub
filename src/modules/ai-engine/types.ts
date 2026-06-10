export interface AIGenerateOptions {
  type: 'lesson_plan' | 'exam' | 'scheme_of_work' | 'rubric' | 'report_comment' | 'report_card'
  inputs: Record<string, unknown>
  language?: 'en' | 'sw'
}

export interface AIGenerateResult {
  id: string
  output: string
  outputFormat: 'markdown' | 'json'
  model: 'gpt-4o' | 'gemini-pro'
  tokensUsed: number
}

export interface AIUsageInfo {
  feature: string
  used: number
  limit: number
  remaining: number
}
