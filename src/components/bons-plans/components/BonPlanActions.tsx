
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye, EyeOff } from "lucide-react"

interface BonPlanActionsProps {
  bonPlan: any
  loading: boolean
  onToggleActive: (id: number, currentStatus: boolean) => void
  onEdit: (bonPlan: any) => void
  onDelete: (id: number) => void
}

export function BonPlanActions({ 
  bonPlan, 
  loading, 
  onToggleActive, 
  onEdit, 
  onDelete 
}: BonPlanActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onToggleActive(bonPlan.id, bonPlan.is_active)}
        disabled={loading}
      >
        {bonPlan.is_active ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(bonPlan)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(bonPlan.id)}
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
