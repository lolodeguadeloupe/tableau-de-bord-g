
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ContactPricingFieldsProps {
  formData: {
    price_per_session: number
    location: string
    contact_email: string
    contact_phone: string
    contact_whatsapp: string
  }
  onUpdate: (updates: any) => void
}

export function ContactPricingFields({ formData, onUpdate }: ContactPricingFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price_per_session">Prix par séance (€)</Label>
          <Input
            id="price_per_session"
            type="number"
            value={formData.price_per_session}
            onChange={(e) => onUpdate({ price_per_session: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact_email">Email de contact</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => onUpdate({ contact_email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_phone">Téléphone</Label>
          <Input
            id="contact_phone"
            value={formData.contact_phone}
            onChange={(e) => onUpdate({ contact_phone: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_whatsapp">WhatsApp (optionnel)</Label>
        <Input
          id="contact_whatsapp"
          value={formData.contact_whatsapp}
          onChange={(e) => onUpdate({ contact_whatsapp: e.target.value })}
          placeholder="+33 6 12 34 56 78"
        />
      </div>
    </>
  )
}
