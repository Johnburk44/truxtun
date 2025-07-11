// src/app/CRM/page.tsx

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CRMPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">CRM Integration</h1>
      <p className="text-muted-foreground">
        Set up your CRM API connection here. You can configure tokens or credentials manually.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="crm-name">CRM Provider</Label>
          <Input id="crm-name" placeholder="e.g. HubSpot, Salesforce" />
        </div>

        <div>
          <Label htmlFor="api-key">API Key</Label>
          <Input id="api-key" placeholder="Paste your CRM API key here" />
        </div>

        <Button>Connect</Button>
      </div>
    </div>
  );
}
