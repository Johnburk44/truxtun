import { useState } from 'react'
import { DocumentPrompt } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconSearch, IconFilter } from '@tabler/icons-react'

interface PromptTemplateListProps {
  templates: DocumentPrompt[]
  onSelect: (template: DocumentPrompt) => void
}

export function PromptTemplateList({ templates, onSelect }: PromptTemplateListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<string | null>(null)

  // Get unique template types
  const templateTypes = Array.from(new Set(templates.map(t => t.template_name)))

  // Filter templates based on search and type
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchTerm === '' ||
      template.template_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.original_document_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = !filter || template.template_name === filter

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={filter || ''}
            onChange={(e) => setFilter(e.target.value || null)}
          >
            <option value="">All Types</option>
            {templateTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent cursor-pointer"
            onClick={() => onSelect(template)}
          >
            <div>
              <h3 className="font-medium">{template.template_name}</h3>
              <p className="text-sm text-muted-foreground">
                {template.original_document_name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Created: {new Date(template.created_at).toLocaleDateString()}
              </p>
            </div>
            <Button variant="ghost" size="sm">
              View
            </Button>
          </div>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No templates found
          </div>
        )}
      </div>
    </div>
  )
}
