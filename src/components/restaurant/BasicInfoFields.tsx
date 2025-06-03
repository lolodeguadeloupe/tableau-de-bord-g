
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RestaurantFormData, restaurantTypes } from "./restaurantSchema"

interface BasicInfoFieldsProps {
  formData: RestaurantFormData
  onFieldChange: (field: string, value: string | number) => void
}

export function BasicInfoFields({ formData, onFieldChange }: BasicInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du restaurant *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
            placeholder="Nom du restaurant"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type de cuisine *</Label>
          <Select value={formData.type} onValueChange={(value) => onFieldChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              {restaurantTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Localisation *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onFieldChange('location', e.target.value)}
            placeholder="Adresse ou ville"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Note (1-5) *</Label>
          <Select value={formData.rating.toString()} onValueChange={(value) => onFieldChange('rating', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating} étoile{rating > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          placeholder="Description du restaurant..."
          required
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="offer">Offre spéciale</Label>
        <Input
          id="offer"
          value={formData.offer || ''}
          onChange={(e) => onFieldChange('offer', e.target.value)}
          placeholder="Ex: -20% sur le menu, Menu découverte..."
        />
      </div>
    </>
  )
}
