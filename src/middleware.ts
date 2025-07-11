import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // Public routes, auth pages, and NextAuth.js API routes are always accessible
  if (
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/api/webhooks')
  ) {
    return NextResponse.next()
  }

  // Handle other API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  // Protected routes require authentication
  if (!token) {
    const searchParams = new URLSearchParams([
      ['callbackUrl', request.nextUrl.pathname],
    ])
    if (request.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    return NextResponse.redirect(new URL(`/auth/signin?${searchParams}`, request.url))
  }

  // Organization-specific routes
  if (request.nextUrl.pathname.startsWith('/settings')) {
    if (!token.organizationId) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // Add organization context to headers
    const headers = new Headers(request.headers)
    headers.set('x-organization-id', token.organizationId as string)

    return NextResponse.next({
      request: {
        headers,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
