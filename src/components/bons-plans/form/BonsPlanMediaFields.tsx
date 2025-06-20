
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/ImageUpload"

interface BonsPlanMediaFieldsProps {
  formData: {
    icon: string
    image: string
  }
  setFormData: (updater: (prev: any) => any) => void
}

export function BonsPlanMediaFields({ formData, setFormData }: BonsPlanMediaFieldsProps) {
  return (
    <>
      <div>
        <Label htmlFor="icon">Icône</Label>
        <Select 
          value={formData.icon} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="star">Étoile</SelectItem>
            <SelectItem value="tag">Tag</SelectItem>
            <SelectItem value="gift">Cadeau</SelectItem>
            <SelectItem value="percent">Pourcentage</SelectItem>
            <SelectItem value="fire">Feu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Image</Label>
        <ImageUpload
          value={formData.image}
          onImageChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
          bucketName="voyance-images"
        />
      </div>
    </>
  )
}
