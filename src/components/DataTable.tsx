
import { useState } from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TableData {
  id: string
  [key: string]: any
}

interface DataTableProps {
  title: string
  data: TableData[]
  columns: { key: string; label: string }[]
  onEdit?: (item: TableData) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

export function DataTable({ 
  title, 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  showActions = true 
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredData = data.filter(item =>
    Object.values(item).some(value => {
      if (React.isValidElement(value)) return false
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    })
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <Card className="border border-border/40">
      <CardHeader className="border-b border-border/40 bg-muted/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="text-left p-4 font-medium text-muted-foreground">
                    {column.label}
                  </th>
                ))}
                {showActions && (onEdit || onDelete) && (
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id} className={`border-b border-border/20 hover:bg-muted/20 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                  {columns.map((column) => (
                    <td key={column.key} className="p-4 text-sm">
                      {item[column.key]}
                    </td>
                  ))}
                  {showActions && (onEdit || onDelete) && (
                    <td className="p-4">
                      <div className="flex gap-2">
                        {onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(item)}
                            className="h-8 px-3"
                          >
                            Modifier
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(item.id)}
                            className="h-8 px-3 text-red-600 hover:text-red-700"
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/20">
            <p className="text-sm text-muted-foreground">
              Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredData.length)} sur {filteredData.length} résultats
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-3">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
