
import { useState, useEffect } from "react"
import type { NightlifeEvent } from "@/types/nightlife"

export function useNightlifeFormLogic(event?: NightlifeEvent | null, isOpen?: boolean, onSave?: (event: Partial<NightlifeEvent>) => Promise<NightlifeEvent | null>) {
  const [formData, setFormData] = useState<Partial<NightlifeEvent>>({
    name: '',
    type: '',
    venue: '',
    image: '',
    description: '',
    date: '',
    time: '',
    price: 0,
    offer: '',
    rating: 4.5,
    features: [],
    gallery_images: []
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log('NightlifeFormLogic useEffect triggered - isOpen:', isOpen, 'event:', event)
    
    if (isOpen) {
      if (event) {
        console.log('Setting form data with event:', event)
        
        // Initialize gallery images with existing image as first item if gallery is empty
        let initialGalleryImages = Array.isArray(event.gallery_images) ? event.gallery_images : []
        
        // If we have an existing image but no gallery images, add the existing image as the first gallery image
        if (event.image && initialGalleryImages.length === 0) {
          initialGalleryImages = [event.image]
        }
        
        // If we have an existing image and gallery images, but the existing image is not in the gallery, add it as first
        if (event.image && initialGalleryImages.length > 0 && !initialGalleryImages.includes(event.image)) {
          initialGalleryImages = [event.image, ...initialGalleryImages]
        }

        const newFormData = {
          id: event.id,
          name: event.name || '',
          type: event.type || '',
          venue: event.venue || '',
          image: event.image || '',
          description: event.description || '',
          date: event.date || '',
          time: event.time || '',
          price: event.price || 0,
          offer: event.offer || '',
          rating: event.rating || 4.5,
          features: Array.isArray(event.features) ? event.features : [],
          gallery_images: initialGalleryImages
        }
        
        console.log('Setting new form data:', newFormData)
        setFormData(newFormData)
      } else {
        console.log('Resetting form data for new event')
        setFormData({
          name: '',
          type: '',
          venue: '',
          image: '',
          description: '',
          date: '',
          time: '',
          price: 0,
          offer: '',
          rating: 4.5,
          features: [],
          gallery_images: []
        })
      }
    }
  }, [event, isOpen])

  const handleSubmit = async (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault()
    if (!onSave) return
    
    setIsLoading(true)

    try {
      // Set the main image as the first gallery image if gallery_images exist
      const finalFormData = {
        ...formData,
        image: formData.gallery_images && formData.gallery_images.length > 0 
          ? formData.gallery_images[0] 
          : formData.image
      }

      console.log('Submitting form data:', finalFormData)
      const result = await onSave(finalFormData)
      if (result) {
        onClose()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleImagesChange = (images: string[]) => {
    console.log('Images changed:', images)
    setFormData(prev => ({ 
      ...prev, 
      gallery_images: images,
      // Update the main image with the first gallery image
      image: images.length > 0 ? images[0] : prev.image
    }))
  }

  const updateFormData = (updates: Partial<NightlifeEvent>) => {
    console.log('Updating form data with:', updates)
    setFormData(prev => ({ ...prev, ...updates }))
  }

  return {
    formData,
    isLoading,
    handleSubmit,
    handleImagesChange,
    updateFormData
  }
}
