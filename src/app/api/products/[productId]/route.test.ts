import { mockPrisma } from '@/lib/db/mock'
import { GET, PUT, DELETE } from './route'
import { createMockRequestResponse } from '@/lib/test-utils'

describe('Product Detail API', () => {
  const { prisma } = mockPrisma()
  const mockParams = { productId: '1' }

  describe('GET /api/products/[productId]', () => {
    it('should return a product by id', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        specifications: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prisma.product.findUnique.mockResolvedValue(mockProduct)

      const { req } = createMockRequestResponse()
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ product: mockProduct })
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: mockParams.productId },
      })
    })

    it('should return 404 when product not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null)

      const { req } = createMockRequestResponse()
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'Product not found' })
    })
  })

  describe('PUT /api/products/[productId]', () => {
    it('should update a product', async () => {
      const updateData = {
        name: 'Updated Product',
        description: 'Updated Description',
        specifications: { key: 'value' },
      }

      const mockUpdatedProduct = {
        id: '1',
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prisma.product.update.mockResolvedValue(mockUpdatedProduct)

      const { req } = createMockRequestResponse('PUT', updateData)
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ product: mockUpdatedProduct })
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: mockParams.productId },
        data: updateData,
      })
    })
  })

  describe('DELETE /api/products/[productId]', () => {
    it('should delete a product', async () => {
      prisma.product.delete.mockResolvedValue({})

      const { req } = createMockRequestResponse('DELETE')
      const response = await DELETE(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ success: true })
      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: mockParams.productId },
      })
    })
  })
})
