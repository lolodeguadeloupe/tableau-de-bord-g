
import { useCallback } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { usePartnerActivities } from "@/hooks/usePartnerActivities"
import type { Loisir, LoisirTableData } from "@/types/leisure"

export function useLeisureActions() {
  const { toast } = useToast()
  const { canAccessAllData } = useAuth()
  const { getPartnerIds, loading: partnerLoading } = usePartnerActivities()

  const fetchLoisirs = useCallback(async () => {
    console.log('🔄 Début de la récupération des loisirs...')
    
    // Attendre que les partenaires soient chargés
    if (partnerLoading) {
      console.log('⏳ En attente du chargement des partenaires...')
      return []
    }
    
    try {
      const accessiblePartnerIds = getPartnerIds()
      console.log('🎯 IDs partenaires accessibles:', accessiblePartnerIds)

      let query = supabase.from('loisirs').select('*').order('title')

      // Si l'utilisateur n'a pas accès à tout, filtrer par les partenaires accessibles
      if (!canAccessAllData) {
        if (accessiblePartnerIds.length > 0) {
          console.log('🎯 IDs partenaires accessibles:', accessiblePartnerIds)  
          query = query.in('partner_id', accessiblePartnerIds)
        } else {
          // Si aucun partenaire accessible, retourner une liste vide
          console.log('🚫 Aucun partenaire accessible pour cet utilisateur')
          return []
        }
      }

      const { data, error } = await query

      console.log('📊 Données récupérées:', data)
      console.log('❌ Erreur éventuelle:', error)

      if (error) {
        console.error('❌ Erreur Supabase:', error)
        throw error
      }
      
      console.log('✅ Nombre de loisirs récupérés:', data?.length || 0)
      return data || []
    } catch (error: unknown) {
      console.error('💥 Erreur lors du chargement des loisirs:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les loisirs.",
        variant: "destructive",
      })
      return []
    }
  }, [toast, canAccessAllData, getPartnerIds, partnerLoading])

  const handleEdit = useCallback((loisirData: LoisirTableData): Loisir => {
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
    return loisir
  }, [])

  const handleDelete = useCallback(async (id: string) => {
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
        description: "Le loisir a été supprimé avec succès, tout relatif",
      })

      return true
    } catch (error: unknown) {
      console.error('❌ Erreur lors de la suppression:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le loisir.",
        variant: "destructive",
      })
      return false
    }
  }, [toast])

  const handleImageClick = useCallback((loisirId: number) => {
    console.log('🖼️ Clic sur l\'image du loisir ID:', loisirId)
    const externalUrl = `https://demonstration.clubcreole.fr/loisirs/${loisirId}`
    window.open(externalUrl, '_blank', 'noopener,noreferrer')
  }, [])

  return {
    fetchLoisirs,
    handleEdit,
    handleDelete,
    handleImageClick
  }
}
