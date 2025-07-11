'use client'

export default function ConnectorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1">
      {children}
    </div>
  )
}
