import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Users, Clock, Euro } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/DataTable"
import { LoisirsModal } from "@/components/LoisirsModal"
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
import type { Json } from "@/integrations/supabase/types"

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
  gallery_images?: Json
}

interface LoisirTableData extends Omit<Loisir, 'id'> {
  id: string
  availability: JSX.Element
  participants: string
  dates: string
  image_preview: JSX.Element
}

export default function LeisureActivities() {
  const [loisirs, setLoisirs] = useState<Loisir[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLoisir, setSelectedLoisir] = useState<Loisir | null>(null)
  const [deleteLoisirId, setDeleteLoisirId] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchLoisirs = async () => {
    console.log('🔄 Début de la récupération des loisirs...')
    try {
      const { data, error } = await supabase
        .from('loisirs')
        .select('*')
        .order('title')

      console.log('📊 Données récupérées:', data)
      console.log('❌ Erreur éventuelle:', error)

      if (error) {
        console.error('❌ Erreur Supabase:', error)
        throw error
      }
      
      console.log('✅ Nombre de loisirs récupérés:', data?.length || 0)
      setLoisirs(data || [])
    } catch (error: unknown) {
      console.error('💥 Erreur lors du chargement des loisirs:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les loisirs.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      console.log('🏁 Fin de la récupération des loisirs')
    }
  }

  useEffect(() => {
    fetchLoisirs()
  }, [])

  const handleEdit = (loisirData: LoisirTableData) => {
    // Convert back to original Loisir type
    const loisir: Loisir = {
      id: parseInt(loisirData.id),
      title: loisirData.title,
      description: loisirData.description,
      location: loisirData.location,
      start_date: loisirData.start_date,
      end_date: loisirData.end_date,
      max_participants: loisirData.max_participants,
      current_participants: loisirData.current_participants,
      image: loisirData.image,
      gallery_images: loisirData.gallery_images,
    }
    console.log('✏️ Édition du loisir:', loisir)
    setSelectedLoisir(loisir)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const loisirId = parseInt(id)
    console.log('🗑️ Suppression du loisir ID:', loisirId)
    
    try {
      const { error } = await supabase
        .from('loisirs')
        .delete()
        .eq('id', loisirId)

      if (error) throw error

      toast({
        title: "Loisir supprimé",
        description: "Le loisir a été supprimé avec succès.",
      })

      fetchLoisirs()
    } catch (error: unknown) {
      console.error('❌ Erreur lors de la suppression:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le loisir.",
        variant: "destructive",
      })
    }
    setDeleteLoisirId(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedLoisir(null)
  }

  const getAvailabilityColor = (current: number, max: number) => {
    const ratio = current / max
    if (ratio >= 1) return "bg-red-100 text-red-800"
    if (ratio >= 0.8) return "bg-orange-100 text-orange-800"
    return "bg-green-100 text-green-800"
  }

  const getAvailabilityText = (current: number, max: number) => {
    const available = max - current
    if (available <= 0) return "Complet"
    return `${available} places`
  }

  const tableData: LoisirTableData[] = loisirs.map(loisir => ({
    ...loisir,
    id: loisir.id.toString(),
    availability: (
      <Badge className={getAvailabilityColor(loisir.current_participants, loisir.max_participants)}>
        {getAvailabilityText(loisir.current_participants, loisir.max_participants)}
      </Badge>
    ),
    participants: `${loisir.current_participants}/${loisir.max_participants}`,
    dates: `${loisir.start_date} - ${loisir.end_date}`,
    image_preview: loisir.image ? (
      <img src={loisir.image} alt={loisir.title} className="w-12 h-12 object-cover rounded" />
    ) : (
      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
        <Eye className="h-4 w-4 text-gray-400" />
      </div>
    )
  }))

  const columns = [
    { key: 'image_preview', label: 'Image' },
    { key: 'title', label: 'Titre' },
    { key: 'location', label: 'Lieu' },
    { key: 'dates', label: 'Période' },
    { key: 'participants', label: 'Participants' },
    { key: 'availability', label: 'Disponibilité' }
  ]

  console.log('🎯 État actuel:', { loading, loisirs: loisirs.length, isModalOpen })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des loisirs...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Loisirs</h1>
          <p className="text-muted-foreground">Gérez vos activités de loisirs</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau loisir
        </Button>
      </div>

      {/* Message de débogage */}
      {loisirs.length === 0 && !loading && (
        <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-lg font-medium text-yellow-800">Aucun loisir trouvé</p>
          <p className="text-yellow-600 mt-2">
            La table 'loisirs' semble être vide. Créez votre premier loisir en cliquant sur "Nouveau loisir".
          </p>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loisirs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loisirs.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loisirs.reduce((sum, loisir) => sum + loisir.current_participants, 0)}
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
          onEdit={handleEdit}
          onDelete={(id) => setDeleteLoisirId(parseInt(id))}
        />
      )}

      {/* Modal de création/édition */}
      <LoisirsModal
        loisir={selectedLoisir}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchLoisirs}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteLoisirId !== null} onOpenChange={() => setDeleteLoisirId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce loisir ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteLoisirId && handleDelete(deleteLoisirId.toString())}
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
