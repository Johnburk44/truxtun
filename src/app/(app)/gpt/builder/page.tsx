"use client"

import * as React from "react"
import { ConfigForm } from "@/components/gpt-builder/config-form"
import { PreviewCard } from "@/components/gpt-builder/preview-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GPTBuilderPage() {
  const [config, setConfig] = React.useState({
    name: "",
    description: "",
    instructions: "",
  })

  return (
    <div className="flex h-[calc(100vh-65px)]">
      {/* Left side - Configuration */}
      <div className="w-full lg:w-1/2 border-r overflow-y-auto">
        <div className="sticky top-0 bg-background z-10 border-b px-6 py-3">
          <Tabs defaultValue="create">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="configure">Configure</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ConfigForm onChange={setConfig} />
      </div>

      {/* Right side - Preview */}
      <div className="hidden lg:block w-1/2 border-l overflow-y-auto bg-muted/50">
        <div className="sticky top-0 bg-background z-10 border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Preview</h2>
            <select className="text-sm bg-transparent border-0">
              <option>Model 4</option>
            </select>
          </div>
        </div>
        <PreviewCard {...config} />
      </div>
    </div>
  )
}
