import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Truxtun',
  description: 'AI-powered sales assistant dashboard'
}

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Truxtun, your AI sales assistant
        </p>
      </div>
    </main>
  )
}
