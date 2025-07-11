"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { IconCheck } from "@tabler/icons-react"

interface PricingProps {
  className?: string
}

const tiers = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for trying out our platform",
    features: [
      "1 Custom GPT",
      "100MB Knowledge Base Storage",
      "100 API Calls/month",
      "Basic Analytics",
      "Community Support",
    ],
    cta: "Get Started",
    href: "/signup",
  },
  {
    name: "Basic",
    price: { monthly: 10, yearly: 8 },
    description: "Great for individuals and small teams",
    features: [
      "3 Custom GPTs",
      "1GB Knowledge Base Storage",
      "1,000 API Calls/month",
      "Advanced Analytics",
      "Email Support",
      "Custom Branding",
      "API Access",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    popular: true,
  },
  {
    name: "Business",
    price: { monthly: 16, yearly: 14 },
    description: "Perfect for growing businesses",
    features: [
      "10 Custom GPTs",
      "10GB Knowledge Base Storage",
      "10,000 API Calls/month",
      "Team Management",
      "Priority Support",
      "Custom Domain",
      "API Access",
      "Audit Logs",
      "SSO Integration",
    ],
    cta: "Start Free Trial",
    href: "/signup",
  },
  {
    name: "Enterprise",
    price: { monthly: null, yearly: 25 },
    description: "For large organizations with custom needs",
    features: [
      "Unlimited Custom GPTs",
      "Unlimited Storage",
      "Custom API Limits",
      "Dedicated Support",
      "Custom Integrations",
      "SLA Guarantee",
      "Advanced Security",
      "HIPAA Compliance",
      "On-premises Option",
      "Training & Onboarding",
    ],
    cta: "Contact Sales",
    href: "/contact",
    enterprise: true,
  },
]

export function PricingCards({ className }: PricingProps) {
  const [isYearly, setIsYearly] = React.useState(true)

  return (
    <section className="container py-8 space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center space-x-2">
          <label
            htmlFor="billing-toggle"
            className={!isYearly ? "text-primary" : "text-muted-foreground"}
          >
            Monthly
          </label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-primary"
          />
          <label
            htmlFor="billing-toggle"
            className={isYearly ? "text-primary" : "text-muted-foreground"}
          >
            Yearly <span className="text-sm text-primary">(Save ~20%)</span>
          </label>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => {
          const price = isYearly ? tier.price.yearly : tier.price.monthly
          // Skip monthly option for enterprise
          if (!isYearly && tier.enterprise) return null

          return (
            <div
              key={tier.name}
              className={`relative flex flex-col p-6 bg-background rounded-lg border ${
                tier.popular
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-border"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-32 rounded-full bg-primary px-3 py-1 text-center text-sm text-primary-foreground">
                  Most Popular
                </div>
              )}
              <div className="mb-4 space-y-2">
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold">
                  {price === 0
                    ? "Free"
                    : price === null
                    ? "Custom"
                    : `$${price}`}
                </span>
                {price !== 0 && price !== null && (
                  <span className="text-muted-foreground">
                    {isYearly ? "/user/year" : "/user/month"}
                  </span>
                )}
              </div>
              <ul className="mb-6 space-y-2 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <IconCheck className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-auto"
                variant={tier.popular ? "default" : "outline"}
                asChild
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
