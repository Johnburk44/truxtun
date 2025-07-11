"use client"

import { ProgressCard } from "@/components/dashboard/progress-card"
import { ContentList } from "@/components/dashboard/content-list"
import { StatsCard } from "@/components/dashboard/stats-card"
import { IconBrain, IconFileUpload, IconMessage, IconRobot } from "@tabler/icons-react"

export default function DashboardPage() {
  const gptCreationSteps = [
    {
      name: "Upload Knowledge Base",
      status: "completed" as const,
      description: "Upload your documents and transcripts",
    },
    {
      name: "Configure GPT Settings",
      status: "in_progress" as const,
      description: "Set behavior, tone, and capabilities",
    },
    {
      name: "Train Model",
      status: "pending" as const,
      description: "Process and embed your content",
    },
    {
      name: "Test & Deploy",
      status: "pending" as const,
      description: "Verify and publish your GPT",
    },
  ]

  const stats = [
    {
      name: "Total Documents",
      value: 24,
      change: 12,
      icon: <IconFileUpload className="h-4 w-4 text-muted-foreground" />,
    },
    {
      name: "Knowledge Base Size",
      value: "2.4 GB",
      change: 8,
      icon: <IconBrain className="h-4 w-4 text-muted-foreground" />,
    },
    {
      name: "API Calls",
      value: "1,234",
      change: -3,
      icon: <IconMessage className="h-4 w-4 text-muted-foreground" />,
    },
    {
      name: "Active GPTs",
      value: 3,
      change: 50,
      icon: <IconRobot className="h-4 w-4 text-muted-foreground" />,
    },
  ]

  const recentDocuments = [
    {
      id: "1",
      name: "Company Overview.pdf",
      type: "document" as const,
      size: "2.4 MB",
      uploadedAt: "2 hours ago",
    },
    {
      id: "2",
      name: "Q2 Sales Call.mp3",
      type: "transcript" as const,
      size: "12.8 MB",
      uploadedAt: "4 hours ago",
    },
    {
      id: "3",
      name: "Product Manual.docx",
      type: "document" as const,
      size: "1.2 MB",
      uploadedAt: "Yesterday",
    },
    {
      id: "4",
      name: "Customer Interview.mp3",
      type: "transcript" as const,
      size: "8.6 MB",
      uploadedAt: "2 days ago",
    },
  ]

  const activeGpts = [
    {
      id: "1",
      name: "Sales Assistant GPT",
      type: "document" as const,
      size: "12 prompts",
      uploadedAt: "Active",
    },
    {
      id: "2",
      name: "Support Bot GPT",
      type: "document" as const,
      size: "8 prompts",
      uploadedAt: "Training",
    },
    {
      id: "3",
      name: "Product Expert GPT",
      type: "document" as const,
      size: "15 prompts",
      uploadedAt: "Active",
    },
  ]

  return (
    <div className="p-4 md:p-8 space-y-8 mx-auto max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <StatsCard stats={stats} />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <ProgressCard
          title="GPT Creation Progress"
          steps={gptCreationSteps}
          progress={35}
        />
        <ContentList
          title="Active GPTs"
          items={activeGpts}
        />
      </div>

      <ContentList
        title="Recent Uploads"
        items={recentDocuments}
        onDelete={(id) => console.log("Delete", id)}
      />
    </div>
  )
}
