"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { IconCheck, IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface Step {
  name: string
  status: "completed" | "in_progress" | "pending"
  description: string
}

interface ProgressCardProps {
  title: string
  steps: Step[]
  progress: number
}

export function ProgressCard({ title, steps, progress }: ProgressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {progress}% Complete
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Progress value={progress} className="h-2" />
        <div className="grid gap-3">
          {steps.map((step) => (
            <div
              key={step.name}
              className={cn(
                "grid grid-cols-[25px_1fr] items-start pb-4 last:pb-0",
                step.status === "completed" && "text-primary"
              )}
            >
              <div className="flex h-2 w-2 translate-y-1 items-center justify-center">
                {step.status === "completed" && (
                  <IconCheck className="h-4 w-4" />
                )}
                {step.status === "in_progress" && (
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                )}
                {step.status === "pending" && (
                  <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                )}
              </div>
              <div className="grid gap-0.5">
                <div className="text-sm font-medium">{step.name}</div>
                <div className="text-xs text-muted-foreground">
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
