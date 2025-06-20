
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/DataTable"
import { Eye, EyeOff } from "lucide-react"
import type { Activity, ActivityTableData } from "@/types/activity"

interface ActivityTableProps {
  activities: Activity[]
  onEdit: (activity: Activity) => void
  onDelete: (id: string) => void
}

export function ActivityTable({ activities, onEdit, onDelete }: ActivityTableProps) {
  const tableData: ActivityTableData[] = activities.map(activity => ({
    ...activity,
    id: activity.id.toString(),
    status: (
      <Badge 
        variant={activity.is_active ? "default" : "secondary"}
        className={activity.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
      >
        {activity.is_active ? (
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
    )
  }))

  const columns = [
    { key: 'name', label: 'Nom' },
    { key: 'icon_name', label: 'Icône' },
    { key: 'path', label: 'Chemin' },
    { key: 'status', label: 'Statut' }
  ]

  if (activities.length === 0) {
    return (
      <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-lg font-medium text-yellow-800">Aucune activité trouvée</p>
        <p className="text-yellow-600 mt-2">
          La table 'activities' semble être vide. Créez votre première activité en cliquant sur "Nouvelle activité".
        </p>
      </div>
    )
  }

  return (
    <DataTable
      title="Liste des activités"
      data={tableData}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}
