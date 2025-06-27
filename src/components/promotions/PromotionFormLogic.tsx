
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Promotion } from "@/hooks/usePromotionActions"

export function usePromotionFormLogic(
  promotion: Promotion | null,
  isOpen: boolean,
  onSave: (promotion: Partial<Promotion>) => Promise<Promotion | null>
) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Promotion>>({
    title: '',
    description: '',
    image: '',
    badge: '',
    cta_text: '',
    cta_url: '',
    is_active: true,
    sort_order: 0
  })

  useEffect(() => {
    if (isOpen) {
      if (promotion) {
        setFormData(promotion)
      } else {
        setFormData({
          title: '',
          description: '',
          image: '',
          badge: '',
          cta_text: '',
          cta_url: '',
          is_active: true,
          sort_order: 0
        })
      }
    }
  }, [promotion, isOpen])

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault()
    
    if (!formData.title?.trim() || !formData.description?.trim() || 
        !formData.cta_text?.trim() || !formData.cta_url?.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log('💾 Sauvegarde de la promotion:', formData)
      
      const result = await onSave(formData)
      
      if (result) {
        toast({
          title: promotion ? "Promotion modifiée" : "Promotion créée",
          description: promotion ? "La promotion a été modifiée avec succès." : "La promotion a été créée avec succès.",
        })
        onClose()
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    isLoading,
    handleSubmit,
    updateFormData
  }
}
