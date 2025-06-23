
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export interface Promotion {
  id: number
  title: string
  description: string
  image: string
  badge?: string
  cta_text: string
  cta_url: string
  is_active: boolean
  sort_order?: number
  created_at?: string
  updated_at?: string
}

export function usePromotionActions() {
  const { toast } = useToast()

  const fetchPromotions = async (): Promise<Promotion[]> => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Erreur lors de la récupération des promotions:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les promotions.",
          variant: "destructive",
        })
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erreur:', error)
      return []
    }
  }

  const handleDelete = async (id: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erreur lors de la suppression:', error)
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la promotion.",
          variant: "destructive",
        })
        return false
      }

      toast({
        title: "Promotion supprimée",
        description: "La promotion a été supprimée avec succès.",
      })
      return true
    } catch (error) {
      console.error('Erreur:', error)
      return false
    }
  }

  const savePromotion = async (promotionData: Partial<Promotion>): Promise<Promotion | null> => {
    try {
      console.log('💾 Tentative de sauvegarde de la promotion:', promotionData)
      
      if (promotionData.id) {
        // Mise à jour d'une promotion existante
        console.log('🔄 Mise à jour de la promotion avec ID:', promotionData.id)
        
        const { data, error } = await supabase
          .from('promotions')
          .update({
            title: promotionData.title,
            description: promotionData.description,
            image: promotionData.image,
            badge: promotionData.badge,
            cta_text: promotionData.cta_text,
            cta_url: promotionData.cta_url,
            is_active: promotionData.is_active,
            sort_order: promotionData.sort_order,
            updated_at: new Date().toISOString()
          })
          .eq('id', promotionData.id)
          .select()

        if (error) {
          console.error('❌ Erreur lors de la mise à jour:', error)
          throw error
        }

        console.log('✅ Promotion mise à jour avec succès:', data)
        
        // Retourner le premier élément du tableau ou null si vide
        return data && data.length > 0 ? data[0] : null
      } else {
        // Création d'une nouvelle promotion
        console.log('➕ Création d\'une nouvelle promotion')
        
        const { data, error } = await supabase
          .from('promotions')
          .insert({
            title: promotionData.title,
            description: promotionData.description,
            image: promotionData.image,
            badge: promotionData.badge,
            cta_text: promotionData.cta_text,
            cta_url: promotionData.cta_url,
            is_active: promotionData.is_active,
            sort_order: promotionData.sort_order
          })
          .select()

        if (error) {
          console.error('❌ Erreur lors de la création:', error)
          throw error
        }

        console.log('✅ Promotion créée avec succès:', data)
        
        // Retourner le premier élément du tableau ou null si vide
        return data && data.length > 0 ? data[0] : null
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la promotion.",
        variant: "destructive",
      })
      return null
    }
  }

  const toggleVisibility = async (promotion: Promotion): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ is_active: !promotion.is_active })
        .eq('id', promotion.id)

      if (error) throw error

      toast({
        title: "Statut mis à jour",
        description: `La promotion est maintenant ${!promotion.is_active ? 'visible' : 'masquée'}.`,
      })
      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la promotion.",
        variant: "destructive",
      })
      return false
    }
  }

  return {
    fetchPromotions,
    handleDelete,
    savePromotion,
    toggleVisibility
  }
}
