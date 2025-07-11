import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/db'
import { setSchemaForRequest } from '@/lib/db'

export async function withOrg(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  try {
    // Get session token
    const token = await getToken({ req: request })
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { id: token.sub },
      include: { organization: true }
    })

    if (!user || !user.organization) {
      return NextResponse.json(
        { error: 'No organization found' },
        { status: 404 }
      )
    }

    // Set schema for this request
    await setSchemaForRequest(user.organization.schemaName)

    // Add organization context to request
    request.headers.set('X-Organization-ID', user.organizationId)
    request.headers.set('X-Schema-Name', user.organization.schemaName)

    // Call the handler
    return handler(request)

  } catch (error) {
    console.error('Error in withOrg middleware:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
