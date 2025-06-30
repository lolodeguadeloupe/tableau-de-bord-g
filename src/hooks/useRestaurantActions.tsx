
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Restaurant } from "@/components/restaurant/restaurantSchema"
import { RestaurantTableData } from "@/components/restaurant/RestaurantTableUtils"
import { usePartnerActivities } from "./usePartnerActivities"

export function useRestaurantActions(user: any, fetchRestaurants: () => void) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [deleteRestaurantId, setDeleteRestaurantId] = useState<number | null>(null)
  const { toast } = useToast()
  const { canAccessActivity } = usePartnerActivities()

  const handleEdit = (restaurantData: RestaurantTableData) => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour modifier les restaurants.",
        variant: "destructive",
      })
      return
    }

    // Vérifier les permissions d'accès à ce restaurant
    const restaurantId = parseInt(restaurantData.id);
    if (!canAccessActivity('restaurant', restaurantId)) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de modifier ce restaurant.",
        variant: "destructive",
      })
      return
    }

    const restaurant: Restaurant = {
      id: parseInt(restaurantData.id),
      name: restaurantData.name,
      type: restaurantData.type,
      location: restaurantData.location,
      description: restaurantData.description,
      offer: restaurantData.offer,
      icon: restaurantData.icon,
      image: restaurantData.image,
      gallery_images: restaurantData.gallery_images || [],
      rating: restaurantData.rating,
      poids: restaurantData.poids,
      menus: restaurantData.menus || [] // S'assurer que les menus sont inclus
    }
    console.log('✏️ Édition du restaurant avec menus:', restaurant)
    console.log('🍽️ Menus récupérés:', restaurant.menus)
    setSelectedRestaurant(restaurant)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour supprimer les restaurants.",
        variant: "destructive",
      })
      return
    }

    const restaurantId = parseInt(id)
    console.log('🗑️ Suppression du restaurant ID:', restaurantId)
    
    // Vérifier les permissions d'accès à ce restaurant
    if (!canAccessActivity('restaurant', restaurantId)) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de supprimer ce restaurant.",
        variant: "destructive",
      })
      setDeleteRestaurantId(null)
      return
    }
    
    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', restaurantId)

      if (error) {
        console.error('❌ Erreur lors de la suppression:', error)
        throw error
      }

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

  const handleCreateNew = () => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour créer des restaurants.",
        variant: "destructive",
      })
      return
    }
    console.log('➕ Création d\'un nouveau restaurant')
    setSelectedRestaurant(null) // Important: null pour un nouveau restaurant
    setIsModalOpen(true)
  }

  return {
    isModalOpen,
    selectedRestaurant,
    deleteRestaurantId,
    setDeleteRestaurantId,
    handleEdit,
    handleDelete,
    handleModalClose,
    handleCreateNew
  }
}
