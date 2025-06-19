
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/DataTable"
import type { Concert, ConcertTableData } from "@/types/concert"

interface ConcertTableProps {
  concerts: Concert[]
  onEdit: (concertData: ConcertTableData) => void
  onDelete: (id: string) => void
}

export function ConcertTable({ 
  concerts, 
  onEdit, 
  onDelete
}: ConcertTableProps) {
  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
      </div>
    )
  }

  const getGenreBadgeColor = (genre: string) => {
    const colors: Record<string, string> = {
      'Zouk': 'bg-blue-100 text-blue-800',
      'Reggae': 'bg-green-100 text-green-800',
      'Jazz': 'bg-purple-100 text-purple-800',
      'Blues': 'bg-indigo-100 text-indigo-800',
      'Gospel': 'bg-yellow-100 text-yellow-800',
      'Électro': 'bg-pink-100 text-pink-800',
    }
    return colors[genre] || 'bg-gray-100 text-gray-800'
  }

  const tableData: ConcertTableData[] = concerts.map(concert => ({
    ...concert,
    id: concert.id.toString(),
    price_display: `${concert.price}€`,
    rating_display: getRatingStars(concert.rating),
    date_time: `${concert.date} à ${concert.time}`,
    image_preview: concert.image ? (
      <img 
        src={concert.image} 
        alt={concert.name} 
        className="w-12 h-12 object-cover rounded" 
      />
    ) : (
      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
        <span className="text-xs text-gray-500">N/A</span>
      </div>
    )
  }))

  const columns = [
    { key: 'image_preview', label: 'Image' },
    { key: 'name', label: 'Concert' },
    { key: 'artist', label: 'Artiste' },
    { 
      key: 'genre', 
      label: 'Genre',
      render: (value: string) => (
        <Badge className={getGenreBadgeColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'location', label: 'Lieu' },
    { key: 'date_time', label: 'Date & Heure' },
    { key: 'price_display', label: 'Prix' },
    { key: 'rating_display', label: 'Note' }
  ]

  if (concerts.length === 0) {
    return (
      <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-lg font-medium text-yellow-800">Aucun concert trouvé</p>
        <p className="text-yellow-600 mt-2">
          La table 'concerts' semble être vide. Créez votre premier concert en cliquant sur "Nouveau concert".
        </p>
      </div>
    )
  }

  return (
    <DataTable
      title="Liste des concerts"
      data={tableData}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}
