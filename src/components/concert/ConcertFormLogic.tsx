
import { useState, useEffect } from "react"
import type { Concert } from "@/types/concert"

export function useConcertFormLogic(concert?: Concert | null, isOpen?: boolean, onSave?: (concert: Partial<Concert>) => Promise<Concert | null>) {
  const [formData, setFormData] = useState<Partial<Concert>>({
    name: '',
    artist: '',
    genre: '',
    image: '',
    location: '',
    description: '',
    date: '',
    time: '',
    price: 0,
    offer: '',
    rating: 4.5,
    icon: 'Music',
    gallery_images: []
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (concert) {
      // Initialize gallery images with existing image as first item if gallery is empty
      let initialGalleryImages = concert.gallery_images || []
      
      // If we have an existing image but no gallery images, add the existing image as the first gallery image
      if (concert.image && (!initialGalleryImages || initialGalleryImages.length === 0)) {
        initialGalleryImages = [concert.image]
      }
      
      // If we have an existing image and gallery images, but the existing image is not in the gallery, add it as first
      if (concert.image && initialGalleryImages && initialGalleryImages.length > 0 && !initialGalleryImages.includes(concert.image)) {
        initialGalleryImages = [concert.image, ...initialGalleryImages]
      }

      setFormData({
        ...concert,
        gallery_images: initialGalleryImages
      })
    } else {
      setFormData({
        name: '',
        artist: '',
        genre: '',
        image: '',
        location: '',
        description: '',
        date: '',
        time: '',
        price: 0,
        offer: '',
        rating: 4.5,
        icon: 'Music',
        gallery_images: []
      })
    }
  }, [concert, isOpen])

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

      const result = await onSave(finalFormData)
      if (result) {
        onClose()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleImagesChange = (images: string[]) => {
    setFormData({ 
      ...formData, 
      gallery_images: images,
      // Update the main image with the first gallery image
      image: images.length > 0 ? images[0] : formData.image
    })
  }

  const updateFormData = (updates: Partial<Concert>) => {
    setFormData({ ...formData, ...updates })
  }

  return {
    formData,
    isLoading,
    handleSubmit,
    handleImagesChange,
    updateFormData
  }
}
