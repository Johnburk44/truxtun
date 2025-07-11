'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { AppSidebar } from "@/components/app-sidebar"

interface Deal {
  id: string
  properties: {
    dealname: string
    amount: string
    dealstage: string
    closedate: string
    pipeline: string
  }
}

export default function PipelinePage() {
  const { data: session } = useSession()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDeals() {
      try {
        const response = await fetch('/api/crm/deals')
        if (!response.ok) {
          throw new Error('Failed to fetch deals')
        }
        const data = await response.json()
        setDeals(data.results)
      } catch (error) {
        console.error('Error fetching deals:', error)
        setError(error instanceof Error ? error.message : 'Failed to load deals')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchDeals()
    }
  }, [session])

  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Deal Pipeline</h1>
            <Button onClick={() => window.location.href = '/api/auth/hubspot'}>
              {loading ? 'Loading...' : error ? 'Reconnect HubSpot' : 'Refresh Deals'}
            </Button>
          </div>
          {error ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-red-500">{error}</div>
              </CardContent>
            </Card>
          ) : loading ? (
            <Card>
              <CardContent className="pt-6">
                <div>Loading deals...</div>
              </CardContent>
            </Card>
          ) : deals.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div>No deals found. Create your first deal to get started.</div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {deals.map((deal) => (
                <Card key={deal.id}>
                  <CardHeader>
                    <CardTitle>{deal.properties.dealname}</CardTitle>
                    <CardDescription>
                      Stage: {deal.properties.dealstage}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">Amount</div>
                        <div>${deal.properties.amount}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Close Date</div>
                        <div>{new Date(deal.properties.closedate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
