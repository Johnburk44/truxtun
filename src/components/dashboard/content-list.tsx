"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconFile, IconFileText, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ContentItem {
  id: string
  name: string
  type: "document" | "transcript"
  size: string
  uploadedAt: string
}

interface ContentListProps {
  title: string
  items: ContentItem[]
  onDelete?: (id: string) => void
}

export function ContentList({ title, items, onDelete }: ContentListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 space-x-0 sm:space-x-4 rounded-lg border p-4"
              >
                <div className="flex items-center space-x-4">
                  {item.type === "document" ? (
                    <IconFile className="h-8 w-8 text-blue-500" />
                  ) : (
                    <IconFileText className="h-8 w-8 text-green-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {item.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.size} • {item.uploadedAt}
                    </p>
                  </div>
                </div>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                  >
                    <IconTrash className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
