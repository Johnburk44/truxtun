import NextAuth from 'next-auth'
import { authOptions } from '@/auth'

const handler = NextAuth(authOptions)

export const GET = handler
export const POST = handler
export const HEAD = handler
export const OPTIONS = handler
