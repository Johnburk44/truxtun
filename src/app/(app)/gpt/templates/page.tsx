"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconUpload, IconX, IconTemplate } from "@tabler/icons-react"
import { ErrorMessage } from "@/components/error-message"
import { processDocument } from "@/lib/document-processor"
import { saveDocumentPrompt, getDocumentPrompts, DocumentPrompt } from "@/lib/supabase-client"
import { PromptTemplateList } from "@/components/prompt-template-list"
import { toast } from "sonner"

interface DocumentTemplate {
  id: string
  name: string
  description: string
  promptTemplate: string
  useCase: string
  structure: {
    section: string
    description: string
  }[]
}

const documentTemplates = [
  {
    id: "map",
    name: "Mutual Action Plan",
    useCase: "sales",
    description: "A collaborative project plan that outlines the steps, timelines, and responsibilities for both the vendor and customer during the sales process.",
    promptTemplate: "Analyze the provided document and create a detailed Mutual Action Plan that includes: 1) Key milestones and dates, 2) Stakeholder responsibilities, 3) Success criteria, 4) Risk mitigation strategies.",
    structure: [
      { section: "Project Overview", description: "High-level summary of the project goals and timeline" },
      { section: "Key Stakeholders", description: "List of key stakeholders from both organizations and their roles" },
      { section: "Milestones", description: "Critical project milestones with target dates" },
      { section: "Success Criteria", description: "Measurable outcomes that define project success" },
      { section: "Risk Management", description: "Potential risks and mitigation strategies" }
    ]
  },
  {
    id: "meddpicc",
    name: "MEDDPICC Analysis",
    useCase: "sales",
    description: "A comprehensive sales qualification framework that helps assess deal quality and likelihood of closing.",
    promptTemplate: "Review the provided document and create a MEDDPICC analysis covering: Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Implications of Pain, Champion, Competition.",
    structure: [
      { section: "Metrics", description: "Quantifiable benefits and ROI" },
      { section: "Economic Buyer", description: "Key decision maker with budget authority" },
      { section: "Decision Criteria", description: "Formal and informal evaluation criteria" },
      { section: "Decision Process", description: "Steps to reach a final decision" },
      { section: "Paper Process", description: "Legal and procurement requirements" },
      { section: "Implications of Pain", description: "Business impact of the current situation" },
      { section: "Champion", description: "Internal advocate for your solution" },
      { section: "Competition", description: "Analysis of competitive landscape" }
    ]
  },
  {
    id: "pitch-deck",
    name: "Pitch Deck",
    useCase: "marketing",
    description: "A compelling presentation that communicates your value proposition and solution to potential customers or investors.",
    promptTemplate: "Analyze the provided document and create a structured pitch deck that includes: 1) Problem statement, 2) Solution overview, 3) Market opportunity, 4) Business model, 5) Competitive advantage, 6) Team, 7) Financial projections, 8) Ask.",
    structure: [
      { section: "Problem", description: "Clear articulation of the problem you're solving" },
      { section: "Solution", description: "Your product/service and how it solves the problem" },
      { section: "Market Size", description: "TAM, SAM, and SOM analysis" },
      { section: "Business Model", description: "How you make money" },
      { section: "Go-to-Market", description: "Strategy for reaching customers" },
      { section: "Competition", description: "Competitive analysis and advantages" },
      { section: "Traction", description: "Current progress and milestones" },
      { section: "Team", description: "Key team members and advisors" },
      { section: "Financials", description: "Key metrics and projections" }
    ]
  }
]

export default function DocumentPromptBuilder() {
  const [selectedTemplate, setSelectedTemplate] = React.useState<DocumentTemplate | null>(null)
  const [customPrompt, setCustomPrompt] = React.useState("")
  const [showPreview, setShowPreview] = React.useState(false)
  const [analyzedContent, setAnalyzedContent] = React.useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [error, setError] = React.useState<{ title: string; message: string } | null>(null)
  const [currentFile, setCurrentFile] = React.useState<File | null>(null)
  const [savedTemplates, setSavedTemplates] = React.useState<DocumentPrompt[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedUseCase, setSelectedUseCase] = React.useState<string>('all')

  // Filter templates based on use case
  const filteredTemplates = selectedUseCase === 'all'
    ? documentTemplates
    : documentTemplates.filter(template => template.useCase === selectedUseCase)

  const useCases = [
    { value: 'all', label: 'All Use Cases' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'legal', label: 'Legal' },
    { value: 'operations', label: 'Operations' },
    { value: 'research', label: 'Research' }
  ]

  const analyzeDocument = async (file: File) => {
    if (!selectedTemplate) {
      setError({
        title: 'Template Required',
        message: 'Please select a document template before uploading a file.'
      })
      return
    }

    setError(null)
    setCurrentFile(file)

    setIsAnalyzing(true)
    try {
      // Extract text from the document using appropriate processor
      const text = await processDocument(file)

      // 2. Generate analysis prompt based on template structure
      const analysisPrompt = ['Analyze the following document and extract information according to this structure:',
        '',
        selectedTemplate.structure.map(s => `${s.section}:\n${s.description}`).join('\n\n'),
        '',
        'Document content:',
        text
      ].join('\n')

      // 3. TODO: Call OpenAI API to analyze the document
      // const analysis = await openai.analyze(analysisPrompt)
      
      // Simulated OpenAI response for now
      await new Promise(resolve => setTimeout(resolve, 2000))
      const analysis = [
        `Analysis of ${file.name}`,
        '',
        ...selectedTemplate.structure.map(s => [
          `${s.section}:`,
          `[Extracted content for ${s.section.toLowerCase()} would be here]`,
          ''
        ]).flat(),
        'Generated Prompt:',
        selectedTemplate.promptTemplate.replace(/\{([^}]+)\}/g, (match, key) => `[${key} from analysis]`)
      ].join('\n')
      
      setAnalyzedContent(analysis)
    } catch (error) {
      console.error('Error analyzing document:', error)
      setError({
        title: 'Analysis Failed',
        message: error instanceof Error ? error.message : 'Failed to analyze document'
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Load saved templates on mount
  React.useEffect(() => {
    async function loadSavedTemplates() {
      try {
        setIsLoading(true)
        const templates = await getDocumentPrompts()
        setSavedTemplates(templates)
      } catch (error) {
        console.error('Error loading templates:', error)
        toast.error('Failed to load saved templates')
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedTemplates()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        await analyzeDocument(file)
        setShowPreview(true)
      } catch (error) {
        console.error('Error handling file:', error)
        setError({
          title: 'Upload Failed',
          message: error instanceof Error ? error.message : 'Failed to upload document'
        })
      }
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)] overflow-hidden">
      {/* Left side - Template Selection & Upload */}
      <div className="w-full lg:w-1/2 border-r overflow-y-auto flex-shrink-0">
        <div className="sticky top-0 bg-background z-10 border-b px-6 py-3">
          <Tabs defaultValue="templates">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="saved">Saved Prompts</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Select value={selectedUseCase} onValueChange={setSelectedUseCase}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select use case" />
                      </SelectTrigger>
                      <SelectContent>
                        {useCases.map(useCase => (
                          <SelectItem key={useCase.value} value={useCase.value}>
                            {useCase.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="max-w-sm"
                    />
                  </div>
                </div>
                <div className="grid gap-4">
                  {filteredTemplates.map(template => (
                    <Card
                      key={template.id}
                      className={`p-4 cursor-pointer transition-colors ${selectedTemplate?.id === template.id ? 'bg-muted' : ''}`}
                      onClick={() => {
                        setSelectedTemplate(template)
                        // Show preview on mobile when template is selected
                        setShowPreview(true)
                      }}
                    >
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="saved" className="mt-4">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Loading saved templates...</p>
                  </div>
                ) : (
                  <PromptTemplateList
                    templates={savedTemplates}
                    onSelect={(template) => {
                      setCustomPrompt(template.generated_prompt)
                      setAnalyzedContent(template.analysis)
                      setShowPreview(true)
                    }}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Preview & Customization */}
      <div className="w-full lg:w-1/2 border-l overflow-y-auto bg-muted/50 flex-shrink-0">
        {/* Mobile Close Button */}
        <button
          className="lg:hidden absolute top-2 right-2 p-2 rounded-md hover:bg-muted"
          onClick={() => setShowPreview(false)}
        >
          <IconX className="h-4 w-4" />
        </button>
        <div className="sticky top-0 bg-background z-10 border-b px-6 py-3">
          <h2 className="text-sm font-medium">Analysis & Generated Prompt</h2>
        </div>
        <div className="p-6">
          {selectedTemplate ? (
            <div className="space-y-4">
              <div className="space-y-6">
                <div>
                  <Label>Template</Label>
                  <div className="p-3 rounded-md border bg-muted">
                    <h3 className="font-medium">{selectedTemplate.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedTemplate.description}</p>
                  </div>
                </div>

                <div>
                  <Label>Document Structure</Label>
                  <div className="space-y-2 mt-2">
                    {selectedTemplate.structure.map((item, index) => (
                      <div key={index} className="p-3 rounded-md border bg-background">
                        <h4 className="font-medium text-sm">{item.section}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {analyzedContent && (
                  <div>
                    <Label>Generated Prompt</Label>
                    <textarea
                      className="w-full min-h-[200px] max-h-[50vh] p-3 rounded-md border bg-background resize-y"
                      value={analyzedContent}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                    />
                  </div>
                )}

                <Button 
                  className="w-full" 
                  disabled={!analyzedContent}
                  onClick={async () => {
                    if (selectedTemplate && analyzedContent) {
                      try {
                        const savedTemplate = await saveDocumentPrompt({
                          template_id: selectedTemplate.id,
                          template_name: selectedTemplate.name,
                          original_document_name: currentFile?.name || 'Unnamed Document',
                          original_document_type: currentFile?.type || 'text/plain',
                          analysis: analyzedContent,
                          generated_prompt: customPrompt || analyzedContent,
                        })
                        setSavedTemplates(prev => [savedTemplate, ...prev])
                        toast.success('Prompt template saved successfully')
                      } catch (error) {
                        console.error('Error saving prompt:', error)
                        toast.error('Failed to save prompt template')
                      }
                    }
                  }}
                >
                  Save Prompt Template
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Select a document template and upload a document to generate a prompt
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
