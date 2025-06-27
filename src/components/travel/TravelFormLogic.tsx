
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { TravelOffer } from "@/types/travel"

export function useTravelFormLogic(
  offer: TravelOffer | null,
  isOpen: boolean,
  onSave: (offer: Partial<TravelOffer>) => Promise<TravelOffer | null>
) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<TravelOffer>>({
    title: '',
    destination: '',
    departure_location: '',
    duration_days: 7,
    price: 0,
    departure_date: '',
    return_date: '',
    description: '',
    image: '',
    gallery_images: [],
    inclusions: [],
    exclusions: [],
    max_participants: 20,
    current_participants: 0,
    is_active: true
  })

  // Réinitialiser le formulaire quand la modal s'ouvre/ferme
  useEffect(() => {
    if (isOpen) {
      if (offer) {
        setFormData({
          ...offer,
          gallery_images: offer.gallery_images || [],
          inclusions: offer.inclusions || [],
          exclusions: offer.exclusions || []
        })
      } else {
        setFormData({
          title: '',
          destination: '',
          departure_location: '',
          duration_days: 7,
          price: 0,
          departure_date: '',
          return_date: '',
          description: '',
          image: '',
          gallery_images: [],
          inclusions: [],
          exclusions: [],
          max_participants: 20,
          current_participants: 0,
          is_active: true
        })
      }
    }
  }, [offer, isOpen])

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: images
    }))
  }

  const handleSubmit = async (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault()
    
    if (!formData.title?.trim() || !formData.destination?.trim() || 
        !formData.departure_location?.trim() || !formData.description?.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    if (!formData.duration_days || formData.duration_days < 1) {
      toast({
        title: "Erreur",
        description: "La durée doit être d'au moins 1 jour.",
        variant: "destructive",
      })
      return
    }

    if (!formData.price || formData.price <= 0) {
      toast({
        title: "Erreur",
        description: "Le prix doit être supérieur à 0.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log('💾 Sauvegarde de l\'offre:', formData)
      
      const result = await onSave(formData)
      
      if (result) {
        toast({
          title: offer ? "Offre modifiée" : "Offre créée",
          description: offer ? "L'offre de voyage a été modifiée avec succès." : "L'offre de voyage a été créée avec succès.",
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
    handleImagesChange,
    updateFormData
  }
}
