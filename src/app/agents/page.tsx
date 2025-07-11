'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconRobot, IconPlus, IconBrandZoom, IconDatabase, IconCalendar } from '@tabler/icons-react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

interface Agent {
  id: string;
  name: string;
  type: 'meeting' | 'crm' | 'scheduler';
  status: 'active' | 'inactive' | 'error';
  lastRun?: Date;
  stats?: {
    meetings?: number;
    updates?: number;
    tasks?: number;
  };
}

export default function AgentsPage() {
  const [agents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Sales Meeting Assistant',
      type: 'meeting',
      status: 'active',
      lastRun: new Date(),
      stats: {
        meetings: 12,
        updates: 36,
        tasks: 24
      }
    }
  ]);

  const agentTypes = [
    {
      id: 'meeting',
      name: 'Meeting Agent',
      description: 'Joins calls, transcribes, and captures action items',
      Icon: IconBrandZoom,
      color: 'text-blue-500'
    },
    {
      id: 'crm',
      name: 'CRM Agent',
      description: 'Updates Hubspot with meeting insights and tasks',
      Icon: IconDatabase,
      color: 'text-orange-500'
    },
    {
      id: 'scheduler',
      name: 'Scheduler Agent',
      description: 'Manages follow-ups and meeting scheduling',
      Icon: IconCalendar,
      color: 'text-green-500'
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-background p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Sales Agents</h1>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Deploy New Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {agentTypes.map((type) => (
          <Card key={type.id} className="hover:border-primary cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <type.Icon className={`h-5 w-5 ${type.color}`} />
                {type.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Active Agents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconRobot className="h-5 w-5 text-primary" />
                  {agent.name}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  agent.status === 'active' ? 'bg-green-100 text-green-700' :
                  agent.status === 'error' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="text-center">
                  <div className="text-2xl font-semibold">{agent.stats?.meetings || 0}</div>
                  <div className="text-xs text-muted-foreground">Meetings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold">{agent.stats?.updates || 0}</div>
                  <div className="text-xs text-muted-foreground">Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold">{agent.stats?.tasks || 0}</div>
                  <div className="text-xs text-muted-foreground">Tasks</div>
                </div>
              </div>
              {agent.lastRun && (
                <div className="mt-4 text-xs text-muted-foreground">
                  Last active: {agent.lastRun.toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
