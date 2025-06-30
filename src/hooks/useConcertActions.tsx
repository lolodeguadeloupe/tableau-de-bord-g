/**
 * Hook personnalisé pour gérer les actions CRUD sur les concerts
 * 
 * Ce fichier est importé pour :
 * - Centraliser la logique métier des concerts (création, modification, suppression)
 * - Gérer les permissions d'accès aux concerts via usePartnerActivities
 * - Fournir des fonctions réutilisables pour les opérations sur les concerts
 * - Gérer les interactions avec Supabase de manière cohérente
 * - Afficher des notifications toast pour le feedback utilisateur
 * 
 * Utilisé principalement dans les composants de gestion des concerts
 * et les formulaires d'édition/création de concerts.
 */

import { useCallback } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { usePartnerActivities } from "./usePartnerActivities"
import type { Concert, ConcertTableData } from "@/types/concert"

export function useConcertActions() {
  const { toast } = useToast()
  const { canAccessActivity } = usePartnerActivities()

  // Note: Le fetchConcerts est maintenant géré par useConcerts hook
  // Cette fonction est conservée pour la compatibilité mais délègue au hook
  const fetchConcerts = useCallback(async () => {
    console.log('⚠️  fetchConcerts appelé depuis useConcertActions - utiliser useConcerts hook à la place')
    try {
      const { data, error } = await supabase
        .from('concerts')
        .select('*')
        .order('date')

      if (error) {
        console.error('❌ Erreur Supabase:', error)
        throw error
      }
      
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

  const handleEdit = useCallback((concertData: ConcertTableData): Concert | null => {
    const concertId = parseInt(concertData.id);
    
    // Vérifier les permissions d'accès à ce concert
    if (!canAccessActivity('concert', concertId)) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de modifier ce concert.",
        variant: "destructive",
      })
      return null;
    }

    const concert: Concert = {
      id: concertId,
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
  }, [canAccessActivity, toast])

  const handleDelete = useCallback(async (id: string) => {
    const concertId = parseInt(id)
    console.log('🗑️ Suppression du concert ID:', concertId)
    
    // Vérifier les permissions d'accès à ce concert
    if (!canAccessActivity('concert', concertId)) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de supprimer ce concert.",
        variant: "destructive",
      })
      return false;
    }
    
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
  }, [canAccessActivity, toast])

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
