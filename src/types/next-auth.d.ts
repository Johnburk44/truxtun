import 'next-auth'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string | null
      organizationId: string
      role?: UserRole
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    organizationId: string
    role?: UserRole
  }
}
