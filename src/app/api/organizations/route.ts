import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createOrganization } from '@/lib/organization'

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, adminName, email } = body

    // Create organization with admin user
    const { org, user } = await createOrganization({
      name,
      adminEmail: email,
      adminName,
    })

    return NextResponse.json({ 
      organization: org,
      user
    })
  } catch (error) {
    console.error('Error creating organization:', error)
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    )
  }
}
