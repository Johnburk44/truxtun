'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  IconBrandZoom, 
  IconBrandTeams,
  IconBrandGoogle,
  IconCalendarEvent,
  IconPlus,
  IconFileText,
  IconChecks
} from '@tabler/icons-react'

interface Meeting {
  id: string;
  title: string;
  platform: 'zoom' | 'teams' | 'meet';
  status: 'scheduled' | 'completed' | 'in-progress';
  startTime: Date;
  duration?: number;
  participants: string[];
  transcript?: string;
  actionItems?: string[];
}

export default function MeetingsPage() {
  const [meetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Sales Pipeline Review',
      platform: 'zoom',
      status: 'completed',
      startTime: new Date('2025-06-19T14:00:00'),
      duration: 45,
      participants: ['John Doe', 'Jane Smith'],
      actionItems: [
        'Update Hubspot deal stages',
        'Schedule follow-up with Client A',
        'Send proposal by Friday'
      ]
    }
  ]);

  const platforms = [
    {
      id: 'zoom',
      name: 'Zoom',
      icon: IconBrandZoom,
      color: 'text-blue-500'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      icon: IconBrandTeams,
      color: 'text-purple-500'
    },
    {
      id: 'meet',
      name: 'Google Meet',
      icon: IconBrandGoogle,
      color: 'text-green-500'
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {platforms.map((platform) => (
          <Card key={platform.id} className="hover:border-primary cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <platform.icon className={`h-5 w-5 ${platform.color}`} />
                {platform.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Connect Account
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Recent Meetings</h2>
        {meetings.map((meeting) => (
          <Card key={meeting.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconCalendarEvent className="h-5 w-5 text-primary" />
                  {meeting.title}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  meeting.status === 'completed' ? 'bg-green-100 text-green-700' :
                  meeting.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {meeting.status.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconCalendarEvent className="h-4 w-4" />
                  {meeting.startTime.toLocaleString()} · {meeting.duration} mins
                </div>
                
                <div className="flex gap-2">
                  {meeting.transcript && (
                    <Button variant="outline" size="sm">
                      <IconFileText className="mr-2 h-4 w-4" />
                      View Transcript
                    </Button>
                  )}
                  {meeting.actionItems && (
                    <Button variant="outline" size="sm">
                      <IconChecks className="mr-2 h-4 w-4" />
                      {meeting.actionItems.length} Action Items
                    </Button>
                  )}
                </div>

                {meeting.actionItems && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Action Items:</h3>
                    <ul className="space-y-2">
                      {meeting.actionItems.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                            {index + 1}
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
