
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, Star, MapPin } from "lucide-react"
import { Restaurant } from "./restaurantSchema"

interface RestaurantStatsProps {
  restaurants: Restaurant[]
}

export function RestaurantStats({ restaurants }: RestaurantStatsProps) {
  const averageRating = restaurants.length > 0 
    ? (restaurants.reduce((sum, restaurant) => sum + restaurant.rating, 0) / restaurants.length).toFixed(1)
    : "0.0"
  
  const uniqueTypes = new Set(restaurants.map(r => r.type)).size
  const fiveStarRestaurants = restaurants.filter(r => r.rating === 5).length

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
          <Utensils className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{restaurants.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRating}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Types de Cuisine</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueTypes}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Restaurants 5 Étoiles</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{fiveStarRestaurants}</div>
        </CardContent>
      </Card>
    </div>
  )
}
