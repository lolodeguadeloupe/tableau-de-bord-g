import { Label } from "@/components/ui/label"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"
import { RestaurantFormData } from "./restaurantSchema"

interface ImageUploadSectionProps {
  formData: RestaurantFormData
  onFieldChange: (field: string, value: string | number | string[]) => void
}

export function ImageUploadSection({ formData, onFieldChange }: ImageUploadSectionProps) {
  const handleImagesChange = (images: string[]) => {
    // La première image devient l'image principale
    if (images.length > 0) {
      onFieldChange('image', images[0])
      onFieldChange('gallery_images', images)
    } else {
      onFieldChange('image', '')
      onFieldChange('gallery_images', [])
    }
  }

  return (
    <div className="space-y-4">
      <Label>Images du restaurant</Label>
      <MultiImageUpload
        images={formData.gallery_images || []}
        onImagesChange={handleImagesChange}
        bucketName="restaurant-images"
        maxImages={8}
        className="w-full"
      />
    </div>
  )
}
