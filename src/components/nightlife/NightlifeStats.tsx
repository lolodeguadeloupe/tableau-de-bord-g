
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Star, Euro } from "lucide-react"
import type { NightlifeEvent } from "@/types/nightlife"

interface NightlifeStatsProps {
  events: NightlifeEvent[]
}

export function NightlifeStats({ events }: NightlifeStatsProps) {
  const totalEvents = events.length
  const averagePrice = events.length > 0 
    ? (events.reduce((sum, event) => sum + event.price, 0) / events.length).toFixed(2)
    : '0'
  const averageRating = events.length > 0
    ? (events.reduce((sum, event) => sum + event.rating, 0) / events.length).toFixed(1)
    : '0'
  const uniqueVenues = new Set(events.map(event => event.venue)).size

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Événements</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEvents}</div>
          <p className="text-xs text-muted-foreground">
            événements programmés
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lieux Uniques</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueVenues}</div>
          <p className="text-xs text-muted-foreground">
            venues différents
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prix Moyen</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averagePrice}€</div>
          <p className="text-xs text-muted-foreground">
            prix moyen d'entrée
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRating}/5</div>
          <p className="text-xs text-muted-foreground">
            note moyenne
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
