
import { useState, useMemo } from "react"
import { MoreHorizontal, Edit, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { NightlifeEvent, NightlifeEventTableData } from "@/types/nightlife"
import type { ColumnDef } from "@tanstack/react-table"

interface NightlifeTableProps {
  events: NightlifeEvent[]
  onEdit: (event: NightlifeEventTableData) => void
  onDelete: (id: string) => void
}

export function NightlifeTable({ events, onEdit, onDelete }: NightlifeTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const transformedData: NightlifeEventTableData[] = useMemo(() => {
    return events.map((event) => ({
      ...event,
      id: event.id.toString(),
      price_display: `${event.price}€`,
      rating_display: (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{event.rating}</span>
        </div>
      ),
      image_preview: (
        <img
          src={event.image || event.gallery_images?.[0]}
          alt={event.name}
          className="w-12 h-12 object-cover rounded"
        />
      ),
      date_time: `${event.date} à ${event.time}`
    }))
  }, [events])

  const columns: ColumnDef<NightlifeEventTableData>[] = [
    {
      accessorKey: "image_preview",
      header: "Image",
      cell: ({ row }) => row.getValue("image_preview"),
    },
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "venue",
      header: "Lieu",
    },
    {
      accessorKey: "date_time",
      header: "Date & Heure",
    },
    {
      accessorKey: "price_display",
      header: "Prix",
    },
    {
      accessorKey: "rating_display",
      header: "Note",
      cell: ({ row }) => row.getValue("rating_display"),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteId(row.original.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={transformedData} />
      
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. L'événement sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId)
                  setDeleteId(null)
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
