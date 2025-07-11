'use client'

import { Suspense } from 'react'
import { LoadingCard } from '@/components/ui/loading'
import { ErrorAlert } from '@/components/ui/error'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const formSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  hubspotApiKey: z.string().optional(),
  hubspotPortalId: z.string().optional(),
})

function OrganizationSettingsForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      hubspotApiKey: '',
      hubspotPortalId: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/organizations/${session?.user?.organizationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          hubspotConfig: {
            apiKey: values.hubspotApiKey,
            portalId: values.hubspotPortalId,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update organization')
      }

      toast({
        title: 'Settings updated',
        description: 'Your organization settings have been updated.',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Organization Settings</h1>
          <p className="text-muted-foreground">
            Manage your organization settings and integrations.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Update your organization details and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hubspot Integration</CardTitle>
            <CardDescription>
              Connect your Hubspot account to enable CRM features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="hubspotApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="pat-xx-xxxxx" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your Hubspot API key. Keep this secret!
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hubspotPortalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portal ID</FormLabel>
                      <FormControl>
                        <Input placeholder="123456" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your Hubspot portal ID.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Integration'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
