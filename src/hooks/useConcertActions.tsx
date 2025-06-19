
import { useCallback } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Concert, ConcertTableData } from "@/types/concert"

export function useConcertActions() {
  const { toast } = useToast()

  const fetchConcerts = useCallback(async () => {
    console.log('🔄 Début de la récupération des concerts...')
    try {
      const { data, error } = await supabase
        .from('concerts')
        .select('*')
        .order('date')

      console.log('📊 Données récupérées:', data)
      console.log('❌ Erreur éventuelle:', error)

      if (error) {
        console.error('❌ Erreur Supabase:', error)
        throw error
      }
      
      console.log('✅ Nombre de concerts récupérés:', data?.length || 0)
      return data || []
    } catch (error: unknown) {
      console.error('💥 Erreur lors du chargement des concerts:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les concerts.",
        variant: "destructive",
      })
      return []
    }
  }, [toast])

  const handleEdit = useCallback((concertData: ConcertTableData): Concert => {
    const concert: Concert = {
      id: parseInt(concertData.id),
      name: concertData.name,
      artist: concertData.artist,
      genre: concertData.genre,
      image: concertData.image,
      location: concertData.location,
      description: concertData.description,
      date: concertData.date,
      time: concertData.time,
      price: concertData.price,
      offer: concertData.offer,
      rating: concertData.rating,
      icon: concertData.icon,
      gallery_images: concertData.gallery_images || []
    }
    console.log('✏️ Édition du concert:', concert)
    return concert
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    const concertId = parseInt(id)
    console.log('🗑️ Suppression du concert ID:', concertId)
    
    try {
      const { error } = await supabase
        .from('concerts')
        .delete()
        .eq('id', concertId)

      if (error) throw error

      toast({
        title: "Concert supprimé",
        description: "Le concert a été supprimé avec succès.",
      })

      return true
    } catch (error: unknown) {
      console.error('❌ Erreur lors de la suppression:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le concert.",
        variant: "destructive",
      })
      return false
    }
  }, [toast])

  const saveConcert = useCallback(async (concert: Partial<Concert>) => {
    console.log('💾 Sauvegarde du concert:', concert)
    
    try {
      if (concert.id) {
        // Mise à jour
        const { data, error } = await supabase
          .from('concerts')
          .update({
            name: concert.name,
            artist: concert.artist,
            genre: concert.genre,
            image: concert.image,
            location: concert.location,
            description: concert.description,
            date: concert.date,
            time: concert.time,
            price: concert.price,
            offer: concert.offer,
            rating: concert.rating,
            icon: concert.icon || 'Music',
            gallery_images: concert.gallery_images || [],
            updated_at: new Date().toISOString()
          })
          .eq('id', concert.id)
          .select()

        if (error) throw error

        toast({
          title: "Concert mis à jour",
          description: "Les modifications ont été sauvegardées avec succès.",
        })

        return data?.[0]
      } else {
        // Création
        const { data, error } = await supabase
          .from('concerts')
          .insert({
            name: concert.name!,
            artist: concert.artist!,
            genre: concert.genre!,
            image: concert.image!,
            location: concert.location!,
            description: concert.description!,
            date: concert.date!,
            time: concert.time!,
            price: concert.price!,
            offer: concert.offer!,
            rating: concert.rating!,
            icon: concert.icon || 'Music',
            gallery_images: concert.gallery_images || []
          })
          .select()

        if (error) throw error

        toast({
          title: "Concert créé",
          description: "Le nouveau concert a été ajouté avec succès.",
        })

        return data?.[0]
      }
    } catch (error: unknown) {
      console.error('❌ Erreur lors de la sauvegarde:', error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le concert.",
        variant: "destructive",
      })
      return null
    }
  }, [toast])

  return {
    fetchConcerts,
    handleEdit,
    handleDelete,
    saveConcert
  }
}
