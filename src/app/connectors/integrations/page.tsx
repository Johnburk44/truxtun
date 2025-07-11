'use client'

import { Separator } from '@/components/ui/separator'
import { ZapierConnection } from '@/components/settings/zapier-connection'

export default function IntegrationsPage() {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Integrations</h3>
          <p className="text-sm text-muted-foreground">
            Connect your favorite tools and services to enhance your workflow.
          </p>
        </div>
        <Separator />
        <div className="grid gap-6">
          <ZapierConnection />
        </div>
      </div>
    </>
  )
}
