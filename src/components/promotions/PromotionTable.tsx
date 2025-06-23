
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { Eye, EyeOff, ExternalLink } from "lucide-react"
import type { Promotion } from "@/hooks/usePromotionActions"

interface PromotionTableProps {
  promotions: Promotion[]
  onEdit: (promotion: Promotion) => void
  onDelete: (id: number) => void
  onToggleVisibility: (promotion: Promotion) => void
}

export function PromotionTable({ promotions, onEdit, onDelete, onToggleVisibility }: PromotionTableProps) {
  const tableData = promotions.map(promotion => ({
    ...promotion,
    id: promotion.id.toString(),
    status: (
      <div className="flex items-center gap-2">
        <Badge 
          variant={promotion.is_active ? "default" : "secondary"}
          className={promotion.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
        >
          {promotion.is_active ? (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Visible
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3 mr-1" />
              Masquée
            </>
          )}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleVisibility(promotion)}
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          {promotion.is_active ? (
            <Eye className="h-4 w-4 text-green-600" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-600" />
          )}
        </Button>
      </div>
    ),
    badge_display: promotion.badge ? (
      <Badge variant="outline" className="text-xs">
        {promotion.badge}
      </Badge>
    ) : (
      <span className="text-gray-400">-</span>
    ),
    cta_link: (
      <div className="flex items-center gap-2">
        <span className="truncate max-w-32">{promotion.cta_text}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => window.open(promotion.cta_url, '_blank')}
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    ),
    image_preview: promotion.image ? (
      <img 
        src={promotion.image} 
        alt={promotion.title}
        className="h-12 w-12 object-cover rounded"
      />
    ) : (
      <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
        <span className="text-xs text-gray-400">Aucune</span>
      </div>
    )
  }))

  const columns = [
    { key: 'image_preview', label: 'Image' },
    { key: 'title', label: 'Titre' },
    { key: 'badge_display', label: 'Badge' },
    { key: 'cta_link', label: 'Action' },
    { key: 'sort_order', label: 'Ordre' },
    { key: 'status', label: 'Statut' }
  ]

  const handleEdit = (item: any) => {
    const originalPromotion = promotions.find(promo => promo.id.toString() === item.id)
    if (originalPromotion) {
      onEdit(originalPromotion)
    }
  }

  const handleDelete = (id: string) => {
    onDelete(parseInt(id))
  }

  if (promotions.length === 0) {
    return (
      <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-lg font-medium text-blue-800">Aucune promotion trouvée</p>
        <p className="text-blue-600 mt-2">
          La table 'promotions' semble être vide. Créez votre première promotion en cliquant sur "Nouvelle promotion".
        </p>
      </div>
    )
  }

  return (
    <DataTable
      title="Liste des promotions"
      data={tableData}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
