
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building, Star, CheckCircle } from "lucide-react"
import { Partner } from "@/hooks/usePartners"

interface PartnerStatsProps {
  partners: Partner[]
}

export function PartnerStats({ partners }: PartnerStatsProps) {
  const totalPartners = partners.length
  const activePartners = partners.filter(p => p.status === 'actif').length
  const averageRating = partners.length > 0 
    ? partners.reduce((sum, p) => sum + (p.rating || 0), 0) / partners.length 
    : 0
  const businessTypes = new Set(partners.map(p => p.business_type)).size

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total partenaires</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPartners}</div>
          <p className="text-xs text-muted-foreground">
            Partenaires enregistrés
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Partenaires actifs</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activePartners}</div>
          <p className="text-xs text-muted-foreground">
            Partenaires en activité
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            Sur 5 étoiles
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Types d'activité</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{businessTypes}</div>
          <p className="text-xs text-muted-foreground">
            Secteurs différents
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
