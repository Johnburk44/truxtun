'use client'

import { useEffect } from 'react'
import { ErrorPage } from '@/components/ui/error'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <ErrorPage
      title="Something went wrong!"
      message="An error occurred while loading this page. Please try again."
      retry={reset}
    />
  )
}
