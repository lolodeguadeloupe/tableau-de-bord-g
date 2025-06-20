
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Advantage {
  id?: number
  title: string
  description: string
  icon: string
  is_active: boolean
  sort_order: number
}

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
  advantages: Advantage[]
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
    availability_schedule: {},
    advantages: []
  })

  // Charger les avantages d'un médium existant
  const loadAdvantages = async (mediumId: number) => {
    try {
      const { data, error } = await supabase
        .from('voyance_medium_advantages')
        .select('*')
        .eq('medium_id', mediumId)
        .order('sort_order')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors du chargement des avantages:', error)
      return []
    }
  }

  useEffect(() => {
    const initializeForm = async () => {
      if (medium) {
        const advantages = await loadAdvantages(medium.id)
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
          availability_schedule: medium.availability_schedule || {},
          advantages: advantages
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
          availability_schedule: {},
          advantages: []
        })
      }
    }

    initializeForm()
  }, [medium])

  const updateFormData = (updates: Partial<VoyanceMediumFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  // Sauvegarder les avantages
  const saveAdvantages = async (mediumId: number, advantages: Advantage[]) => {
    try {
      // Supprimer les anciens avantages
      await supabase
        .from('voyance_medium_advantages')
        .delete()
        .eq('medium_id', mediumId)

      // Insérer les nouveaux avantages
      if (advantages.length > 0) {
        const advantagesToInsert = advantages.map((advantage, index) => ({
          medium_id: mediumId,
          title: advantage.title,
          description: advantage.description,
          icon: advantage.icon,
          is_active: advantage.is_active,
          sort_order: index
        }))

        const { error } = await supabase
          .from('voyance_medium_advantages')
          .insert(advantagesToInsert)

        if (error) throw error
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des avantages:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSubmit = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        gallery_images: formData.gallery_images,
        specialties: formData.specialties,
        languages: formData.languages,
        consultation_types: formData.consultation_types,
        experience_years: formData.experience_years,
        price_per_session: formData.price_per_session,
        rating: formData.rating,
        is_active: formData.is_active,
        location: formData.location,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        contact_whatsapp: formData.contact_whatsapp,
        availability_schedule: formData.availability_schedule
      }

      let mediumId: number

      if (medium) {
        const { error } = await supabase
          .from('voyance_mediums')
          .update(dataToSubmit)
          .eq('id', medium.id)

        if (error) throw error
        mediumId = medium.id

        toast({
          title: "Médium modifié",
          description: "Les informations du médium ont été mises à jour."
        })
      } else {
        const { data, error } = await supabase
          .from('voyance_mediums')
          .insert(dataToSubmit)
          .select()
          .single()

        if (error) throw error
        mediumId = data.id

        toast({
          title: "Médium créé",
          description: "Le nouveau médium a été ajouté avec succès."
        })
      }

      // Sauvegarder les avantages
      await saveAdvantages(mediumId, formData.advantages)

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
