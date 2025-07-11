'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { PreviewCard } from '@/components/gpt-builder/preview-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { IconBrain, IconFileText, IconMessageDots, IconUpload } from '@tabler/icons-react';

export default function GPTConfigPage() {
  const [values, setValues] = useState({
    name: '',
    description: '',
    instructions: '',
    capabilities: ['kb', 'transcripts'] as string[],
    model: 'gpt-4',
    starters: [] as string[],
  });
  const [newStarter, setNewStarter] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Submitted values:', values);
    setSubmitted(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function handleStarterKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && newStarter.trim() !== '') {
      e.preventDefault();
      const newStarters = [...values.starters, newStarter.trim()];
      setValues({ ...values, starters: newStarters });
      setNewStarter('');
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">GPT Configuration</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Tabs defaultValue="basic" className="h-full">
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Name your GPT"
                  value={values.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Add a short description about what this GPT does"
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
                  placeholder="What does this GPT do? How does it behave? What should it avoid doing?"
                  value={values.instructions}
                  onChange={handleChange}
                  rows={6}
                />
              </div>

              <Card>
                <CardContent className="pt-6">
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
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="knowledge" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
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
                <CardContent className="pt-6">
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
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="starter">Conversation Starters</Label>
                <Input
                  id="starter"
                  value={newStarter}
                  placeholder="Type a starter and press Enter"
                  onChange={(e) => setNewStarter(e.target.value)}
                  onKeyDown={handleStarterKey}
                />
                <ul className="text-sm text-muted-foreground list-disc ml-5 mt-2">
                  {values.starters.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" onClick={handleSubmit} className="w-full">
            Save Configuration
          </Button>

          {submitted && (
            <p className="text-green-600 text-sm text-center">✅ GPT configuration saved.</p>
          )}
        </div>

        <div className="h-[calc(100vh-10rem)] sticky top-20">
          <PreviewCard
            name={values.name}
            description={values.description}
            instructions={values.instructions}
            capabilities={values.capabilities}
            model={values.model}
          />
        </div>
      </div>
    </div>
  );
}
