
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface VoyanceMediumFormData {
  name: string
  description: string
  image: string
  gallery_images: string[]
  specialties: string[]
  languages: string[]
  consultation_types: string[]
  experience_years: number
  price_per_session: number
  rating: number
  is_active: boolean
  location: string
  contact_email: string
  contact_phone: string
  contact_whatsapp: string
  availability_schedule: {}
}

export function useVoyanceMediumForm(medium: any, onSuccess?: () => void, onClose?: () => void) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<VoyanceMediumFormData>({
    name: '',
    description: '',
    image: '',
    gallery_images: [],
    specialties: [],
    languages: ['français'],
    consultation_types: ['présentiel'],
    experience_years: 0,
    price_per_session: 0,
    rating: 0,
    is_active: true,
    location: '',
    contact_email: '',
    contact_phone: '',
    contact_whatsapp: '',
    availability_schedule: {}
  })

  useEffect(() => {
    if (medium) {
      setFormData({
        name: medium.name || '',
        description: medium.description || '',
        image: medium.image || '',
        gallery_images: medium.gallery_images || [],
        specialties: medium.specialties || [],
        languages: medium.languages || ['français'],
        consultation_types: medium.consultation_types || ['présentiel'],
        experience_years: medium.experience_years || 0,
        price_per_session: medium.price_per_session || 0,
        rating: medium.rating || 0,
        is_active: medium.is_active ?? true,
        location: medium.location || '',
        contact_email: medium.contact_email || '',
        contact_phone: medium.contact_phone || '',
        contact_whatsapp: medium.contact_whatsapp || '',
        availability_schedule: medium.availability_schedule || {}
      })
    } else {
      setFormData({
        name: '',
        description: '',
        image: '',
        gallery_images: [],
        specialties: [],
        languages: ['français'],
        consultation_types: ['présentiel'],
        experience_years: 0,
        price_per_session: 0,
        rating: 0,
        is_active: true,
        location: '',
        contact_email: '',
        contact_phone: '',
        contact_whatsapp: '',
        availability_schedule: {}
      })
    }
  }, [medium])

  const updateFormData = (updates: Partial<VoyanceMediumFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSubmit = {
        ...formData,
        specialties: formData.specialties,
        languages: formData.languages,
        consultation_types: formData.consultation_types,
        gallery_images: formData.gallery_images
      }

      if (medium) {
        const { error } = await supabase
          .from('voyance_mediums')
          .update(dataToSubmit)
          .eq('id', medium.id)

        if (error) throw error

        toast({
          title: "Médium modifié",
          description: "Les informations du médium ont été mises à jour."
        })
      } else {
        const { error } = await supabase
          .from('voyance_mediums')
          .insert(dataToSubmit)

        if (error) throw error

        toast({
          title: "Médium créé",
          description: "Le nouveau médium a été ajouté avec succès."
        })
      }

      onSuccess?.()
      onClose?.()
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
    updateFormData,
    handleSubmit,
    loading
  }
}
