
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"

interface ImageUploadSectionProps {
  formData: {
    image: string
    gallery_images: string[]
  }
  onUpdate: (updates: any) => void
}

export function ImageUploadSection({ formData, onUpdate }: ImageUploadSectionProps) {
  const handleImageChange = (url: string) => {
    onUpdate({ image: url })
  }

  const handleGalleryImagesChange = (images: string[]) => {
    onUpdate({ gallery_images: images })
  }

  return (
    <>
      <div className="space-y-2">
        <Label>Photo principale</Label>
        <ImageUpload
          value={formData.image}
          onImageChange={handleImageChange}
          bucketName="voyance-images"
        />
      </div>

      <div className="space-y-2">
        <Label>Galerie d'images</Label>
        <MultiImageUpload
          images={formData.gallery_images}
          onImagesChange={handleGalleryImagesChange}
          bucketName="voyance-images"
          maxImages={6}
        />
      </div>
    </>
  )
}
