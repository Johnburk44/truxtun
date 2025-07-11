import { PrismaClient, UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin organization if it doesn't exist
  const adminOrgName = 'Admin Organization'
  let organization = await prisma.organization.findFirst({
    where: { name: adminOrgName }
  })

  if (!organization) {
    organization = await prisma.organization.create({
      data: {
        name: adminOrgName,
        schemaName: 'admin'
      }
    })
    console.log('Admin organization created')
  }

  // Create admin user if it doesn't exist
  const adminEmail = 'admin@example.com'
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const hashedPassword = await hash('password123', 12)
    await prisma.user.create({
      data: {
        email: adminEmail,
        hashedPassword,
        name: 'Admin User',
        role: UserRole.ADMIN,
        organizationId: organization.id
      }
    })
    console.log('Admin user created')
  } else {
    console.log('Admin user already exists')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
