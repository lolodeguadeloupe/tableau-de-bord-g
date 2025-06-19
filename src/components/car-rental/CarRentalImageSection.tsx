
import { Label } from "@/components/ui/label"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"

interface CarRentalCompany {
  id?: number
  name: string
  type: string
  image: string
  location: string
  description: string
  rating: number
  offer: string
  icon_name: string
  gallery_images?: string[]
}

interface CarRentalImageSectionProps {
  formData: CarRentalCompany
  onImagesChange: (images: string[]) => void
}

export function CarRentalImageSection({ formData, onImagesChange }: CarRentalImageSectionProps) {
  // Convertir gallery_images en tableau d'URLs pour le composant MultiImageUpload
  const getImagesArray = (): string[] => {
    const galleryImages = Array.isArray(formData.gallery_images) 
      ? formData.gallery_images as string[] 
      : []
    
    // Si on a une image principale et qu'elle n'est pas déjà dans la galerie
    if (formData.image && !galleryImages.includes(formData.image)) {
      // Mettre l'image principale en premier
      return [formData.image, ...galleryImages]
    }
    
    // Si l'image principale est déjà dans la galerie, s'assurer qu'elle soit en premier
    if (formData.image && galleryImages.includes(formData.image)) {
      const filteredGallery = galleryImages.filter(img => img !== formData.image)
      return [formData.image, ...filteredGallery]
    }
    
    // Si pas d'image principale, retourner juste la galerie
    return galleryImages
  }

  return (
    <div className="grid gap-2">
      <Label>Images de la compagnie</Label>
      <MultiImageUpload
        images={getImagesArray()}
        onImagesChange={onImagesChange}
        bucketName="car-rental-images"
        maxImages={5}
      />
      <p className="text-sm text-gray-500">
        La première image sera utilisée comme photo principale de la compagnie.
      </p>
    </div>
  )
}
