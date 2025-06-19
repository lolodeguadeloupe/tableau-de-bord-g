
import { useState } from "react"
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

interface NightlifeTableProps {
  events: NightlifeEvent[]
  onEdit: (event: NightlifeEventTableData) => void
  onDelete: (id: string) => void
}

export function NightlifeTable({ events, onEdit, onDelete }: NightlifeTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const transformedData: NightlifeEventTableData[] = events.map((event) => ({
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

  const columns = [
    { key: "image_preview", label: "Image" },
    { key: "name", label: "Nom" },
    { key: "type", label: "Type" },
    { key: "venue", label: "Lieu" },
    { key: "date_time", label: "Date & Heure" },
    { key: "price_display", label: "Prix" },
    { key: "rating_display", label: "Note" }
  ]

  const handleEdit = (item: NightlifeEventTableData) => {
    onEdit(item)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <>
      <DataTable
        title="Événements Nightlife"
        columns={columns}
        data={transformedData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
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
              onClick={confirmDelete}
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
