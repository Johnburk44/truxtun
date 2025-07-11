import { CTA } from "@/components/landing/cta"
import { Features } from "@/components/landing/features"
import { Hero } from "@/components/landing/hero"

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />
      <Features />
      <CTA />
    </div>
  )
}
