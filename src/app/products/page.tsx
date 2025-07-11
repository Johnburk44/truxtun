'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Product {
  id: string
  name: string
  description: string | null
  specifications: Record<string, any> | null
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    specifications: {},
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      })
      if (response.ok) {
        setNewProduct({ name: '', description: '', specifications: {} })
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to create product:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Product Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                />
              </div>
              <Button type="submit">Add Product</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 border rounded-lg flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {product.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-gray-500">No products found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
