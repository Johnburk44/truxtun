'use client'

import * as React from 'react'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSearchParams, useRouter } from 'next/navigation'

type IconProps = {
  className?: string
}

const Icons = {
  spinner: function Spinner({ className }: IconProps) {
    return (
      <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    )
  },
}

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(() => {
    return searchParams?.get('error') || null
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email')
      const password = formData.get('password')

      if (!email || !password) {
        setError('Please enter both email and password')
        return
      }

      const result = await signIn('credentials', {
        email: email.toString(),
        password: password.toString(),
        redirect: false,
        callbackUrl: '/dashboard'
      })

      if (!result) {
        setError('Something went wrong. Please try again.')
        return
      }

      if (result.error) {
        setError(result.error)
        return
      }

      router.push(result.url || '/dashboard')
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Sign in error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Truxton
        </div>
        <div className="relative z-20 mt-auto">
          <div className="space-y-2">
            <p className="text-lg">
              Create, train, and deploy custom GPTs powered by your organization's knowledge.
            </p>
          </div>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials below to continue
            </p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>
                    <span>Email</span>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      defaultValue="admin@example.com"
                      className="w-full mt-1.5"
                      autoComplete="email"
                      autoFocus
                    />
                  </Label>
                </div>
                <div className="grid gap-2">
                  <Label>
                    <span>Password</span>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      defaultValue="password123"
                      className="w-full mt-1.5"
                      autoComplete="current-password"
                    />
                  </Label>
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 rounded border border-red-100">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
