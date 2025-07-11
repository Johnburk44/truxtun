"use client"

import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { IconBrain, IconFileText, IconMessageDots, IconUpload } from "@tabler/icons-react"

interface ConfigFormProps {
  onChange: (values: {
    name: string
    description: string
    instructions: string
    capabilities: string[]
    model: string
  }) => void
}

export function ConfigForm({ onChange }: ConfigFormProps) {
  const [values, setValues] = React.useState({
    name: "",
    description: "",
    instructions: "",
    capabilities: ["kb", "transcripts"],
    model: "gpt-4",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const newValues = {
      ...values,
      [e.target.name]: e.target.value,
    }
    setValues(newValues)
    onChange(newValues)
  }

  return (
    <Tabs defaultValue="basic" className="h-full">
      <TabsContent value="basic" className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Sales Assistant GPT"
            value={values.name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe what your GPT does..."
            value={values.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea
            id="instructions"
            name="instructions"
            placeholder="Give your GPT detailed instructions..."
            value={values.instructions}
            onChange={handleChange}
            rows={6}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IconBrain className="h-4 w-4" />
                  <Label htmlFor="kb">Knowledge Base</Label>
                </div>
                <Switch
                  id="kb"
                  checked={values.capabilities.includes("kb")}
                  onCheckedChange={(checked) => {
                    const newCapabilities = checked
                      ? [...values.capabilities, "kb"]
                      : values.capabilities.filter((c) => c !== "kb")
                    setValues({ ...values, capabilities: newCapabilities })
                    onChange({ ...values, capabilities: newCapabilities })
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IconFileText className="h-4 w-4" />
                  <Label htmlFor="transcripts">Transcripts</Label>
                </div>
                <Switch
                  id="transcripts"
                  checked={values.capabilities.includes("transcripts")}
                  onCheckedChange={(checked) => {
                    const newCapabilities = checked
                      ? [...values.capabilities, "transcripts"]
                      : values.capabilities.filter((c) => c !== "transcripts")
                    setValues({ ...values, capabilities: newCapabilities })
                    onChange({ ...values, capabilities: newCapabilities })
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IconMessageDots className="h-4 w-4" />
                  <Label htmlFor="chat">Chat History</Label>
                </div>
                <Switch
                  id="chat"
                  checked={values.capabilities.includes("chat")}
                  onCheckedChange={(checked) => {
                    const newCapabilities = checked
                      ? [...values.capabilities, "chat"]
                      : values.capabilities.filter((c) => c !== "chat")
                    setValues({ ...values, capabilities: newCapabilities })
                    onChange({ ...values, capabilities: newCapabilities })
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="knowledge" className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button variant="outline" className="w-full">
                <IconUpload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Upload PDFs, docs, or text files to train your GPT
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Base Model</Label>
                <select
                  id="model"
                  name="model"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={values.model}
                  onChange={handleChange}
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
