
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BonPlanUrlDisplay } from "./components/BonPlanUrlDisplay"
import { BonPlanStatusBadge } from "./components/BonPlanStatusBadge"
import { BonPlanActions } from "./components/BonPlanActions"
import { useBonsPlansTable } from "./hooks/useBonsPlansTable"

interface BonsPlansTableProps {
  onEdit: (bonPlan: any) => void
}

export function BonsPlansTable({ onEdit }: BonsPlansTableProps) {
  const {
    bonsPlans,
    isLoading,
    loading,
    handleToggleActive,
    handleDelete
  } = useBonsPlansTable()

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Badge</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!bonsPlans || bonsPlans.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              Aucun bon plan trouvé
            </TableCell>
          </TableRow>
        ) : (
          bonsPlans.map((bonPlan) => (
            <TableRow key={bonPlan.id}>
              <TableCell className="font-medium">{bonPlan.title}</TableCell>
              <TableCell className="max-w-xs truncate">{bonPlan.description}</TableCell>
              <TableCell>
                {bonPlan.badge && (
                  <Badge variant="secondary">{bonPlan.badge}</Badge>
                )}
              </TableCell>
              <TableCell>
                <BonPlanUrlDisplay url={bonPlan.url} />
              </TableCell>
              <TableCell>
                <BonPlanStatusBadge isActive={bonPlan.is_active} />
              </TableCell>
              <TableCell>
                <BonPlanActions
                  bonPlan={bonPlan}
                  loading={loading}
                  onToggleActive={handleToggleActive}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
