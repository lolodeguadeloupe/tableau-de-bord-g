
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Star, MapPin, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/DataTable"
import { RestaurantModal } from "@/components/RestaurantModal"
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

interface Restaurant {
  id: number
  name: string
  type: string
  location: string
  description: string
  offer: string
  icon: string
  image: string
  rating: number
}

interface RestaurantTableData extends Omit<Restaurant, 'id'> {
  id: string
  rating_display: JSX.Element
  image_preview: JSX.Element
  type_badge: JSX.Element
}

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [deleteRestaurantId, setDeleteRestaurantId] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchRestaurants = async () => {
    console.log('🔄 Début de la récupération des restaurants...')
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('name')

      console.log('📊 Données récupérées:', data)
      console.log('❌ Erreur éventuelle:', error)

      if (error) {
        console.error('❌ Erreur Supabase:', error)
        throw error
      }
      
      console.log('✅ Nombre de restaurants récupérés:', data?.length || 0)
      setRestaurants(data || [])
    } catch (error: unknown) {
      console.error('💥 Erreur lors du chargement des restaurants:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les restaurants.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      console.log('🏁 Fin de la récupération des restaurants')
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const handleEdit = (restaurantData: RestaurantTableData) => {
    const restaurant: Restaurant = {
      id: parseInt(restaurantData.id),
      name: restaurantData.name,
      type: restaurantData.type,
      location: restaurantData.location,
      description: restaurantData.description,
      offer: restaurantData.offer,
      icon: restaurantData.icon,
      image: restaurantData.image,
      rating: restaurantData.rating,
    }
    console.log('✏️ Édition du restaurant:', restaurant)
    setSelectedRestaurant(restaurant)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const restaurantId = parseInt(id)
    console.log('🗑️ Suppression du restaurant ID:', restaurantId)
    
    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', restaurantId)

      if (error) throw error

      toast({
        title: "Restaurant supprimé",
        description: "Le restaurant a été supprimé avec succès.",
      })

      fetchRestaurants()
    } catch (error: unknown) {
      console.error('❌ Erreur lors de la suppression:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le restaurant.",
        variant: "destructive",
      })
    }
    setDeleteRestaurantId(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedRestaurant(null)
  }

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
      </div>
    )
  }

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'italien': 'bg-red-100 text-red-800',
      'français': 'bg-blue-100 text-blue-800',
      'asiatique': 'bg-green-100 text-green-800',
      'méditerranéen': 'bg-orange-100 text-orange-800',
      'fusion': 'bg-purple-100 text-purple-800',
      'traditionnel': 'bg-yellow-100 text-yellow-800',
    }
    return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  const tableData: RestaurantTableData[] = restaurants.map(restaurant => ({
    ...restaurant,
    id: restaurant.id.toString(),
    rating_display: getRatingStars(restaurant.rating),
    image_preview: restaurant.image ? (
      <img src={restaurant.image} alt={restaurant.name} className="w-12 h-12 object-cover rounded" />
    ) : (
      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
        <Utensils className="h-4 w-4 text-gray-400" />
      </div>
    ),
    type_badge: (
      <Badge className={getTypeColor(restaurant.type)}>
        {restaurant.type}
      </Badge>
    )
  }))

  const columns = [
    { key: 'image_preview', label: 'Image' },
    { key: 'name', label: 'Nom' },
    { key: 'type_badge', label: 'Type' },
    { key: 'location', label: 'Lieu' },
    { key: 'rating_display', label: 'Note' },
    { key: 'offer', label: 'Offre' }
  ]

  console.log('🎯 État actuel:', { loading, restaurants: restaurants.length, isModalOpen })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des restaurants...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Restaurants</h1>
          <p className="text-muted-foreground">Gérez vos restaurants partenaires</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau restaurant
        </Button>
      </div>

      {/* Message de débogage */}
      {restaurants.length === 0 && !loading && (
        <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-lg font-medium text-yellow-800">Aucun restaurant trouvé</p>
          <p className="text-yellow-600 mt-2">
            La table 'restaurants' semble être vide. Créez votre premier restaurant en cliquant sur "Nouveau restaurant".
          </p>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurants.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {restaurants.length > 0 
                ? (restaurants.reduce((sum, restaurant) => sum + restaurant.rating, 0) / restaurants.length).toFixed(1)
                : "0.0"
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Types de Cuisine</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(restaurants.map(r => r.type)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restaurants 5 Étoiles</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {restaurants.filter(r => r.rating === 5).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table des restaurants */}
      {restaurants.length > 0 && (
        <DataTable
          title="Liste des restaurants"
          data={tableData}
          columns={columns}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteRestaurantId(parseInt(id))}
        />
      )}

      {/* Modal de création/édition */}
      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchRestaurants}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteRestaurantId !== null} onOpenChange={() => setDeleteRestaurantId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce restaurant ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteRestaurantId && handleDelete(deleteRestaurantId.toString())}
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
