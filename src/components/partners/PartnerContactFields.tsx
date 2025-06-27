
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PartnerContactFieldsProps {
  formData: any
  onFieldChange: (field: string, value: any) => void
}

export function PartnerContactFields({ formData, onFieldChange }: PartnerContactFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations de contact</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => onFieldChange('address', e.target.value)}
            placeholder="Adresse complète"
          />
        </div>

        <div>
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onFieldChange('location', e.target.value)}
            placeholder="Ville, région"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onFieldChange('phone', e.target.value)}
            placeholder="Numéro de téléphone"
          />
        </div>

        <div>
          <Label htmlFor="website">Site web</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => onFieldChange('website', e.target.value)}
            placeholder="https://exemple.com"
          />
        </div>
      </div>
    </div>
  )
}
