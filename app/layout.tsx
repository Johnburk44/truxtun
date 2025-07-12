import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Truxtun',
  description: 'AI-powered sales assistant dashboard'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
