'use client'

import { Component, ReactNode } from 'react'
import { ErrorAlert } from '@/components/ui/error'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error) {
    console.error('Error caught by boundary:', error)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorAlert
          title="Something went wrong"
          message={this.state.error?.message || 'An error occurred while rendering this component.'}
        />
      )
    }

    return this.props.children
  }
}
