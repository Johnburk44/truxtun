'use client'

import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserRole } from '@prisma/client'

const inviteFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MEMBER']),
})

interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
}

export default function UsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
      role: 'MEMBER',
    },
  })

  async function onSubmit(values: z.infer<typeof inviteFormSchema>) {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          role: values.role,
          organizationId: session?.user?.organizationId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to invite user')
      }

      toast({
        title: 'Invitation sent',
        description: 'User has been invited to your organization.',
      })

      form.reset()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to invite user. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function removeUser(userId: string) {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove user')
      }

      setUsers(users.filter(user => user.id !== userId))
      
      toast({
        title: 'User removed',
        description: 'User has been removed from your organization.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove user. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users in your organization.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invite User</CardTitle>
            <CardDescription>
              Invite new users to your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MEMBER">Member</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Inviting...' : 'Invite User'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Users</CardTitle>
            <CardDescription>
              Manage existing users in your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name || '-'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeUser(user.id)}
                        disabled={user.id === session?.user?.id}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
