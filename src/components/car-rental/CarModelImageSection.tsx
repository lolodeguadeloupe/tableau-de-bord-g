
import React from "react"
import { Label } from "@/components/ui/label"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"
import { CarModel } from "@/hooks/useCarRentalActions"

interface CarModelImageSectionProps {
  formData: CarModel
  onImagesChange: (images: string[]) => void
}

export function CarModelImageSection({ formData, onImagesChange }: CarModelImageSectionProps) {
  // Convert gallery_images to array for MultiImageUpload component
  const getImagesArray = (): string[] => {
    const galleryImages = Array.isArray(formData.gallery_images) 
      ? formData.gallery_images as string[] 
      : []
    
    // If we have a main image and it's not already in the gallery
    if (formData.image && !galleryImages.includes(formData.image)) {
      // Put the main image first
      return [formData.image, ...galleryImages]
    }
    
    // If the main image is already in the gallery, ensure it's first
    if (formData.image && galleryImages.includes(formData.image)) {
      const filteredGallery = galleryImages.filter(img => img !== formData.image)
      return [formData.image, ...filteredGallery]
    }
    
    // If no main image, return just the gallery
    return galleryImages
  }

  return (
    <div className="grid gap-2">
      <Label>Images du modèle</Label>
      <MultiImageUpload
        images={getImagesArray()}
        onImagesChange={onImagesChange}
        bucketName="car-model-images"
        maxImages={5}
      />
      <p className="text-sm text-gray-500">
        La première image sera utilisée comme photo principale du modèle.
      </p>
    </div>
  )
}
