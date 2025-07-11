'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import type { ColumnConfig } from './table-config'

interface SortConfig {
  column: string
  direction: 'asc' | 'desc'
}

interface FilterConfig {
  column: string
  value: string
}

interface DynamicTableProps {
  columns: ColumnConfig[]
  data: any[]
  onDataChange?: (data: any[]) => void
}

export function DynamicTable({ columns, data, onDataChange }: DynamicTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const [displayData, setDisplayData] = useState(data)

  useEffect(() => {
    let newData = [...data]

    // Apply filters
    filters.forEach(filter => {
      newData = newData.filter(item => {
        const value = item[filter.column]
        return value?.toString().toLowerCase().includes(filter.value.toLowerCase())
      })
    })

    // Apply sort
    if (sortConfig) {
      newData.sort((a, b) => {
        const aVal = a[sortConfig.column]
        const bVal = b[sortConfig.column]

        if (aVal === bVal) return 0
        
        const comparison = aVal < bVal ? -1 : 1
        return sortConfig.direction === 'asc' ? comparison : -comparison
      })
    }

    setDisplayData(newData)
  }, [data, filters, sortConfig])

  const handleSort = (columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    if (!column?.sortable) return

    setSortConfig(current => {
      if (current?.column === columnId) {
        if (current.direction === 'asc') {
          return { column: columnId, direction: 'desc' }
        }
        return null
      }
      return { column: columnId, direction: 'asc' }
    })
  }

  const handleFilter = (columnId: string, value: string) => {
    setFilters(current => {
      const existing = current.findIndex(f => f.column === columnId)
      if (existing >= 0) {
        if (!value) {
          return current.filter(f => f.column !== columnId)
        }
        const newFilters = [...current]
        newFilters[existing] = { column: columnId, value }
        return newFilters
      }
      if (!value) return current
      return [...current, { column: columnId, value }]
    })
  }

  const renderCell = (column: ColumnConfig, value: any) => {
    switch (column.type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value)

      case 'percentage':
        return `${value}%`

      case 'date':
        return new Date(value).toLocaleDateString()

      case 'person':
        return (
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <img src={value.avatar} alt={value.name} />
            </Avatar>
            <span>{value.name}</span>
          </div>
        )

      case 'status':
        return (
          <Badge variant={value.toLowerCase() as any}>
            {value}
          </Badge>
        )

      default:
        return value
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {columns
            .filter(col => col.filterable)
            .map(column => (
              <div key={column.id} className="relative">
                <Input
                  placeholder={`Filter ${column.name}...`}
                  onChange={e => handleFilter(column.id, e.target.value)}
                  className="w-40"
                />
                <Filter className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            ))}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead
                  key={column.id}
                  style={{ width: column.width }}
                  className={column.sortable ? 'cursor-pointer select-none' : ''}
                  onClick={() => handleSort(column.id)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.name}</span>
                    {sortConfig?.column === column.id && (
                      <span>
                        {sortConfig.direction === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((row, i) => (
              <TableRow key={i}>
                {columns.map(column => (
                  <TableCell key={column.id}>
                    {renderCell(column, row[column.id])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
