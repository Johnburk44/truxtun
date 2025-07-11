"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar className="h-screen flex-shrink-0" />
        <main className="flex-1 overflow-auto relative">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
