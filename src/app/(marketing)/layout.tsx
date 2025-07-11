import { MainNav } from "@/components/landing/nav"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 w-full">{children}</main>
    </div>
  )
}
