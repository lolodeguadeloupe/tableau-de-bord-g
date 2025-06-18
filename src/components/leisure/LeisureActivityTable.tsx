
import { Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/DataTable"
import type { Loisir, LoisirTableData } from "@/types/leisure"

interface LeisureActivityTableProps {
  loisirs: Loisir[]
  onEdit: (loisirData: LoisirTableData) => void
  onDelete: (id: string) => void
  onImageClick: (loisirId: number) => void
}

export function LeisureActivityTable({ 
  loisirs, 
  onEdit, 
  onDelete, 
  onImageClick 
}: LeisureActivityTableProps) {
  const getAvailabilityColor = (current: number, max: number) => {
    const ratio = current / max
    if (ratio >= 1) return "bg-red-100 text-red-800"
    if (ratio >= 0.8) return "bg-orange-100 text-orange-800"
    return "bg-green-100 text-green-800"
  }

  const getAvailabilityText = (current: number, max: number) => {
    const available = max - current
    if (available <= 0) return "Complet"
    return `${available} places`
  }

  const tableData: LoisirTableData[] = loisirs.map(loisir => ({
    ...loisir,
    id: loisir.id.toString(),
    availability: (
      <Badge className={getAvailabilityColor(loisir.current_participants, loisir.max_participants)}>
        {getAvailabilityText(loisir.current_participants, loisir.max_participants)}
      </Badge>
    ),
    participants: `${loisir.current_participants}/${loisir.max_participants}`,
    dates: `${loisir.start_date} - ${loisir.end_date}`,
    image_preview: loisir.image ? (
      <button 
        onClick={() => onImageClick(loisir.id)}
        className="hover:opacity-80 transition-opacity"
        title="Voir les détails"
      >
        <img src={loisir.image} alt={loisir.title} className="w-12 h-12 object-cover rounded cursor-pointer" />
      </button>
    ) : (
      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
        <Eye className="h-4 w-4 text-gray-400" />
      </div>
    )
  }))

  const columns = [
    { key: 'image_preview', label: 'Image' },
    { key: 'title', label: 'Titre' },
    { key: 'location', label: 'Lieu' },
    { key: 'dates', label: 'Période' },
    { key: 'participants', label: 'Participants' },
    { key: 'availability', label: 'Disponibilité' }
  ]

  if (loisirs.length === 0) {
    return (
      <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-lg font-medium text-yellow-800">Aucun loisir trouvé</p>
        <p className="text-yellow-600 mt-2">
          La table 'loisirs' semble être vide. Créez votre premier loisir en cliquant sur "Nouveau loisir".
        </p>
      </div>
    )
  }

  return (
    <DataTable
      title="Liste des loisirs"
      data={tableData}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}
