
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PartnerBasicFieldsProps {
  formData: any
  onFieldChange: (field: string, value: any) => void
}

export function PartnerBasicFields({ formData, onFieldChange }: PartnerBasicFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="business_name">Nom commercial *</Label>
          <Input
            id="business_name"
            value={formData.business_name}
            onChange={(e) => onFieldChange('business_name', e.target.value)}
            placeholder="Nom de l'entreprise"
            required
          />
        </div>

        <div>
          <Label htmlFor="business_type">Type d'activité *</Label>
          <Select value={formData.business_type} onValueChange={(value) => onFieldChange('business_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="hotel">Hôtel</SelectItem>
              <SelectItem value="car_rental">Location de voiture</SelectItem>
              <SelectItem value="activity">Activité de loisir</SelectItem>
              <SelectItem value="travel">Agence de voyage</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Catégorie</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => onFieldChange('type', e.target.value)}
            placeholder="Ex: Cuisine française, Hôtel 4 étoiles"
          />
        </div>

        <div>
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status} onValueChange={(value) => onFieldChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="inactif">Inactif</SelectItem>
              <SelectItem value="suspendu">Suspendu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          placeholder="Description du partenaire"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="offer">Offre spéciale</Label>
          <Input
            id="offer"
            value={formData.offer}
            onChange={(e) => onFieldChange('offer', e.target.value)}
            placeholder="Ex: -20% sur la première réservation"
          />
        </div>

        <div>
          <Label htmlFor="rating">Note (sur 5)</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => onFieldChange('rating', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  )
}
