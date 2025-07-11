"use client"

import * as React from "react"
import Image from "next/image"
import { DealSidebar } from "@/components/deal-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, ChevronDown, Filter, MoreVertical } from "lucide-react"

export type Deal = {
  id: string
  company: string
  type: string
  nextCall: string
  amount: number
  closeDate: string
  stage: string
  owner: {
    name: string
    avatar: string
  }
  warnings?: {
    message: string
    count?: number
  }[]
  activity: {
    date: string
    type: string
    intensity: number
  }[]
}

const mockDeals: Deal[] = [
  {
    id: "1",
    company: "Acme Ltd",
    type: "New Business",
    nextCall: "Tomorrow",
    amount: 7000,
    closeDate: "Jun 12, 2020",
    stage: "Qualification",
    owner: {
      name: "Darrell Black",
      avatar: "/avatars/darrell.jpg"
    },
    activity: Array.from({ length: 20 }, (_, i) => ({
      date: `2020-${(i % 12) + 1}-${(i % 28) + 1}`,
      type: ["call", "email", "meeting"][i % 3],
      intensity: Math.random() * 2 + 1
    }))
  },
  {
    id: "2",
    company: "CultureIQ",
    type: "Upsell",
    nextCall: "In 23 days",
    amount: 10000,
    closeDate: "Apr 5, 2020",
    stage: "Qualification",
    owner: {
      name: "Tanya Pena",
      avatar: "/avatars/tanya.jpg"
    },
    activity: Array.from({ length: 15 }, (_, i) => ({
      date: `2020-${(i % 12) + 1}-${(i % 28) + 1}`,
      type: ["call", "email", "meeting"][i % 3],
      intensity: Math.random() * 2 + 1
    }))
  },
  {
    id: "3",
    company: "Arcade River",
    type: "30 seat renewal spring 2020",
    nextCall: "-",
    amount: 15000,
    closeDate: "Jul 12, 2019",
    stage: "Negotiation",
    owner: {
      name: "Calvin Mccoy",
      avatar: "/avatars/calvin.jpg"
    },
    activity: Array.from({ length: 12 }, (_, i) => ({
      date: `2020-${(i % 12) + 1}-${(i % 28) + 1}`,
      type: ["call", "email", "meeting"][i % 3],
      intensity: Math.random() * 2 + 1
    }))
  },
  {
    id: "4",
    company: "134 Retail",
    type: "Upsell",
    nextCall: "In 8 days",
    amount: 9000,
    closeDate: "Mar 10, 2020",
    stage: "Negotiation",
    owner: {
      name: "Lee Richards",
      avatar: "/avatars/lee.jpg"
    },
    activity: Array.from({ length: 8 }, (_, i) => ({
      date: `2020-${(i % 12) + 1}-${(i % 28) + 1}`,
      type: ["call", "email", "meeting"][i % 3],
      intensity: Math.random() * 2 + 1
    }))
  },
  {
    id: "5",
    company: "Hirereach",
    type: "Upsell",
    nextCall: "-",
    amount: 9000,
    closeDate: "Dec 28, 2020",
    stage: "Discovery",
    owner: {
      name: "Lee Richards",
      avatar: "/avatars/lee.jpg"
    },
    warnings: [{ message: "No activity for 14 days", count: 2 }],
    activity: Array.from({ length: 10 }, (_, i) => ({
      date: `2020-${(i % 12) + 1}-${(i % 28) + 1}`,
      type: ["call", "email", "meeting"][i % 3],
      intensity: Math.random() * 2 + 1
    }))
  },
  {
    id: "6",
    company: "Cogentiva",
    type: "Upsell",
    nextCall: "In 31 days",
    amount: 10000,
    closeDate: "Nov 9, 2020",
    stage: "Qualification",
    owner: {
      name: "Francisco Henry",
      avatar: "/avatars/francisco.jpg"
    },
    activity: Array.from({ length: 7 }, (_, i) => ({
      date: `2020-${(i % 12) + 1}-${(i % 28) + 1}`,
      type: ["call", "email", "meeting"][i % 3],
      intensity: Math.random() * 2 + 1
    }))
  },
  {
    id: "7",
    company: "Legelli Software",
    type: "New Business",
    nextCall: "In 2 days",
    amount: 9000,
    closeDate: "Jan 1, 2020",
    stage: "Negotiation",
    owner: {
      name: "Bessie Pena",
      avatar: "/avatars/bessie.jpg"
    },
    activity: Array.from({ length: 6 }, (_, i) => ({
      date: `2020-${(i % 12) + 1}-${(i % 28) + 1}`,
      type: ["call", "email", "meeting"][i % 3],
      intensity: Math.random() * 2 + 1
    }))
  },
  {
    id: "8",
    company: "Ground Trip",
    type: "New Business",
    nextCall: "In 4 days",
    amount: 15000,
    closeDate: "Jun 17, 2020",
    stage: "Working Agreement",
    owner: {
      name: "Francisco Henry",
      avatar: "/avatars/francisco.jpg"
    },
    activity: Array.from({ length: 9 }, (_, i) => ({
      date: `2020-${(i % 12) + 1}-${(i % 28) + 1}`,
      type: ["call", "email", "meeting"][i % 3],
      intensity: Math.random() * 2 + 1
    }))
  },
  {
    id: "9",
    company: "Brown & Carlsberg",
    type: "New Business",
    nextCall: "-",
    amount: 10000,
    closeDate: "Feb 18, 2020",
    stage: "Negotiation",
    owner: {
      name: "Bessie Pena",
      avatar: "/avatars/bessie.jpg"
    },
    activity: Array.from({ length: 5 }, (_, i) => ({
      date: `2020-${(i % 12) + 1}-${(i % 28) + 1}`,
      type: ["call", "email", "meeting"][i % 3],
      intensity: Math.random() * 2 + 1
    }))
  },
  {
    id: "10",
    company: "Mazefront",
    type: "Upsell",
    nextCall: "-",
    amount: 0,
    closeDate: "Jun 31, 2020",
    stage: "Working Agreement",
    owner: {
      name: "Victoria Alexander",
      avatar: "/avatars/victoria.jpg"
    },
    warnings: [{ message: "Close date in the past", count: 2 }],
    activity: Array.from({ length: 4 }, (_, i) => ({
      date: `2020-${(i % 12) + 1}-${(i % 28) + 1}`,
      type: ["call", "email", "meeting"][i % 3],
      intensity: Math.random() * 2 + 1
    }))
  },
  {
    id: "11",
    company: "Sensors Technologies",
    type: "",
    nextCall: "-",
    amount: 0,
    closeDate: "Dec 28, 2020",
    stage: "Qualification",
    owner: {
      name: "Dianne Robertson",
      avatar: "/avatars/dianne.jpg"
    },
    activity: Array.from({ length: 3 }, (_, i) => ({
      date: `2020-${(i % 12) + 1}-${(i % 28) + 1}`,
      type: ["call", "email", "meeting"][i % 3],
      intensity: Math.random() * 2 + 1
    }))
  }
]

function ActivityTimeline({ activities }: { activities: Deal["activity"] }) {
  return (
    <div className="relative h-3 w-full flex items-center gap-0.5">
      {activities.map((activity, i) => {
        const colors = {
          call: "bg-blue-400/80",
          email: "bg-rose-400/80",
          meeting: "bg-purple-400/80"
        }
        return (
          <div 
            key={i}
            className={`h-2 w-2 rounded-full ${colors[activity.type as keyof typeof colors] || "bg-primary/60"}`}
            style={{
              opacity: activity.intensity / 3
            }}
          />
        )
      })}
    </div>
  )
}

function DealRow({ deal, onClick }: { deal: Deal; onClick: (deal: Deal) => void }) {
  return (
    <div 
      onClick={() => onClick(deal)}
      className="grid grid-cols-[minmax(200px,2fr)_160px_minmax(120px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(200px,2fr)] gap-4 items-center py-3 border-b hover:bg-accent/50 transition-colors cursor-pointer"
    >
      <div>
        <div className="font-medium">{deal.company}</div>
        <div className="text-sm text-muted-foreground">{deal.type}</div>
      </div>
      <div className="w-[160px] flex-shrink-0">
        <ActivityTimeline activities={deal.activity} />
      </div>
      <div className="text-sm">{deal.nextCall}</div>
      <div className="text-sm">${deal.amount.toLocaleString()}</div>
      <div className="text-sm">{deal.closeDate}</div>
      <div className="text-sm">{deal.stage}</div>
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={deal.owner.avatar} />
          <AvatarFallback>{deal.owner.name[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm">{deal.owner.name}</span>
        {deal.warnings && (
          <div className="ml-auto flex items-center gap-1 text-amber-500">
            <AlertTriangle className="h-4 w-4" />
            {deal.warnings[0].count && (
              <span className="text-xs">{deal.warnings[0].count}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DealsPage() {
  const [selectedDeal, setSelectedDeal] = React.useState<Deal | null>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    // Optional: clear selected deal after animation completes
    setTimeout(() => setSelectedDeal(null), 300);
  };
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-4 p-4 border-b flex-wrap w-full">
        <Select defaultValue="team1">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="team1">Mark Stone's team</SelectItem>
            <SelectItem value="team2">Sarah's team</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="closing">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="closing">Closing this month</SelectItem>
            <SelectItem value="next">Closing next month</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Open deals only
        </Button>

        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <div className="text-sm font-medium">203 Deals</div>
          <div className="text-sm text-muted-foreground">$2,160,000</div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 w-full" type="always">
        <div className="p-4 min-w-[1200px] max-w-none w-full">
          <div className="grid grid-cols-[minmax(200px,2fr)_160px_minmax(120px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(200px,2fr)] gap-4 text-xs font-medium text-muted-foreground border-b pb-2">
            <div>DEAL</div>
            <div>ACTIVITY</div>
            <div>NEXT CALL</div>
            <div>AMOUNT</div>
            <div>CLOSE DATE</div>
            <div>STAGE</div>
            <div>OWNER</div>
          </div>
          {mockDeals.map((deal) => (
            <DealRow key={deal.id} deal={deal} onClick={handleDealClick} />
          ))}
        </div>
      </ScrollArea>

      <DealSidebar 
        deal={selectedDeal}
        open={sidebarOpen}
        onClose={handleCloseSidebar}
      />
    </div>
  )
}
