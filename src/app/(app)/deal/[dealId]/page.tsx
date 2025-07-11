"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ChevronLeft,
  Clock,
  FileText,
  MoreVertical,
  Upload,
  Video,
  Zap,
  RefreshCw,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const MOCK_DEAL = {
  id: "deal-1",
  name: "Enterprise SaaS Solution",
  amount: 75000,
  stage: "Qualification",
  closeDate: "2025-08-15",
  owner: "Sarah Chen",
  age: 45,
  confidence: 75,
  nextAction: "Schedule technical review",
  customFields: {
    "Deal Source": "Outbound",
    "Product Line": "Enterprise",
    "Decision Maker": "John Smith",
  }
}

const MOCK_ACTIVITIES = [
  {
    id: 1,
    type: "call",
    title: "Discovery Call",
    timestamp: "2025-06-20T14:00:00",
    description: "Initial discussion about requirements",
    icon: Video
  },
  {
    id: 2,
    type: "ai_insight",
    title: "AI Analysis",
    timestamp: "2025-06-21T09:00:00",
    description: "High interest in security features detected",
    icon: Zap
  }
]

function DealHeader() {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-4">
        <Link href="/pipeline" className="flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          Back to Pipeline
        </Link>
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-xl font-semibold">{MOCK_DEAL.name}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-lg font-medium">${MOCK_DEAL.amount.toLocaleString()}</div>
        <Badge variant="secondary">{MOCK_DEAL.stage}</Badge>
        <Button variant="outline">Change Stage</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Deal</DropdownMenuItem>
            <DropdownMenuItem>Delete Deal</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Deal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Close Date</div>
              <div>{MOCK_DEAL.closeDate}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Owner</div>
              <div>{MOCK_DEAL.owner}</div>
            </div>
          </div>
          <Separator />
          {Object.entries(MOCK_DEAL.customFields).map(([key, value]) => (
            <div key={key}>
              <div className="text-sm text-muted-foreground">{key}</div>
              <div>{value}</div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>KPI Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Next Action</div>
                <div className="font-medium">{MOCK_DEAL.nextAction}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Deal Age</div>
                <div className="font-medium">{MOCK_DEAL.age} days</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Confidence</div>
                <div className="font-medium">{MOCK_DEAL.confidence}%</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ActivityTab() {
  return (
    <div className="p-4">
      <div className="space-y-4">
        {MOCK_ACTIVITIES.map((activity) => (
          <Card key={activity.id}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="rounded-full bg-muted p-2">
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{activity.description}</div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button variant="outline" className="w-full">Load More</Button>
      </div>
    </div>
  )
}

function TranscriptsTab() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Transcript
        </Button>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync from Gong/Zoom
        </Button>
        <Button variant="outline">Generate MAP</Button>
        <Button variant="outline">Create Deck</Button>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Discovery Call Transcript</div>
              <div className="text-sm text-muted-foreground">June 20, 2025</div>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            AI Summary: Customer expressed strong interest in security features and compliance capabilities...
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function IntegrationsTab() {
  const integrations = [
    { name: "Salesforce", connected: true, lastSync: "2025-06-22 14:30" },
    { name: "Gong", connected: true, lastSync: "2025-06-22 15:45" },
    { name: "HubSpot", connected: false },
  ]

  return (
    <div className="p-4 space-y-4">
      {integrations.map((integration) => (
        <Card key={integration.name}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">{integration.name}</div>
              {integration.connected ? (
                <div className="text-sm text-muted-foreground">
                  Last synced: {integration.lastSync}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Not connected</div>
              )}
            </div>
            <Button variant={integration.connected ? "outline" : "default"}>
              {integration.connected ? "Run Sync" : "Connect"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function DealPage({ params }: { params: { dealId: string } }) {
  return (
    <div className="flex h-full flex-col">
      <DealHeader />
      <Tabs defaultValue="overview" className="flex-1">
        <TabsList className="px-4 border-b">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="transcripts">Transcripts & AI</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1">
          <TabsContent value="overview" className="m-0">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="activity" className="m-0">
            <ActivityTab />
          </TabsContent>
          <TabsContent value="transcripts" className="m-0">
            <TranscriptsTab />
          </TabsContent>
          <TabsContent value="integrations" className="m-0">
            <IntegrationsTab />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
