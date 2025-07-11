import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { OrganizationForm } from './organization-form'

export default async function OnboardingPage({
  searchParams
}: {
  searchParams: { email?: string }
}) {
  const session = await getServerSession()
  
  // If user is already logged in and has an organization, redirect to dashboard
  if (session?.user?.organizationId) {
    redirect('/dashboard')
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome to Truxton</h1>
          <p className="text-muted-foreground">
            Let's set up your organization to get started.
          </p>
        </div>
        <OrganizationForm email={searchParams.email} />
      </div>
    </div>
  )
}
