import { PrismaClient } from '@prisma/client'

// Initialize Prisma Client
export const prisma = new PrismaClient()

export async function createSchemaForOrg(schemaName: string) {
  try {
    // Create new schema
    await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`)
    
    // Set search path to new schema
    await prisma.$executeRawUnsafe(`SET search_path TO "${schemaName}"`)
    
    // Create tables in new schema using Prisma migrations
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN
        -- Create tables in the new schema
        CREATE TABLE IF NOT EXISTS "${schemaName}"."agents" (
          LIKE public."agents" INCLUDING ALL
        );
        
        CREATE TABLE IF NOT EXISTS "${schemaName}"."hubspot_webhooks" (
          LIKE public."hubspot_webhooks" INCLUDING ALL
        );
      END $$;
    `)
    
    return true
  } catch (error) {
    console.error('Error creating schema:', error)
    throw error
  }
}

export async function setSchemaForRequest(schemaName: string) {
  try {
    // Set search path for current connection
    await prisma.$executeRawUnsafe(`SET search_path TO "${schemaName}"`)
    return true
  } catch (error) {
    console.error('Error setting schema:', error)
    throw error
  }
}

export async function getCurrentSchema() {
  try {
    const result = await prisma.$queryRaw<[{ search_path: string }]>`SHOW search_path`
    return result[0].search_path
  } catch (error) {
    console.error('Error getting current schema:', error)
    throw error
  }
}
