
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ActivityModal } from "@/components/activities/ActivityModal"
import { ActivityStats } from "@/components/activities/ActivityStats"
import { ActivityTable } from "@/components/activities/ActivityTable"
import { useActivityActions } from "@/hooks/useActivityActions"
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
import type { Activity } from "@/types/activity"

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [deleteActivityId, setDeleteActivityId] = useState<number | null>(null)

  const { fetchActivities, handleDelete } = useActivityActions()

  const loadActivities = async () => {
    setLoading(true)
    const data = await fetchActivities()
    setActivities(data)
    setLoading(false)
  }

  useEffect(() => {
    loadActivities()
  }, [])

  const onEdit = (activity: Activity) => {
    setSelectedActivity(activity)
    setIsModalOpen(true)
  }

  const onDelete = async (id: string) => {
    const activityId = parseInt(id)
    const success = await handleDelete(id)
    if (success) {
      loadActivities()
    }
    setDeleteActivityId(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedActivity(null)
  }

  const handleModalSuccess = () => {
    loadActivities()
    handleModalClose()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des activités...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nos activités</h1>
          <p className="text-muted-foreground">Gérez les activités affichées sur votre site</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle activité
        </Button>
      </div>

      <ActivityStats activities={activities} />

      <ActivityTable
        activities={activities}
        onEdit={onEdit}
        onDelete={(id) => setDeleteActivityId(parseInt(id))}
        onRefresh={loadActivities}
      />

      <ActivityModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <AlertDialog open={deleteActivityId !== null} onOpenChange={() => setDeleteActivityId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette activité ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteActivityId && onDelete(deleteActivityId.toString())}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
