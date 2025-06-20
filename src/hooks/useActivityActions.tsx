
import { useCallback } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Activity } from "@/types/activity"

export function useActivityActions() {
  const { toast } = useToast()

  const fetchActivities = useCallback(async () => {
    console.log('🔄 Début de la récupération des activités...')
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('name')

      console.log('📊 Données récupérées:', data)
      console.log('❌ Erreur éventuelle:', error)

      if (error) {
        console.error('❌ Erreur Supabase:', error)
        throw error
      }
      
      console.log('✅ Nombre d\'activités récupérées:', data?.length || 0)
      return data || []
    } catch (error: unknown) {
      console.error('💥 Erreur lors du chargement des activités:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les activités.",
        variant: "destructive",
      })
      return []
    }
  }, [toast])

  const handleDelete = useCallback(async (id: string) => {
    const activityId = parseInt(id)
    console.log('🗑️ Suppression de l\'activité ID:', activityId)
    
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId)

      if (error) throw error

      toast({
        title: "Activité supprimée",
        description: "L'activité a été supprimée avec succès.",
      })

      return true
    } catch (error: unknown) {
      console.error('❌ Erreur lors de la suppression:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'activité.",
        variant: "destructive",
      })
      return false
    }
  }, [toast])

  return {
    fetchActivities,
    handleDelete
  }
}
