import { Loader2 } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <Loader2 className="h-4 w-4 animate-spin" />
  )
}

export function LoadingPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="flex h-32 items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  )
}
