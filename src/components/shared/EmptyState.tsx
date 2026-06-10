import { FileText, Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: 'inbox' | 'file'
}

export function EmptyState({ title, description, icon = 'inbox' }: EmptyStateProps) {
  const Icon = icon === 'file' ? FileText : Inbox

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-1">{description}</p>
    </div>
  )
}
