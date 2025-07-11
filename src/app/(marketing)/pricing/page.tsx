import { PricingCards } from "@/components/pricing/pricing-cards"

export const metadata = {
  title: "Pricing - Truxtun.ai",
  description: "Simple, transparent pricing for businesses of all sizes.",
}

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
      {/* Header */}
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Choose the plan that&apos;s right for you. All plans include a 14-day free trial.
        </p>
      </div>

      {/* Pricing Cards */}
      <PricingCards />

      {/* FAQ */}
      <div className="mx-auto max-w-4xl mt-16 text-center">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <dl className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <dt className="text-lg font-semibold">Do you offer custom plans?</dt>
            <dd className="mt-2 text-muted-foreground">
              Yes! Contact our sales team for custom enterprise solutions tailored to your needs.
            </dd>
          </div>
          <div>
            <dt className="text-lg font-semibold">What payment methods do you accept?</dt>
            <dd className="mt-2 text-muted-foreground">
              We accept all major credit cards and can arrange invoicing for enterprise customers.
            </dd>
          </div>
          <div>
            <dt className="text-lg font-semibold">Can I change plans later?</dt>
            <dd className="mt-2 text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </dd>
          </div>
          <div>
            <dt className="text-lg font-semibold">What happens after my trial?</dt>
            <dd className="mt-2 text-muted-foreground">
              After your 14-day trial, you&apos;ll be charged for your selected plan. Cancel anytime.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
