
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Restaurant } from "@/components/restaurant/restaurantSchema"

export function useRestaurants(authLoading: boolean) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
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
    if (!authLoading) {
      fetchRestaurants()
    }
  }, [authLoading])

  return {
    restaurants,
    loading,
    fetchRestaurants
  }
}
