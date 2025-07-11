import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'

export function createMockRequestResponse(method = 'GET', body?: any) {
  const req = new Request('http://localhost:3000', {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return { req }
}

export function mockPrisma() {
  vi.mock('@/lib/prisma', () => ({
    prisma: {
      product: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      callTranscript: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      documentPrompt: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      gptConfiguration: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  }))

  return { prisma }
}
