
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TravelFormFieldsProps {
  formData: {
    title: string
    destination: string
    departure_location: string
    duration_days: number
    price: number
    departure_date: string
    return_date: string
    description: string
    image: string
    gallery_images: string[]
    inclusions: string[]
    exclusions: string[]
    max_participants: number
    is_active: boolean
  }
  onUpdateFormData: (field: string, value: any) => void
  onImagesChange: (images: string[]) => void
}

export function TravelFormFields({ formData, onUpdateFormData, onImagesChange }: TravelFormFieldsProps) {
  const handleInclusionChange = (index: number, value: string) => {
    const newInclusions = [...formData.inclusions]
    newInclusions[index] = value
    onUpdateFormData('inclusions', newInclusions)
  }

  const addInclusion = () => {
    onUpdateFormData('inclusions', [...formData.inclusions, ''])
  }

  const removeInclusion = (index: number) => {
    const newInclusions = formData.inclusions.filter((_, i) => i !== index)
    onUpdateFormData('inclusions', newInclusions)
  }

  const handleExclusionChange = (index: number, value: string) => {
    const newExclusions = [...formData.exclusions]
    newExclusions[index] = value
    onUpdateFormData('exclusions', newExclusions)
  }

  const addExclusion = () => {
    onUpdateFormData('exclusions', [...formData.exclusions, ''])
  }

  const removeExclusion = (index: number) => {
    const newExclusions = formData.exclusions.filter((_, i) => i !== index)
    onUpdateFormData('exclusions', newExclusions)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titre du voyage</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onUpdateFormData('title', e.target.value)}
            placeholder="Ex: Découverte de la Martinique"
          />
        </div>

        <div>
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            value={formData.destination}
            onChange={(e) => onUpdateFormData('destination', e.target.value)}
            placeholder="Ex: Martinique"
          />
        </div>

        <div>
          <Label htmlFor="departure_location">Lieu de départ</Label>
          <Input
            id="departure_location"
            value={formData.departure_location}
            onChange={(e) => onUpdateFormData('departure_location', e.target.value)}
            placeholder="Ex: Paris CDG"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration_days">Durée (jours)</Label>
            <Input
              id="duration_days"
              type="number"
              value={formData.duration_days}
              onChange={(e) => onUpdateFormData('duration_days', parseInt(e.target.value) || 0)}
              min="1"
            />
          </div>
          <div>
            <Label htmlFor="price">Prix (€)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => onUpdateFormData('price', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="departure_date">Date de départ</Label>
            <Input
              id="departure_date"
              type="date"
              value={formData.departure_date}
              onChange={(e) => onUpdateFormData('departure_date', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="return_date">Date de retour</Label>
            <Input
              id="return_date"
              type="date"
              value={formData.return_date}
              onChange={(e) => onUpdateFormData('return_date', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="max_participants">Nombre max de participants</Label>
          <Input
            id="max_participants"
            type="number"
            value={formData.max_participants}
            onChange={(e) => onUpdateFormData('max_participants', parseInt(e.target.value) || 20)}
            min="1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => onUpdateFormData('is_active', checked)}
          />
          <Label htmlFor="is_active">Offre active</Label>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onUpdateFormData('description', e.target.value)}
            placeholder="Décrivez l'offre de voyage..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Photo principale</Label>
          <ImageUpload
            value={formData.image}
            onImageChange={(url) => onUpdateFormData('image', url)}
            bucketName="travel-images"
          />
        </div>

        <div className="space-y-2">
          <Label>Galerie d'images</Label>
          <MultiImageUpload
            images={formData.gallery_images}
            onImagesChange={onImagesChange}
            bucketName="travel-images"
            maxImages={6}
          />
        </div>

        <div className="space-y-2">
          <Label>Inclusions</Label>
          {formData.inclusions.map((inclusion, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={inclusion}
                onChange={(e) => handleInclusionChange(index, e.target.value)}
                placeholder="Ex: Vol aller-retour"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeInclusion(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addInclusion}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une inclusion
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Exclusions</Label>
          {formData.exclusions.map((exclusion, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={exclusion}
                onChange={(e) => handleExclusionChange(index, e.target.value)}
                placeholder="Ex: Repas non inclus"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeExclusion(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExclusion}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une exclusion
          </Button>
        </div>
      </div>
    </div>
  )
}
