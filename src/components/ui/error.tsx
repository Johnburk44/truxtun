import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from './button'
import { Alert, AlertDescription, AlertTitle } from './alert'

interface ErrorProps {
  title?: string
  message?: string
  retry?: () => void
}

export function ErrorAlert({ 
  title = 'Something went wrong', 
  message = 'An error occurred while processing your request.',
  retry
}: ErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center gap-4">
        {message}
        {retry && (
          <Button
            variant="outline"
            size="sm"
            onClick={retry}
            className="ml-auto"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

export function ErrorPage({ 
  title = 'Something went wrong', 
  message = 'An error occurred while loading this page.',
  retry 
}: ErrorProps) {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-muted-foreground">{message}</p>
        {retry && (
          <Button
            variant="outline"
            onClick={retry}
            className="mt-4"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        )}
      </div>
    </div>
  )
}
