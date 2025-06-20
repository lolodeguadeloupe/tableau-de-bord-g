
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"

interface FormData {
  title: string
  description: string
  badge: string
  icon: string
  image: string
  url: string
  is_active: boolean
}

const initialFormData: FormData = {
  title: '',
  description: '',
  badge: '',
  icon: 'star',
  image: '',
  url: '',
  is_active: true
}

export function useBonsPlanForm(bonPlan: any, onClose: () => void) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  useEffect(() => {
    if (bonPlan) {
      setFormData({
        title: bonPlan.title || '',
        description: bonPlan.description || '',
        badge: bonPlan.badge || '',
        icon: bonPlan.icon || 'star',
        image: bonPlan.image || '',
        url: bonPlan.url || '',
        is_active: bonPlan.is_active ?? true
      })
    } else {
      setFormData(initialFormData)
    }
  }, [bonPlan])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (bonPlan) {
        const { error } = await supabase
          .from('bons_plans')
          .update(formData)
          .eq('id', bonPlan.id)

        if (error) throw error

        // Mise à jour optimiste du cache
        queryClient.setQueryData(['bons-plans'], (oldData: any) => {
          if (!oldData) return oldData
          return oldData.map((item: any) => 
            item.id === bonPlan.id ? { ...item, ...formData } : item
          )
        })

        toast({
          title: "Bon plan modifié",
          description: "Le bon plan a été mis à jour avec succès."
        })
      } else {
        const { data, error } = await supabase
          .from('bons_plans')
          .insert(formData)
          .select()

        if (error) throw error

        // Mise à jour optimiste du cache
        queryClient.setQueryData(['bons-plans'], (oldData: any) => {
          if (!oldData) return [data[0]]
          return [data[0], ...oldData]
        })

        toast({
          title: "Bon plan créé",
          description: "Le nouveau bon plan a été ajouté avec succès."
        })

        // Réinitialiser le formulaire après création
        setFormData(initialFormData)
      }

      onClose()
      
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    setFormData,
    loading,
    handleSubmit
  }
}
