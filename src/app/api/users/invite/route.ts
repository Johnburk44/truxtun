import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.organizationId || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { email, role } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        role,
        organizationId: session.user.organizationId
      }
    })

    // TODO: Send invitation email

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error inviting user:', error)
    return NextResponse.json(
      { error: 'Failed to invite user' },
      { status: 500 }
    )
  }
}
