"use client"

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const products = [
  {
    title: "Knowledge Base",
    href: "/home",
    description: "Upload and manage your knowledge base for custom GPTs.",
  },
  {
    title: "Call Transcripts",
    href: "/transcript",
    description: "Process and analyze call transcripts for training data.",
  },
  {
    title: "GPT Configuration",
    href: "/gpt",
    description: "Configure and customize your GPT's behavior and responses.",
  },
]

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Truxtun.ai
        </Link>

        {/* Main Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            {/* Products Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Product</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  {products.map((product) => (
                    <ListItem
                      key={product.title}
                      title={product.title}
                      href={product.href}
                    >
                      {product.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Pricing */}
            <NavigationMenuItem>
              <Link href="/pricing" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Contact */}
            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/auth/signin">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
