
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { Partner } from "@/hooks/usePartners"

export const formatPartnersForTable = (partners: Partner[]) => {
  return partners.map(partner => ({
    id: partner.id.toString(),
    business_name: partner.business_name,
    business_type: <Badge variant="secondary">{partner.business_type}</Badge>,
    location: partner.location || 'Non renseigné',
    rating: partner.rating ? (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span>{partner.rating}</span>
      </div>
    ) : 'Non noté',
    status: <Badge variant={partner.status === 'actif' ? 'default' : 'secondary'}>{partner.status}</Badge>,
    phone: partner.phone || 'Non renseigné',
    actions: partner.id.toString()
  }))
}

export const partnerTableColumns = [
  { key: "business_name", label: "Nom commercial" },
  { key: "business_type", label: "Type d'activité" },
  { key: "location", label: "Localisation" },
  { key: "rating", label: "Note" },
  { key: "status", label: "Statut" },
  { key: "phone", label: "Téléphone" },
]
