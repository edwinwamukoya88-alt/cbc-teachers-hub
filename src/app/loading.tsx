import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md">
        <LoadingSkeleton rows={4} />
      </div>
    </div>
  )
}
