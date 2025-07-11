"use client"

import { Button } from "@/components/ui/button"
import { IconArrowRight } from "@tabler/icons-react"
import Link from "next/link"

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Create Custom GPTs in Minutes
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Upload your knowledge base, transcripts, and prompts. We&apos;ll handle the rest.
            Deploy custom GPTs directly to ChatGPT with one click.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 w-full">
            <Button asChild size="lg">
              <Link href="/signup">
                Get Started
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
      </div>

        {/* Gradient effect */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </div>
    </div>
  )
}
