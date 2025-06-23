
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { TravelOffer, TravelOfferTableData } from "@/types/travel"

export function useTravelActions() {
  const { toast } = useToast()

  const fetchTravelOffers = async (): Promise<TravelOffer[]> => {
    try {
      const { data, error } = await supabase
        .from('travel_offers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur lors de la récupération des offres:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les offres de voyage.",
          variant: "destructive",
        })
        return []
      }

      return data.map(offer => ({
        ...offer,
        gallery_images: offer.gallery_images || [],
        inclusions: offer.inclusions || [],
        exclusions: offer.exclusions || []
      }))
    } catch (error) {
      console.error('Erreur:', error)
      return []
    }
  }

  const handleEdit = (offerData: TravelOfferTableData): TravelOffer => {
    return {
      ...offerData,
      id: parseInt(offerData.id),
      price: offerData._originalPrice
    }
  }

  const handleDelete = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('travel_offers')
        .delete()
        .eq('id', parseInt(id))

      if (error) {
        console.error('Erreur lors de la suppression:', error)
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'offre de voyage.",
          variant: "destructive",
        })
        return false
      }

      toast({
        title: "Offre supprimée",
        description: "L'offre de voyage a été supprimée avec succès.",
      })
      return true
    } catch (error) {
      console.error('Erreur:', error)
      return false
    }
  }

  const saveOffer = async (offerData: Partial<TravelOffer>): Promise<TravelOffer | null> => {
    try {
      if (offerData.id) {
        const { data, error } = await supabase
          .from('travel_offers')
          .update({
            title: offerData.title,
            destination: offerData.destination,
            departure_location: offerData.departure_location,
            duration_days: offerData.duration_days,
            price: offerData.price,
            departure_date: offerData.departure_date,
            return_date: offerData.return_date,
            description: offerData.description,
            image: offerData.image,
            gallery_images: offerData.gallery_images,
            inclusions: offerData.inclusions,
            exclusions: offerData.exclusions,
            max_participants: offerData.max_participants,
            is_active: offerData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', offerData.id)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('travel_offers')
          .insert({
            title: offerData.title,
            destination: offerData.destination,
            departure_location: offerData.departure_location,
            duration_days: offerData.duration_days,
            price: offerData.price,
            departure_date: offerData.departure_date,
            return_date: offerData.return_date,
            description: offerData.description,
            image: offerData.image,
            gallery_images: offerData.gallery_images,
            inclusions: offerData.inclusions,
            exclusions: offerData.exclusions,
            max_participants: offerData.max_participants,
            is_active: offerData.is_active
          })
          .select()
          .single()

        if (error) throw error
        return data
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'offre de voyage.",
        variant: "destructive",
      })
      return null
    }
  }

  return {
    fetchTravelOffers,
    handleEdit,
    handleDelete,
    saveOffer
  }
}
