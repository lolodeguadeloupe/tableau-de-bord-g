
import { Badge } from "@/components/ui/badge"

interface BonPlanStatusBadgeProps {
  isActive: boolean
}

export function BonPlanStatusBadge({ isActive }: BonPlanStatusBadgeProps) {
  return (
    <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? "Actif" : "Inactif"}
    </Badge>
  )
}
