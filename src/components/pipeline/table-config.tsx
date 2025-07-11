'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { GripVertical, Plus, Settings, Trash2 } from 'lucide-react'

export interface ColumnConfig {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'status' | 'person' | 'currency' | 'percentage'
  required: boolean
  sortable: boolean
  filterable: boolean
  width: number
  options?: string[] // For status type
}

interface TableConfigProps {
  config: ColumnConfig[]
  onChange: (config: ColumnConfig[]) => void
}

const defaultColumn: ColumnConfig = {
  id: '',
  name: '',
  type: 'text',
  required: false,
  sortable: true,
  filterable: true,
  width: 200
}

export function TableConfig({ config, onChange }: TableConfigProps) {
  const [columns, setColumns] = useState<ColumnConfig[]>(config)
  const [editingColumn, setEditingColumn] = useState<ColumnConfig | null>(null)

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(columns)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setColumns(items)
    onChange(items)
  }

  const addColumn = () => {
    const newColumn = {
      ...defaultColumn,
      id: Math.random().toString(36).substr(2, 9)
    }
    setEditingColumn(newColumn)
  }

  const saveColumn = (column: ColumnConfig) => {
    if (column.id === editingColumn?.id) {
      const newColumns = columns.map(c => 
        c.id === column.id ? column : c
      )
      setColumns(newColumns)
      onChange(newColumns)
    } else {
      const newColumns = [...columns, column]
      setColumns(newColumns)
      onChange(newColumns)
    }
    setEditingColumn(null)
  }

  const deleteColumn = (id: string) => {
    const newColumns = columns.filter(c => c.id !== id)
    setColumns(newColumns)
    onChange(newColumns)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Pipeline Columns</h2>
        <Button onClick={addColumn}>
          <Plus className="w-4 h-4 mr-2" />
          Add Column
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="columns">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {columns.map((column, index) => (
                <Draggable
                  key={column.id}
                  draggableId={column.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm"
                    >
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{column.name}</div>
                        <div className="text-sm text-gray-500">
                          {column.type} {column.required && '(Required)'}
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingColumn(column)}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <ColumnDialog
                          column={column}
                          onSave={saveColumn}
                          onClose={() => setEditingColumn(null)}
                        />
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteColumn(column.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={!!editingColumn && !editingColumn.name}>
        <ColumnDialog
          column={editingColumn || defaultColumn}
          onSave={saveColumn}
          onClose={() => setEditingColumn(null)}
        />
      </Dialog>
    </div>
  )
}

interface ColumnDialogProps {
  column: ColumnConfig
  onSave: (column: ColumnConfig) => void
  onClose: () => void
}

function ColumnDialog({ column, onSave, onClose }: ColumnDialogProps) {
  const [config, setConfig] = useState(column)

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {column.name ? 'Edit Column' : 'Add Column'}
        </DialogTitle>
        <DialogDescription>
          Configure the column properties
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Column Name</Label>
          <Input
            id="name"
            value={config.name}
            onChange={(e) =>
              setConfig({ ...config, name: e.target.value })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={config.type}
            onValueChange={(value: any) =>
              setConfig({ ...config, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="person">Person</SelectItem>
              <SelectItem value="currency">Currency</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            checked={config.required}
            onCheckedChange={(checked) =>
              setConfig({ ...config, required: checked })
            }
          />
          <Label htmlFor="required">Required</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="sortable"
            checked={config.sortable}
            onCheckedChange={(checked) =>
              setConfig({ ...config, sortable: checked })
            }
          />
          <Label htmlFor="sortable">Sortable</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="filterable"
            checked={config.filterable}
            onCheckedChange={(checked) =>
              setConfig({ ...config, filterable: checked })
            }
          />
          <Label htmlFor="filterable">Filterable</Label>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="width">Width (px)</Label>
          <Input
            id="width"
            type="number"
            value={config.width}
            onChange={(e) =>
              setConfig({ ...config, width: parseInt(e.target.value) })
            }
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onSave(config)}>Save</Button>
      </DialogFooter>
    </DialogContent>
  )
}
