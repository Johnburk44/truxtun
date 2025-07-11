import { hash } from 'bcryptjs'
import { prisma } from '../src/lib/db'

async function createTestUser() {
  try {
    const email = 'truxtun.ai@gmail.com'
    const password = 'test123' // This is just for testing, in production use a secure password
    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        hashedPassword,
        name: 'Test User',
        role: 'ADMIN'
      },
      create: {
        email,
        hashedPassword,
        name: 'Test User',
        role: 'ADMIN'
      }
    })

    console.log('Test user created:', user)
  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
