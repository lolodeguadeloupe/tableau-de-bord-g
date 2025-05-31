
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
  gallery_images?: any
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

      console.log('✅ Loisirs récupérés:', data)
      setLoisirs(data || [])
    } catch (error: any) {
      console.error('💥 Erreur inattendue:', error)
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
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loisirs.map((loisir) => (
            <Card key={loisir.id} className="border border-border/40 hover:shadow-lg transition-shadow">
              {loisir.image && (
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={loisir.image}
                    alt={loisir.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                    {loisir.title}
                  </CardTitle>
                  {isEditor && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(loisir)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(loisir.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {loisir.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{loisir.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{loisir.start_date} - {loisir.end_date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{loisir.current_participants || 0} / {loisir.max_participants} participants</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <Badge variant={
                    (loisir.current_participants || 0) >= loisir.max_participants 
                      ? "destructive" 
                      : "default"
                  }>
                    {(loisir.current_participants || 0) >= loisir.max_participants 
                      ? "Complet" 
                      : "Places disponibles"
                    }
                  </Badge>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {Math.round(((loisir.current_participants || 0) / loisir.max_participants) * 100)}% rempli
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <LoisirsModal
        loisir={selectedLoisir}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
