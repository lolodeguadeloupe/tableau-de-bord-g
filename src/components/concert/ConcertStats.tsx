
import { Music, Calendar, MapPin, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Concert } from "@/types/concert"

interface ConcertStatsProps {
  concerts: Concert[]
}

export function ConcertStats({ concerts }: ConcertStatsProps) {
  const totalConcerts = concerts.length
  const averagePrice = concerts.length > 0 
    ? Math.round(concerts.reduce((sum, concert) => sum + Number(concert.price), 0) / concerts.length)
    : 0
  const averageRating = concerts.length > 0 
    ? (concerts.reduce((sum, concert) => sum + Number(concert.rating), 0) / concerts.length).toFixed(1)
    : '0.0'
  const uniqueGenres = new Set(concerts.map(concert => concert.genre)).size

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Concerts</CardTitle>
          <Music className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalConcerts}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prix Moyen</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averagePrice}€</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRating}/5</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Genres Musicaux</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueGenres}</div>
        </CardContent>
      </Card>
    </div>
  )
}
