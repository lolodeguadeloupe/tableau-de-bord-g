
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge, Eye, EyeOff, Tag } from "lucide-react"
import type { Promotion } from "@/hooks/usePromotionActions"

interface PromotionStatsProps {
  promotions: Promotion[]
}

export function PromotionStats({ promotions }: PromotionStatsProps) {
  const totalPromotions = promotions.length
  const activePromotions = promotions.filter(p => p.is_active).length
  const inactivePromotions = totalPromotions - activePromotions
  const promotionsWithBadge = promotions.filter(p => p.badge && p.badge.trim()).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Promotions</CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPromotions}</div>
          <p className="text-xs text-muted-foreground">
            Toutes les promotions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promotions Actives</CardTitle>
          <Eye className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activePromotions}</div>
          <p className="text-xs text-muted-foreground">
            Visibles sur le site
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promotions Masquées</CardTitle>
          <EyeOff className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{inactivePromotions}</div>
          <p className="text-xs text-muted-foreground">
            Non visibles
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avec Badge</CardTitle>
          <Badge className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{promotionsWithBadge}</div>
          <p className="text-xs text-muted-foreground">
            Promotions avec badge
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
