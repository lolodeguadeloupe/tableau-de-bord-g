
import { Building } from "lucide-react"

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <Building className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-sm font-semibold text-foreground">Aucun partenaire</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Commencez par ajouter votre premier partenaire commercial.
      </p>
    </div>
  )
}
