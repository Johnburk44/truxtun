"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
interface SidebarContextProps {
  isCollapsed: boolean
  isMobile: boolean
  collapse: () => void
  expand: () => void
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined)
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconRobot,
  IconVideo,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar, // ✅ use the hook
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Deals",
      url: "/deal",
      icon: IconChartBar,
    },
    {
      title: "Agents",
      url: "/agents",
      icon: IconRobot,
    },
    {
      title: "Meetings",
      url: "/meetings",
      icon: IconVideo,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartBar,
    },
    { title: "GPT Configuration", url: "/gpt/builder", icon: IconFileAi },
    { title: "Document Prompt Builder", url: "/gpt/templates", icon: IconFileDescription },
    { title: "Knowledge Base", url: "/home", icon: IconDatabase },
    { title: "Call Transcripts", url: "/transcript", icon: IconFileWord },
  ],
  navConnectors: [
    { title: "Integrations", url: "/connectors/integrations", icon: IconSettings },
  ],
  navSecondary: [
    { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "Get Help", url: "/help", icon: IconHelp },
  ],
  documents: [
    { name: "API Suite", url: "/CRM", icon: IconReport },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar} className="data-[slot=sidebar-menu-button]:!p-1.5">
              <IconInnerShadowTop className="!size-5 dark:text-white" />
              <div className={cn("relative h-6", state === "collapsed" ? "w-0 hidden" : "w-24 block")}>
                <Image src="/images/logo.png" alt="Truxtun" fill className="object-contain dark:invert" priority />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <div className="py-4">
          <h4 className="mb-1 px-2 text-xs font-semibold tracking-tight text-muted-foreground">CONNECTORS</h4>
          <NavMain items={data.navConnectors} />
        </div>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <div className={cn(state === "collapsed" ? "hidden" : "block")}>
          <ThemeToggle />
        </div>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
