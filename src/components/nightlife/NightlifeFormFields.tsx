
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"
import { Checkbox } from "@/components/ui/checkbox"
import type { NightlifeEvent } from "@/types/nightlife"

interface NightlifeFormFieldsProps {
  formData: Partial<NightlifeEvent>
  onUpdateFormData: (updates: Partial<NightlifeEvent>) => void
  onImagesChange: (images: string[]) => void
}

export function NightlifeFormFields({ formData, onUpdateFormData, onImagesChange }: NightlifeFormFieldsProps) {
  const eventTypes = [
    'Club',
    'Soirée Club',
    'Concert Live',
    'DJ Set',
    'Soirée Thématique',
    'After Work',
    'Soirée Dansante',
    'Karaoke',
    'Comedy Show',
    'Autre'
  ]

  const availableFeatures = [
    'DJ Live',
    'Bar Premium',
    'Terrasse',
    'Climatisation',
    'Parking',
    'Service VIP',
    'Vestiaire',
    'Photobooth',
    'Écrans Géants',
    'Fumigènes'
  ]

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const currentFeatures = formData.features || []
    if (checked) {
      onUpdateFormData({ features: [...currentFeatures, feature] })
    } else {
      onUpdateFormData({ features: currentFeatures.filter(f => f !== feature) })
    }
  }

  console.log('NightlifeFormFields rendering with formData:', formData)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de l'événement *</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => onUpdateFormData({ name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue">Lieu *</Label>
          <Input
            id="venue"
            value={formData.venue || ''}
            onChange={(e) => onUpdateFormData({ venue: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type d'événement *</Label>
          <Select
            value={formData.type || ''}
            onValueChange={(value) => onUpdateFormData({ type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Note (sur 5) *</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating || ''}
            onChange={(e) => onUpdateFormData({ rating: parseFloat(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Images de l'événement</Label>
        <MultiImageUpload
          images={formData.gallery_images || []}
          onImagesChange={onImagesChange}
          bucketName="nightlife-images"
          maxImages={5}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            value={formData.date || ''}
            onChange={(e) => onUpdateFormData({ date: e.target.value })}
            placeholder="ex: 15 juillet 2024"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Heure *</Label>
          <Input
            id="time"
            value={formData.time || ''}
            onChange={(e) => onUpdateFormData({ time: e.target.value })}
            placeholder="ex: 20:00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Prix (€) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={formData.price || ''}
            onChange={(e) => onUpdateFormData({ price: parseFloat(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => onUpdateFormData({ description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="offer">Offre Club Créole *</Label>
        <Textarea
          id="offer"
          value={formData.offer || ''}
          onChange={(e) => onUpdateFormData({ offer: e.target.value })}
          rows={2}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Caractéristiques</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {availableFeatures.map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox
                id={feature}
                checked={(formData.features || []).includes(feature)}
                onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
              />
              <Label htmlFor={feature} className="text-sm">
                {feature}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
