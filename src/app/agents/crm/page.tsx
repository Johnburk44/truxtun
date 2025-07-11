'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  IconDatabase,
  IconSettings,
  IconRefresh,
  IconCheck,
  IconX
} from '@tabler/icons-react'

interface HubspotConfig {
  apiKey: string;
  portalId: string;
  automations: {
    createNotes: boolean;
    updateDeals: boolean;
    createTasks: boolean;
    updateContacts: boolean;
  };
}

export default function CRMAgentPage() {
  const [config, setConfig] = useState<HubspotConfig>({
    apiKey: '',
    portalId: '',
    automations: {
      createNotes: true,
      updateDeals: true,
      createTasks: true,
      updateContacts: true
    }
  });

  const [connectionStatus, setConnectionStatus] = useState<'unchecked' | 'checking' | 'success' | 'error'>('unchecked');

  const testConnection = async () => {
    setConnectionStatus('checking');
    try {
      const response = await fetch('/api/hubspot/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: config.apiKey,
          portalId: config.portalId
        }),
      });

      if (response.ok) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
    }
  };

  const deployAgent = async () => {
    try {
      const response = await fetch('/api/agents/crm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        // Redirect to agents dashboard or show success message
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <IconDatabase className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Configure CRM Agent</h1>
      </div>

      <Tabs defaultValue="connection" className="space-y-6">
        <TabsList>
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="connection">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconSettings className="h-5 w-5" />
                Hubspot Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="Enter your Hubspot API Key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portalId">Portal ID</Label>
                <Input
                  id="portalId"
                  value={config.portalId}
                  onChange={(e) => setConfig({ ...config, portalId: e.target.value })}
                  placeholder="Enter your Hubspot Portal ID"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="secondary" 
                  onClick={testConnection}
                  disabled={connectionStatus === 'checking'}
                >
                  <IconRefresh className={`mr-2 h-4 w-4 ${
                    connectionStatus === 'checking' ? 'animate-spin' : ''
                  }`} />
                  Test Connection
                </Button>
                {connectionStatus === 'success' && (
                  <span className="text-green-600 flex items-center gap-1">
                    <IconCheck className="h-4 w-4" />
                    Connected
                  </span>
                )}
                {connectionStatus === 'error' && (
                  <span className="text-red-600 flex items-center gap-1">
                    <IconX className="h-4 w-4" />
                    Connection failed
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Create Meeting Notes</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically create notes for each transcribed meeting
                  </div>
                </div>
                <Switch
                  checked={config.automations.createNotes}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      automations: { ...config.automations, createNotes: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Update Deal Stages</Label>
                  <div className="text-sm text-muted-foreground">
                    Update deal stages based on meeting insights
                  </div>
                </div>
                <Switch
                  checked={config.automations.updateDeals}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      automations: { ...config.automations, updateDeals: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Create Follow-up Tasks</Label>
                  <div className="text-sm text-muted-foreground">
                    Create tasks for action items identified in meetings
                  </div>
                </div>
                <Switch
                  checked={config.automations.createTasks}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      automations: { ...config.automations, createTasks: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Update Contact Information</Label>
                  <div className="text-sm text-muted-foreground">
                    Update contact details when new information is discovered
                  </div>
                </div>
                <Switch
                  checked={config.automations.updateContacts}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      automations: { ...config.automations, updateContacts: checked }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced settings will be available soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button
          onClick={deployAgent}
          disabled={!config.apiKey || !config.portalId || connectionStatus !== 'success'}
        >
          Deploy Agent
        </Button>
      </div>
    </div>
  );
}
