
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Activity, ActivityTableData } from "@/types/activity"

interface ActivityTableProps {
  activities: Activity[]
  onEdit: (activity: Activity) => void
  onDelete: (id: string) => void
  onRefresh: () => void
}

export function ActivityTable({ activities, onEdit, onDelete, onRefresh }: ActivityTableProps) {
  const { toast } = useToast()

  const toggleVisibility = async (activity: Activity) => {
    try {
      const { error } = await supabase
        .from('activities')
        .update({ is_active: !activity.is_active })
        .eq('id', activity.id)

      if (error) throw error

      toast({
        title: "Statut mis à jour",
        description: `L'activité est maintenant ${!activity.is_active ? 'visible' : 'masquée'}.`,
      })

      onRefresh()
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de l'activité.",
        variant: "destructive",
      })
    }
  }

  const tableData: ActivityTableData[] = activities.map(activity => ({
    ...activity,
    id: activity.id.toString(),
    status: (
      <div className="flex items-center gap-2">
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleVisibility(activity)}
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          {activity.is_active ? (
            <Eye className="h-4 w-4 text-green-600" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-600" />
          )}
        </Button>
      </div>
    )
  }))

  const columns = [
    { key: 'name', label: 'Nom' },
    { key: 'icon_name', label: 'Icône' },
    { key: 'path', label: 'Chemin' },
    { key: 'status', label: 'Statut' }
  ]

  const handleEdit = (item: ActivityTableData) => {
    // Convert back to Activity type for the callback
    const activity: Activity = {
      ...item,
      id: parseInt(item.id)
    }
    onEdit(activity)
  }

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
      onEdit={handleEdit}
      onDelete={onDelete}
    />
  )
}
