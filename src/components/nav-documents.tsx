"use client"

import Link from "next/link"
import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavDocuments({
  items,
  onSelect,
}: {
  items: {
    name: string
    url: string
    icon: Icon
  }[]
  onSelect?: () => void
}) {
  const { isMobile, state, toggleSidebar } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className={state === "collapsed" ? "hidden" : "block"}>Connectors</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link
                href={item.url}
                className="flex items-center gap-2 text-black dark:text-white"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault()
                  onSelect?.()
                  toggleSidebar()
                  window.location.href = item.url
                }}
              >
                {item.icon && <item.icon className="dark:text-white" />}
                <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
              </Link>
            </SidebarMenuButton>


          </SidebarMenuItem>
        ))}

      </SidebarMenu>
    </SidebarGroup>
  )
}
