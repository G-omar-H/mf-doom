import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-mf-light-gray">
      <LoadingSpinner size={64} text="Loading..." />
    </div>
  )
} 