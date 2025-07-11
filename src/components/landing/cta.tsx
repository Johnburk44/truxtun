"use client"

import { Button } from "@/components/ui/button"
import { IconArrowRight } from "@tabler/icons-react"
import Link from "next/link"

export function CTA() {
  return (
    <div className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to create your custom GPT?
          <br />
          Get started today.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          Join thousands of businesses using our platform to create and deploy custom GPTs.
          No coding required.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button size="lg" asChild>
            <Link href="/signup">
              Get started
              <IconArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#features">
              Learn more
            </Link>
          </Button>
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
        <div className="relative left-1/2 aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-secondary opacity-20 sm:w-[72.1875rem]" />
      </div>
    </div>
  )
}
