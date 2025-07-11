"use client"

import * as React from "react"
import Link from "next/link"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  onSelect,
  ...props
}: {
  items: ({
    title: string
    url: string
    icon: Icon
  } | {
    title: string
    component: React.ComponentType
  })[]
  onSelect?: () => void
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {"url" in item ? (
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    {item.icon && <item.icon className="dark:text-white" />}
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              ) : "component" in item ? (
                item.component
              ) : null}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
