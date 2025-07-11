'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  IconUsers,
  IconClockHour4,
  IconChecklist,
  IconBuildingStore
} from '@tabler/icons-react'

export default function AnalyticsPage() {
  const stats = [
    {
      title: 'Total Meetings',
      value: '24',
      change: '+12%',
      icon: IconUsers,
      color: 'text-blue-500'
    },
    {
      title: 'Meeting Hours',
      value: '36.5',
      change: '+8%',
      icon: IconClockHour4,
      color: 'text-green-500'
    },
    {
      title: 'Action Items',
      value: '128',
      change: '+24%',
      icon: IconChecklist,
      color: 'text-orange-500'
    },
    {
      title: 'Deals Updated',
      value: '18',
      change: '+15%',
      icon: IconBuildingStore,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Meeting activity chart will go here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Agent performance metrics will go here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
