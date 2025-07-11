'use client'

import { useState, useEffect } from 'react'
import { TableConfig } from '@/components/pipeline/table-config'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import type { ColumnConfig } from '@/components/pipeline/table-config'

const defaultConfig: ColumnConfig[] = [
  {
    id: 'company',
    name: 'Company',
    type: 'text',
    required: true,
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    id: 'value',
    name: 'Deal Value',
    type: 'currency',
    required: true,
    sortable: true,
    filterable: true,
    width: 150
  },
  {
    id: 'stage',
    name: 'Stage',
    type: 'status',
    required: true,
    sortable: true,
    filterable: true,
    width: 150,
    options: ['Qualification', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
  },
  {
    id: 'owner',
    name: 'Owner',
    type: 'person',
    required: true,
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    id: 'nextStep',
    name: 'Next Step',
    type: 'text',
    required: false,
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    id: 'closeDate',
    name: 'Close Date',
    type: 'date',
    required: true,
    sortable: true,
    filterable: true,
    width: 150
  }
]

export default function PipelineSettings() {
  const [config, setConfig] = useState<ColumnConfig[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const savedConfig = localStorage.getItem('pipelineConfig')
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    } else {
      setConfig(defaultConfig)
    }
  }, [])

  const handleConfigChange = (newConfig: ColumnConfig[]) => {
    setConfig(newConfig)
    localStorage.setItem('pipelineConfig', JSON.stringify(newConfig))
    toast({
      title: 'Pipeline configuration saved',
      description: 'Your changes have been saved successfully.'
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pipeline Settings</h1>
        <p className="text-gray-500">
          Configure your pipeline columns and layout
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <TableConfig
          config={config}
          onChange={handleConfigChange}
        />
      </div>
    </div>
  )
}
