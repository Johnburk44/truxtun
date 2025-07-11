import { describe, it, expect, beforeEach } from 'vitest'
import { GET, POST } from './route'
import { createMockRequestResponse, mockPrisma } from '@/test/api-test-utils'

describe('Products API', () => {
  const { prisma } = mockPrisma()

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product',
          description: 'Test Description',
          specifications: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      prisma.product.findMany.mockResolvedValue(mockProducts)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockProducts)
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      })
    })

    it('should handle errors', async () => {
      prisma.product.findMany.mockRejectedValue(new Error('Database error'))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch products' })
    })
  })

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'New Product',
        description: 'New Description',
        specifications: {},
      }

      const mockCreatedProduct = {
        id: '1',
        ...newProduct,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prisma.product.create.mockResolvedValue(mockCreatedProduct)

      const { req } = createMockRequestResponse('POST', newProduct)
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockCreatedProduct)
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: newProduct,
      })
    })

    it('should handle errors during creation', async () => {
      const newProduct = {
        name: 'New Product',
        description: 'New Description',
        specifications: {},
      }

      prisma.product.create.mockRejectedValue(new Error('Database error'))

      const { req } = createMockRequestResponse('POST', newProduct)
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to create product' })
    })
  })
})
