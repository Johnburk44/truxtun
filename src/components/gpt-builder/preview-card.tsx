"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconBrain, IconFileText, IconMessageDots, IconRobot } from "@tabler/icons-react"

interface PreviewCardProps {
  name: string
  description: string
  instructions?: string
  imageUrl?: string
  capabilities?: string[]
  model?: string
}

export function PreviewCard({
  name,
  description,
  instructions,
  imageUrl,
  capabilities = [],
  model = "gpt-4",
}: PreviewCardProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 p-8">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            {imageUrl ? (
              <AvatarImage src={imageUrl} alt={name} />
            ) : (
              <AvatarFallback>
                <IconRobot className="h-8 w-8" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{name || "Untitled GPT"}</h2>
            <p className="text-sm text-muted-foreground">
              {description || "No description provided"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {instructions && (
            <div className="space-y-2">
              <h3 className="font-semibold">Instructions</h3>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm whitespace-pre-wrap">{instructions}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold">Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              {capabilities.includes("kb") && (
                <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center gap-2">
                  <IconBrain className="h-4 w-4" />
                  Knowledge Base
                </div>
              )}
              {capabilities.includes("transcripts") && (
                <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center gap-2">
                  <IconFileText className="h-4 w-4" />
                  Transcripts
                </div>
              )}
              {capabilities.includes("chat") && (
                <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center gap-2">
                  <IconMessageDots className="h-4 w-4" />
                  Chat History
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Model</h3>
            <div className="text-sm text-muted-foreground">
              {model === "gpt-4" ? "GPT-4" : "GPT-3.5 Turbo"}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Sample Conversation</h3>
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <p className="text-sm">How can you help me with sales?</p>
              </div>
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  {imageUrl ? (
                    <AvatarImage src={imageUrl} alt={name} />
                  ) : (
                    <AvatarFallback>
                      <IconRobot className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-sm space-y-2">
                  <p>
                    I can help you by analyzing sales transcripts, creating
                    follow-up emails, building MAPs (Mutual Action Plans), and
                    preparing QBRs (Quarterly Business Reviews). I&apos;ll use the
                    knowledge base to provide specific, actionable advice tailored
                    to your sales process.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
