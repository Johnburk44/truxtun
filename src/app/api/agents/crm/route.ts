import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const config = await req.json()

    // Create the agent in the database
    const agent = await prisma.agent.create({
      data: {
        name: 'CRM Agent',
        type: 'crm',
        status: 'active',
        config: {
          provider: 'hubspot',
          credentials: {
            apiKey: config.apiKey,
            portalId: config.portalId
          },
          automations: config.automations
        },
        metadata: {
          lastSync: new Date().toISOString(),
          stats: {
            meetings: 0,
            updates: 0,
            tasks: 0
          }
        }
      }
    })

    return NextResponse.json(agent)
  } catch (error) {
    console.error('Failed to deploy CRM agent:', error)
    return NextResponse.json(
      { error: 'Failed to deploy agent' },
      { status: 500 }
    )
  }
}
