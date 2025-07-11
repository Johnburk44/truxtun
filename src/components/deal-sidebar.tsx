"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
type Deal = {
  id: string
  company: string
  type: string
  amount: number
  closeDate: string
  stage: string
  owner: {
    name: string
    avatar: string
  }
  nextCall: string
  activity: Array<{
    type: string
    date: string
    intensity: number
  }>
  warnings?: Array<{
    message: string
  }>
}

interface DealSidebarProps {
  deal: Deal | null
  onClose: () => void
  open: boolean
}

export function DealSidebar({ deal, onClose, open }: DealSidebarProps) {
  if (!deal) return null

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
          "transition-opacity duration-300"
        )}
        onClick={onClose}
      />
      <div 
        className={cn(
          "fixed right-0 top-0 h-full w-[400px] bg-background border-l z-50",
          "transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">{deal.company}</h2>
            <p className="text-sm text-muted-foreground">{deal.type}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-65px)]">
          <div className="p-4 space-y-6">
            <div>
              <h3 className="font-medium mb-2">Deal Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">${deal.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Close Date</span>
                  <span className="font-medium">{deal.closeDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stage</span>
                  <span className="font-medium">{deal.stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Call</span>
                  <span className="font-medium">{deal.nextCall}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Owner</h3>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-cover bg-center" 
                  style={{ backgroundImage: `url(${deal.owner.avatar})` }} 
                />
                <span>{deal.owner.name}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Recent Activity</h3>
              <div className="space-y-3">
                {deal.activity.slice(-5).reverse().map((activity: { type: string; date: string }, i: number) => (
                  <div key={i} className="text-sm">
                    <div className="font-medium">{activity.type}</div>
                    <div className="text-muted-foreground">{activity.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {deal.warnings && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2 text-amber-500">Warnings</h3>
                  <div className="space-y-2">
                    {deal.warnings.map((warning: { message: string }, i: number) => (
                      <div key={i} className="text-sm text-amber-500">
                        {warning.message}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
