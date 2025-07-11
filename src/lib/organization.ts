import { prisma } from './db'
import { createSchemaForOrg } from './db'
import type { PrismaClient } from '@prisma/client'

export interface CreateOrgParams {
  name: string
  adminEmail: string
  adminName?: string
  hubspotConfig?: {
    apiKey?: string
    portalId?: string
    clientSecret?: string
  }
}

export async function createOrganization({
  name,
  adminEmail,
  adminName,
  hubspotConfig
}: CreateOrgParams) {
  // Generate a schema name from org name
  const schemaName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')

  // Create organization and admin user in a transaction
  const result = await prisma.$transaction(async (tx: PrismaClient) => {
    // Create organization
    const org = await tx.organization.create({
      data: {
        name,
        schemaName,
        hubspotConfig: hubspotConfig || {},
      }
    })

    // Create admin user
    const user = await tx.user.create({
      data: {
        email: adminEmail,
        name: adminName || adminEmail.split('@')[0],
        role: 'ADMIN',
        organizationId: org.id
      }
    })

    // Create schema and tables for the organization
    await createSchemaForOrg(schemaName)

    return { org, user }
  })

  return result
}

export async function getOrganizationById(id: string) {
  return prisma.organization.findUnique({
    where: { id },
    include: {
      users: {
        where: { role: 'ADMIN' }
      }
    }
  })
}

export async function updateHubspotConfig(
  organizationId: string,
  config: {
    apiKey?: string
    portalId?: string
    clientSecret?: string
  }
) {
  return prisma.organization.update({
    where: { id: organizationId },
    data: {
      hubspotConfig: config
    }
  })
}

export async function getCurrentOrganization(headers: Headers) {
  const orgId = headers.get('x-organization-id')
  if (!orgId) {
    throw new Error('No organization ID found in request')
  }

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      users: true
    }
  })

  if (!org) {
    throw new Error('Organization not found')
  }

  return org
}
