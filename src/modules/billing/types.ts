export interface BillingPlan {
  id: string
  name: string
  price: number
  currency: string
  period: string
  features: string[]
}

export interface SubscriptionInfo {
  plan: 'free' | 'teacher_pro' | 'school'
  status: string
  currentPeriodEnd?: string
  paymentMethod?: string
}
