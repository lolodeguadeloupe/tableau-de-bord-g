
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Home, Users, Euro, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/DataTable"
import { AccommodationModal } from "@/components/AccommodationModal"
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

interface Accommodation {
  id: number
  name: string
  type: string
  location: string
  description: string
  price: number
  rating: number
  rooms: number
  bathrooms: number
  max_guests: number
  image: string
  gallery_images?: Json
  amenities?: Json
  features?: Json
  rules?: Json
  discount?: number
}

export default function Accommodations() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null)
  const [deleteAccommodationId, setDeleteAccommodationId] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchAccommodations = async () => {
    console.log('🔄 Début de la récupération des hébergements...')
    try {
      const { data, error } = await supabase
        .from('accommodations')
        .select('*')
        .order('name')

      console.log('📊 Données récupérées:', data)
      console.log('❌ Erreur éventuelle:', error)

      if (error) {
        console.error('❌ Erreur Supabase:', error)
        throw error
      }
      
      console.log('✅ Nombre d\'hébergements récupérés:', data?.length || 0)
      setAccommodations(data || [])
    } catch (error: unknown) {
      console.error('💥 Erreur lors du chargement des hébergements:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les hébergements.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      console.log('🏁 Fin de la récupération des hébergements')
    }
  }

  useEffect(() => {
    fetchAccommodations()
  }, [])

  const handleEdit = (accommodation: Accommodation) => {
    console.log('✏️ Édition de l\'hébergement:', accommodation)
    setSelectedAccommodation(accommodation)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const accommodationId = parseInt(id)
    console.log('🗑️ Suppression de l\'hébergement ID:', accommodationId)
    
    try {
      const { error } = await supabase
        .from('accommodations')
        .delete()
        .eq('id', accommodationId)

      if (error) throw error

      toast({
        title: "Hébergement supprimé",
        description: "L'hébergement a été supprimé avec succès.",
      })

      fetchAccommodations()
    } catch (error: unknown) {
      console.error('❌ Erreur lors de la suppression:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'hébergement.",
        variant: "destructive",
      })
    }
    setDeleteAccommodationId(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedAccommodation(null)
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-100 text-green-800"
    if (rating >= 4.0) return "bg-blue-100 text-blue-800"
    if (rating >= 3.5) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "villa": "bg-purple-100 text-purple-800",
      "appartement": "bg-blue-100 text-blue-800",
      "maison": "bg-green-100 text-green-800",
      "studio": "bg-orange-100 text-orange-800",
      "resort": "bg-pink-100 text-pink-800",
    }
    return colors[type.toLowerCase()] || "bg-gray-100 text-gray-800"
  }

  const tableData = accommodations.map(accommodation => ({
    ...accommodation,
    id: accommodation.id.toString(),
    rating_badge: (
      <Badge className={getRatingColor(accommodation.rating)}>
        ⭐ {accommodation.rating}
      </Badge>
    ),
    type_badge: (
      <Badge className={getTypeColor(accommodation.type)}>
        {accommodation.type}
      </Badge>
    ),
    capacity: `${accommodation.max_guests} personnes`,
    rooms_info: `${accommodation.rooms} ch. • ${accommodation.bathrooms} sdb`,
    price_display: `${accommodation.price}€${accommodation.discount ? ` (-${accommodation.discount}%)` : ''}`,
    image_preview: accommodation.image ? (
      <img src={accommodation.image} alt={accommodation.name} className="w-12 h-12 object-cover rounded" />
    ) : (
      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
        <Home className="h-4 w-4 text-gray-400" />
      </div>
    )
  }))

  const columns = [
    { key: 'image_preview', label: 'Image' },
    { key: 'name', label: 'Nom' },
    { key: 'type_badge', label: 'Type' },
    { key: 'location', label: 'Lieu' },
    { key: 'capacity', label: 'Capacité' },
    { key: 'rooms_info', label: 'Chambres/SdB' },
    { key: 'price_display', label: 'Prix' },
    { key: 'rating_badge', label: 'Note' }
  ]

  console.log('🎯 État actuel:', { loading, accommodations: accommodations.length, isModalOpen })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des hébergements...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hébergements</h1>
          <p className="text-muted-foreground">Gérez vos hébergements et propriétés</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvel hébergement
        </Button>
      </div>

      {/* Message de débogage */}
      {accommodations.length === 0 && !loading && (
        <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-lg font-medium text-yellow-800">Aucun hébergement trouvé</p>
          <p className="text-yellow-600 mt-2">
            La table 'accommodations' semble être vide. Créez votre premier hébergement en cliquant sur "Nouvel hébergement".
          </p>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hébergements</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accommodations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacité Totale</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accommodations.reduce((sum, acc) => sum + acc.max_guests, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prix Moyen</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accommodations.length > 0 
                ? `${Math.round(accommodations.reduce((sum, acc) => sum + acc.price, 0) / accommodations.length)}€`
                : "0€"
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accommodations.length > 0 
                ? `${(accommodations.reduce((sum, acc) => sum + acc.rating, 0) / accommodations.length).toFixed(1)}/5`
                : "0/5"
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table des hébergements */}
      {accommodations.length > 0 && (
        <DataTable
          title="Liste des hébergements"
          data={tableData}
          columns={columns}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteAccommodationId(parseInt(id))}
        />
      )}

      {/* Modal de création/édition */}
      <AccommodationModal
        accommodation={selectedAccommodation}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchAccommodations}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteAccommodationId !== null} onOpenChange={() => setDeleteAccommodationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet hébergement ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteAccommodationId && handleDelete(deleteAccommodationId.toString())}
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
