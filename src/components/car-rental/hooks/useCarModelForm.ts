
import { useState, useEffect } from "react"
import { CarModel } from "@/hooks/useCarRentalActions"

interface UseCarModelFormProps {
  model?: CarModel | null
}

export function useCarModelForm({ model }: UseCarModelFormProps) {
  const [formData, setFormData] = useState<Partial<CarModel>>({
    name: '',
    company_id: '',
    image: '',
    price_per_day: 0,
    category: '',
    seats: 5,
    transmission: 'Automatique',
    air_con: true,
    is_active: true,
    gallery_images: []
  })

  useEffect(() => {
    if (model) {
      setFormData({
        ...model,
        gallery_images: model.gallery_images || []
      })
    } else {
      setFormData({
        name: '',
        company_id: '',
        image: '',
        price_per_day: 0,
        category: '',
        seats: 5,
        transmission: 'Automatique',
        air_con: true,
        is_active: true,
        gallery_images: []
      })
    }
  }, [model])

  const handleFieldChange = (field: keyof CarModel, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImagesChange = (images: string[]) => {
    const mainImage = images.length > 0 ? images[0] : ''
    const galleryImages = images.slice(1) // Toutes les images sauf la première
    
    setFormData(prev => ({
      ...prev,
      image: mainImage,
      gallery_images: galleryImages
    }))
  }

  return {
    formData,
    handleFieldChange,
    handleImagesChange
  }
}
