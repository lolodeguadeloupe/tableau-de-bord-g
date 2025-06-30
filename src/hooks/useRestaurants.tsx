
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Restaurant } from "@/components/restaurant/restaurantSchema"
import { usePartnerActivities } from "./usePartnerActivities"
import { useAuth } from "./useAuth"

export function useRestaurants(authLoading: boolean) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { canAccessAllData } = useAuth()
  const { getPartnerIds, loading: activitiesLoading } = usePartnerActivities()

  const fetchRestaurants = async () => {
    console.log('🔄 Début de la récupération des restaurants...')
    try {
      // Obtenir les IDs des partenaires accessibles à l'utilisateur
      const accessiblePartnerIds = getPartnerIds();
      console.log('🏪 IDs partenaires accessibles:', accessiblePartnerIds);

      let query = supabase.from('restaurants').select('*').order('name');

      // Si l'utilisateur n'a pas accès à tout, filtrer par les partenaires accessibles
      if (!canAccessAllData) {
        if (accessiblePartnerIds.length > 0) {
          query = query.in('partner_id', accessiblePartnerIds);
        } else {
          // Si aucun partenaire accessible, retourner une liste vide
          console.log('🚫 Aucun partenaire accessible pour cet utilisateur');
          setRestaurants([]);
          return;
        }
      }

      const { data, error } = await query;

      console.log('📊 Données récupérées:', data)
      console.log('❌ Erreur éventuelle:', error)
      
      // Log détaillé des menus
      if (data && data.length > 0) {
        console.log('🔍 Premier restaurant - données complètes:', data[0])
        console.log('📋 Menus du premier restaurant:', data[0].menus)
        console.log('📋 Type des menus:', typeof data[0].menus)
        console.log('📋 Menus est un array?', Array.isArray(data[0].menus))
      }

      if (error) {
        console.error('❌ Erreur Supabase:', error)
        
        if (error.code === 'PGRST301') {
          toast({
            title: "Authentification requise",
            description: "Veuillez vous connecter pour voir les restaurants.",
            variant: "destructive",
          })
          return
        }
        
        throw error
      }
      
      console.log('✅ Nombre de restaurants récupérés:', data?.length || 0)
      
      // Transform data to ensure gallery_images is always an array
      const transformedData = data?.map(restaurant => ({
        ...restaurant,
        gallery_images: restaurant.gallery_images || [restaurant.image].filter(Boolean)
      })) || []
      
      console.log('🔄 Données après transformation:', transformedData)
      if (transformedData.length > 0) {
        console.log('📋 Menus après transformation:', transformedData[0].menus)
      }
      
      setRestaurants(transformedData)
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
    if (!authLoading && !activitiesLoading) {
      fetchRestaurants()
    }
  }, [authLoading, activitiesLoading])

  return {
    restaurants,
    loading,
    fetchRestaurants
  }
}
