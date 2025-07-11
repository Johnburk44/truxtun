import NextAuth from 'next-auth'
import type { NextAuthOptions, DefaultSession } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name: string
      organizationId: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string
    name?: string
    organizationId: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    name: string
    organizationId: string
  }
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is required')
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        // For testing purposes
        if (credentials.email === 'admin@example.com' && credentials.password === 'password123') {
          console.log('Auth successful')
          return {
            id: '1',
            email: credentials.email,
            name: 'Admin',
            organizationId: '1'
          }
        }

        console.log('Invalid credentials')
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.organizationId = user.organizationId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.organizationId = token.organizationId as string
      }
      return session
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}/dashboard`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
    signOut: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-do-not-use-in-production',
  debug: true
}

export default authOptions
