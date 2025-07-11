import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: { organizationId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user has access to this organization
    if (session.user.organizationId !== params.organizationId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const org = await prisma.organization.findUnique({
      where: { id: params.organizationId },
      include: {
        hubspotConfig: true
      }
    })

    if (!org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ organization: org })
  } catch (error) {
    console.error('Error fetching organization:', error)
    return NextResponse.json(
      { error: 'Failed to fetch organization' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { organizationId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user has access to this organization
    if (session.user.organizationId !== params.organizationId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { name } = body

    // Update organization
    const org = await prisma.organization.update({
      where: { id: params.organizationId },
      data: {
        name,
      },
      include: {
        hubspotConfig: true
      }
    })

    return NextResponse.json({ organization: org })
  } catch (error) {
    console.error('Error updating organization:', error)
    return NextResponse.json(
      { error: 'Failed to update organization' },
      { status: 500 }
    )
  }
}
