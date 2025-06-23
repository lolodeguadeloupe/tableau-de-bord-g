
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, X } from "lucide-react"
import type { TravelOffer } from "@/types/travel"

interface TravelFormFieldsProps {
  formData: Partial<TravelOffer>
  onUpdateFormData: (field: string, value: any) => void
  onImagesChange: (images: string[]) => void
}

export function TravelFormFields({ formData, onUpdateFormData, onImagesChange }: TravelFormFieldsProps) {
  const addInclusion = () => {
    const newInclusions = [...(formData.inclusions || []), '']
    onUpdateFormData('inclusions', newInclusions)
  }

  const removeInclusion = (index: number) => {
    const newInclusions = (formData.inclusions || []).filter((_, i) => i !== index)
    onUpdateFormData('inclusions', newInclusions)
  }

  const updateInclusion = (index: number, value: string) => {
    const newInclusions = [...(formData.inclusions || [])]
    newInclusions[index] = value
    onUpdateFormData('inclusions', newInclusions)
  }

  const addExclusion = () => {
    const newExclusions = [...(formData.exclusions || []), '']
    onUpdateFormData('exclusions', newExclusions)
  }

  const removeExclusion = (index: number) => {
    const newExclusions = (formData.exclusions || []).filter((_, i) => i !== index)
    onUpdateFormData('exclusions', newExclusions)
  }

  const updateExclusion = (index: number, value: string) => {
    const newExclusions = [...(formData.exclusions || [])]
    newExclusions[index] = value
    onUpdateFormData('exclusions', newExclusions)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Informations de base */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titre de l'offre *</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => onUpdateFormData('title', e.target.value)}
            placeholder="Ex: Escapade aux Seychelles"
            required
          />
        </div>

        <div>
          <Label htmlFor="destination">Destination *</Label>
          <Input
            id="destination"
            value={formData.destination || ''}
            onChange={(e) => onUpdateFormData('destination', e.target.value)}
            placeholder="Ex: Mahé, Seychelles"
            required
          />
        </div>

        <div>
          <Label htmlFor="departure_location">Lieu de départ *</Label>
          <Input
            id="departure_location"
            value={formData.departure_location || ''}
            onChange={(e) => onUpdateFormData('departure_location', e.target.value)}
            placeholder="Ex: Paris CDG"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration_days">Durée (jours) *</Label>
            <Input
              id="duration_days"
              type="number"
              min="1"
              value={formData.duration_days || ''}
              onChange={(e) => onUpdateFormData('duration_days', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Prix (€) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => onUpdateFormData('price', parseFloat(e.target.value) || 0)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="departure_date">Date de départ</Label>
            <Input
              id="departure_date"
              type="date"
              value={formData.departure_date || ''}
              onChange={(e) => onUpdateFormData('departure_date', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="return_date">Date de retour</Label>
            <Input
              id="return_date"
              type="date"
              value={formData.return_date || ''}
              onChange={(e) => onUpdateFormData('return_date', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="max_participants">Nombre maximum de participants</Label>
          <Input
            id="max_participants"
            type="number"
            min="1"
            value={formData.max_participants || 20}
            onChange={(e) => onUpdateFormData('max_participants', parseInt(e.target.value) || 20)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active !== false}
            onCheckedChange={(checked) => onUpdateFormData('is_active', checked)}
          />
          <Label htmlFor="is_active">Offre active</Label>
        </div>
      </div>

      {/* Images et description */}
      <div className="space-y-4">
        <div>
          <Label>Image principale</Label>
          <ImageUpload
            value={formData.image || ''}
            onImageChange={(url) => onUpdateFormData('image', url)}
            bucketName="travel-images"
          />
        </div>

        <div>
          <Label>Galerie d'images</Label>
          <MultiImageUpload
            images={formData.gallery_images || []}
            onImagesChange={onImagesChange}
            bucketName="travel-images"
            maxImages={8}
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => onUpdateFormData('description', e.target.value)}
            placeholder="Décrivez votre offre de voyage..."
            rows={4}
            required
          />
        </div>
      </div>

      {/* Inclusions et exclusions */}
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Inclusions</Label>
            <Button type="button" variant="outline" size="sm" onClick={addInclusion}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
          <div className="space-y-2">
            {(formData.inclusions || []).map((inclusion, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={inclusion}
                  onChange={(e) => updateInclusion(index, e.target.value)}
                  placeholder="Ex: Transport aéroport"
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
            {(formData.inclusions || []).length === 0 && (
              <p className="text-sm text-gray-500">Aucune inclusion ajoutée</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Exclusions</Label>
            <Button type="button" variant="outline" size="sm" onClick={addExclusion}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
          <div className="space-y-2">
            {(formData.exclusions || []).map((exclusion, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={exclusion}
                  onChange={(e) => updateExclusion(index, e.target.value)}
                  placeholder="Ex: Repas non mentionnés"
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
            {(formData.exclusions || []).length === 0 && (
              <p className="text-sm text-gray-500">Aucune exclusion ajoutée</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
