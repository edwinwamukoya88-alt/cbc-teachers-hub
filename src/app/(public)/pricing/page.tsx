'use client'

import { useRouter } from 'next/navigation'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Free',
    price: 'KSh 0',
    description: 'For individual teachers exploring AI tools.',
    features: [
      '10 Lesson Plans/mo',
      '3 Exams/mo',
      '5 Report Cards/mo',
      '30 Smart Searches/mo',
      '5 Quality Checks/mo',
      'Basic Resources',
    ],
    cta: 'Get Started',
    href: '/signup',
    featured: false,
  },
  {
    name: 'Teacher Pro',
    price: 'KSh 499',
    period: '/mo',
    description: 'For professional teachers who need unlimited AI tools.',
    features: [
      'Unlimited Lesson Plans',
      'Unlimited Exams',
      'Unlimited Report Cards',
      'Unlimited Smart Search',
      'Unlimited Quality Checks',
      'PDF & Excel Export',
      'Premium Resources',
      'Priority Support',
    ],
    cta: 'Start Free Trial',
    href: '/signup',
    featured: true,
  },
  {
    name: 'School',
    price: 'KSh 2,999',
    period: '/mo',
    description: 'For schools managing multiple teachers.',
    features: [
      'Everything in Teacher Pro',
      'Up to 30 Teachers',
      'School Management',
      'Student Diary System',
      'Parent Portal',
      'Analytics Dashboard',
      'Dedicated Support',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    featured: false,
  },
]

export default function PricingPage() {
  const router = useRouter()

  return (
    <div className="container py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground">Start free, upgrade when you need more.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.featured ? 'border-primary shadow-lg relative' : ''}>
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.featured ? 'default' : 'outline'} onClick={() => router.push(plan.href)}>
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
