import { useState, useEffect } from "react"
import { Plus, Users, MapPin, Calendar, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { LoisirsModal } from "@/components/LoisirsModal"
import { useAuth } from "@/hooks/useAuth"

interface Loisir {
  id: number
  title: string
  description: string
  location: string
  start_date: string
  end_date: string
  max_participants: number
  current_participants: number
  image: string
  gallery_images?: string[]
}

export default function LeisureActivities() {
  const [loisirs, setLoisirs] = useState<Loisir[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedLoisir, setSelectedLoisir] = useState<Loisir | null>(null)
  const { toast } = useToast()
  const { isEditor } = useAuth()

  const fetchLoisirs = async () => {
    try {
      console.log('🔄 Récupération des loisirs...')
      const { data, error } = await supabase
        .from('loisirs')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        console.error('❌ Erreur lors de la récupération des loisirs:', error)
        throw error
      }
      
      console.log('✅ Nombre de loisirs récupérés:', data?.length || 0)
      setLoisirs(data || [])
    } catch (error: unknown) {
      console.error('💥 Erreur lors du chargement des loisirs:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les activités de loisirs.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLoisirs()
  }, [])

  const handleEdit = (loisir: Loisir) => {
    console.log('✏️ Édition du loisir:', loisir)
    setSelectedLoisir(loisir)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('loisirs')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Activité supprimée",
        description: "L'activité de loisir a été supprimée avec succès.",
      })

      fetchLoisirs()
    } catch (error: unknown) {
      console.error('❌ Erreur lors de la suppression:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'activité.",
        variant: "destructive",
      })
    }
  }

  const handleCreateNew = () => {
    setSelectedLoisir(null)
    setModalOpen(true)
  }

  const handleModalSuccess = () => {
    fetchLoisirs()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-muted-foreground">Chargement des activités...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activités Loisirs</h1>
          <p className="text-muted-foreground mt-1">Gérez les activités de loisirs disponibles</p>
        </div>
        {isEditor && (
          <Button onClick={handleCreateNew} className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Activité
          </Button>
        )}
      </div>

      {loisirs.length === 0 ? (
        <Card className="border border-border/40">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Aucune activité trouvée</h3>
                <p className="text-muted-foreground">Commencez par créer votre première activité de loisir.</p>
              </div>
              {isEditor && (
                <Button onClick={handleCreateNew} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une activité
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Places Disponibles</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loisirs.reduce((sum, loisir) => sum + (loisir.max_participants - loisir.current_participants), 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Remplissage</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loisirs.length > 0 
                ? `${Math.round((loisirs.reduce((sum, loisir) => sum + loisir.current_participants, 0) / loisirs.reduce((sum, loisir) => sum + loisir.max_participants, 0)) * 100)}%`
                : "0%"
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table des loisirs */}
      {loisirs.length > 0 && (
        <DataTable
          title="Liste des loisirs"
          data={tableData}
          columns={columns}
          onEdit={(item) => {
            const originalLoisir = loisirs.find(l => l.id.toString() === item.id);
            if (originalLoisir) {
              handleEdit(originalLoisir);
            }
          }}
          onDelete={(id) => setDeleteLoisirId(parseInt(id))}
        />
      )}

      {/* Modal de création/édition */}
      <LoisirsModal
        loisir={selectedLoisir}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
