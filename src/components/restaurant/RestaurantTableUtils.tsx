
import { Star, Utensils } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Restaurant } from "./restaurantSchema"

export interface RestaurantTableData extends Omit<Restaurant, 'id'> {
  id: string
  rating_display: JSX.Element
  image_preview: JSX.Element
  type_badge: JSX.Element
}

export const getRatingStars = (rating: number) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
    </div>
  )
}

export const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    'italien': 'bg-red-100 text-red-800',
    'français': 'bg-blue-100 text-blue-800',
    'asiatique': 'bg-green-100 text-green-800',
    'méditerranéen': 'bg-orange-100 text-orange-800',
    'fusion': 'bg-purple-100 text-purple-800',
    'traditionnel': 'bg-yellow-100 text-yellow-800',
  }
  return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

export const transformRestaurantsToTableData = (restaurants: Restaurant[]): RestaurantTableData[] => {
  return restaurants.map(restaurant => ({
    ...restaurant,
    id: restaurant.id.toString(),
    rating_display: getRatingStars(restaurant.rating),
    image_preview: restaurant.image ? (
      <img src={restaurant.image} alt={restaurant.name} className="w-12 h-12 object-cover rounded" />
    ) : (
      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
        <Utensils className="h-4 w-4 text-gray-400" />
      </div>
    ),
    type_badge: (
      <Badge className={getTypeColor(restaurant.type)}>
        {restaurant.type}
      </Badge>
    )
  }))
}

export const tableColumns = [
  { key: 'image_preview', label: 'Image' },
  { key: 'name', label: 'Nom' },
  { key: 'type_badge', label: 'Type' },
  { key: 'location', label: 'Lieu' },
  { key: 'rating_display', label: 'Note' },
  { key: 'offer', label: 'Offre' }
]
