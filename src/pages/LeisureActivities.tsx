
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Users, Clock, Euro } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/DataTable"
import { LeisureActivityModal } from "@/components/LeisureActivityModal"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
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

interface LeisureActivity {
  id: number
  name: string
  category: string
  description: string
  price_per_person: number
  duration_hours: number
  min_level: string
  max_participants?: number
  equipment_provided: boolean
  professional_guide: boolean
  icon_name: string
  created_at: string
  updated_at: string
}

export default function LeisureActivities() {
  const [activities, setActivities] = useState<LeisureActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<LeisureActivity | null>(null)
  const [deleteActivityId, setDeleteActivityId] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('leisure_activities')
        .select('*')
        .order('name')

      if (error) throw error
      setActivities(data || [])
    } catch (error: any) {
      console.error('Erreur lors du chargement des activités:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les activités.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const handleEdit = (activity: any) => {
    setSelectedActivity(activity)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const activityId = parseInt(id)
    try {
      const { error } = await supabase
        .from('leisure_activities')
        .delete()
        .eq('id', activityId)

      if (error) throw error

      toast({
        title: "Activité supprimée",
        description: "L'activité a été supprimée avec succès.",
      })

      fetchActivities()
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'activité.",
        variant: "destructive",
      })
    }
    setDeleteActivityId(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedActivity(null)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      aquatique: "bg-blue-100 text-blue-800",
      terrestre: "bg-green-100 text-green-800", 
      aérien: "bg-purple-100 text-purple-800",
      culture: "bg-yellow-100 text-yellow-800",
      aventure: "bg-red-100 text-red-800"
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const tableData = activities.map(activity => ({
    ...activity,
    id: activity.id.toString(),
    category_badge: (
      <Badge className={getCategoryColor(activity.category)}>
        {activity.category}
      </Badge>
    ),
    price_formatted: formatPrice(activity.price_per_person),
    duration_formatted: `${activity.duration_hours}h`,
    participants_max: activity.max_participants ? `${activity.max_participants} max` : "Illimité",
    level: activity.min_level,
    features: (
      <div className="flex gap-1">
        {activity.equipment_provided && (
          <Badge variant="outline" className="text-xs">Équipement</Badge>
        )}
        {activity.professional_guide && (
          <Badge variant="outline" className="text-xs">Guide</Badge>
        )}
      </div>
    )
  }))

  const columns = [
    { key: 'name', label: 'Nom' },
    { key: 'category_badge', label: 'Catégorie' },
    { key: 'price_formatted', label: 'Prix' },
    { key: 'duration_formatted', label: 'Durée' },
    { key: 'level', label: 'Niveau min' },
    { key: 'participants_max', label: 'Participants' },
    { key: 'features', label: 'Inclus' }
  ]

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
          <h1 className="text-3xl font-bold text-foreground">Activités de Loisirs</h1>
          <p className="text-muted-foreground">Gérez vos activités et excursions</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle activité
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activités</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prix Moyen</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activities.length > 0 
                ? formatPrice(activities.reduce((sum, act) => sum + act.price_per_person, 0) / activities.length)
                : "0 €"
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durée Moyenne</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activities.length > 0 
                ? `${(activities.reduce((sum, act) => sum + act.duration_hours, 0) / activities.length).toFixed(1)}h`
                : "0h"
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(activities.map(act => act.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table des activités */}
      <DataTable
        title="Liste des activités"
        data={tableData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteActivityId(parseInt(id))}
      />

      {/* Modal de création/édition */}
      <LeisureActivityModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchActivities}
      />

      {/* Dialog de confirmation de suppression */}
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
              onClick={() => deleteActivityId && handleDelete(deleteActivityId.toString())}
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
