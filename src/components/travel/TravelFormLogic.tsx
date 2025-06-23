
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { TravelOffer } from "@/types/travel"

export function useTravelFormLogic(
  offer: TravelOffer | null,
  isOpen: boolean,
  onSave: (offerData: Partial<TravelOffer>) => Promise<TravelOffer | null>
) {
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    departure_location: "",
    duration_days: 7,
    price: 0,
    departure_date: "",
    return_date: "",
    description: "",
    image: "",
    gallery_images: [] as string[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    max_participants: 20,
    is_active: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      if (offer) {
        setFormData({
          title: offer.title,
          destination: offer.destination,
          departure_location: offer.departure_location,
          duration_days: offer.duration_days,
          price: offer.price,
          departure_date: offer.departure_date || "",
          return_date: offer.return_date || "",
          description: offer.description,
          image: offer.image || "",
          gallery_images: offer.gallery_images || [],
          inclusions: offer.inclusions || [],
          exclusions: offer.exclusions || [],
          max_participants: offer.max_participants,
          is_active: offer.is_active
        })
      } else {
        setFormData({
          title: "",
          destination: "",
          departure_location: "",
          duration_days: 7,
          price: 0,
          departure_date: "",
          return_date: "",
          description: "",
          image: "",
          gallery_images: [],
          inclusions: [],
          exclusions: [],
          max_participants: 20,
          is_active: true
        })
      }
    }
  }, [offer, isOpen])

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, gallery_images: images }))
  }

  const handleSubmit = async (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.destination.trim() || !formData.description.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const offerData = {
        ...formData,
        departure_date: formData.departure_date || null,
        return_date: formData.return_date || null,
        ...(offer && { id: offer.id })
      }

      const result = await onSave(offerData)
      if (result) {
        toast({
          title: offer ? "Offre modifiée" : "Offre créée",
          description: offer ? "L'offre de voyage a été modifiée avec succès." : "L'offre de voyage a été créée avec succès.",
        })
        onClose()
      }
    } catch (error) {
      console.error('Erreur:', error)
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
