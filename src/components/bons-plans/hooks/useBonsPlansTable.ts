
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useBonsPlansTable() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const { data: bonsPlans, isLoading } = useQuery({
    queryKey: ['bons-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bons_plans')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('bons_plans')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error

      // Mise à jour optimiste du cache
      queryClient.setQueryData(['bons-plans'], (oldData: any) => {
        if (!oldData) return oldData
        return oldData.map((item: any) => 
          item.id === id ? { ...item, is_active: !currentStatus } : item
        )
      })

      toast({
        title: "Statut modifié",
        description: `Le bon plan a été ${!currentStatus ? 'activé' : 'désactivé'}.`
      })

    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bon plan ?')) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('bons_plans')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Mise à jour optimiste du cache
      queryClient.setQueryData(['bons-plans'], (oldData: any) => {
        if (!oldData) return oldData
        return oldData.filter((item: any) => item.id !== id)
      })

      toast({
        title: "Bon plan supprimé",
        description: "Le bon plan a été supprimé avec succès."
      })

    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le bon plan.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    bonsPlans,
    isLoading,
    loading,
    handleToggleActive,
    handleDelete
  }
}
