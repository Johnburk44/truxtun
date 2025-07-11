"use client"

import { MainNav } from "@/components/landing/nav"

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <MainNav />

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-muted-foreground">
              &copy; {new Date().getFullYear()} Truxtun.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
