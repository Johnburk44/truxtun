"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react"

interface Stat {
  name: string
  value: string | number
  change?: number
  description?: string
  icon?: React.ReactNode
}

interface StatsCardProps {
  stats: Stat[]
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.name}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.change !== undefined && (
              <p className="text-xs text-muted-foreground">
                <span className={stat.change >= 0 ? "text-green-500" : "text-red-500"}>
                  {stat.change >= 0 ? (
                    <IconArrowUpRight className="inline h-4 w-4" />
                  ) : (
                    <IconArrowDownRight className="inline h-4 w-4" />
                  )}
                  {Math.abs(stat.change)}%
                </span>{" "}
                vs last month
              </p>
            )}
            {stat.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
