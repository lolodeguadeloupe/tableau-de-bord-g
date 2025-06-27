
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"

interface PartnerImageSectionProps {
  formData: any
  onFieldChange: (field: string, value: any) => void
}

export function PartnerImageSection({ formData, onFieldChange }: PartnerImageSectionProps) {
  const handleMainImageChange = (url: string) => {
    onFieldChange('image', url)
  }

  const handleGalleryImagesChange = (images: string[]) => {
    onFieldChange('gallery_images', images)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Images</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Image principale</Label>
          <ImageUpload
            value={formData.image}
            onImageChange={handleMainImageChange}
            bucketName="partner-images"
            className="w-full"
          />
        </div>

        <div>
          <Label>Galerie d'images</Label>
          <MultiImageUpload
            images={formData.gallery_images || []}
            onImagesChange={handleGalleryImagesChange}
            bucketName="partner-images"
            maxImages={8}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
