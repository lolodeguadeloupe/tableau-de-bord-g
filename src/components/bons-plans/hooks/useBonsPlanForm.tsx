
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface FormData {
  title: string
  description: string
  badge: string
  icon: string
  image: string
  is_active: boolean
}

export function useBonsPlanForm(bonPlan: any, onClose: () => void) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    badge: '',
    icon: 'star',
    image: '',
    is_active: true
  })

  useEffect(() => {
    if (bonPlan) {
      setFormData({
        title: bonPlan.title || '',
        description: bonPlan.description || '',
        badge: bonPlan.badge || '',
        icon: bonPlan.icon || 'star',
        image: bonPlan.image || '',
        is_active: bonPlan.is_active ?? true
      })
    } else {
      setFormData({
        title: '',
        description: '',
        badge: '',
        icon: 'star',
        image: '',
        is_active: true
      })
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

        toast({
          title: "Bon plan modifié",
          description: "Le bon plan a été mis à jour avec succès."
        })
      } else {
        const { error } = await supabase
          .from('bons_plans')
          .insert(formData)

        if (error) throw error

        toast({
          title: "Bon plan créé",
          description: "Le nouveau bon plan a été ajouté avec succès."
        })
      }

      onClose()
      // Forcer le rechargement de la page pour s'assurer que les données sont à jour
      window.location.reload()
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
