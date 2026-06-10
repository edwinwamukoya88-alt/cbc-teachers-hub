export interface SmartSearchQuery {
  raw: string
  grade?: string
  learningArea?: string
  strand?: string
  subStrand?: string
  resourceType?: string
  intent?: 'teaching' | 'exam' | 'revision' | 'homework'
}

export interface SmartSearchResult {
  resources: Array<{
    id: string
    title: string
    description: string
    grade: string
    learningArea: string
    type: string
    qualityScore: number
    downloads: number
  }>
  suggestedFilters: {
    grades: string[]
    learningAreas: string[]
    types: string[]
  }
  recommendations: Array<{
    title: string
    reason: string
    id: string
  }>
  searchSummary: string
}
