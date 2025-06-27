
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Restaurant } from "./restaurantSchema"

export interface RestaurantTableData {
  id: string
  name: string
  type: string
  location: string
  description: string
  offer: string
  icon: string
  image: string
  gallery_images?: string[]
  rating: number
}

export function transformRestaurantsToTableData(restaurants: Restaurant[]): RestaurantTableData[] {
  console.log('🔄 RestaurantTableUtils - restaurants avant transformation:', restaurants)
  if (restaurants.length > 0) {
    console.log('📋 Menus du premier restaurant avant transformation:', restaurants[0].menus)
  }
  
  const transformed = restaurants.map((restaurant) => ({
    id: restaurant.id.toString(),
    name: restaurant.name,
    type: restaurant.type,
    location: restaurant.location,
    description: restaurant.description,
    offer: restaurant.offer,
    icon: restaurant.icon,
    image: restaurant.image,
    gallery_images: restaurant.gallery_images || [],
    rating: restaurant.rating,
  }))
  
  console.log('🔄 RestaurantTableUtils - données après transformation:', transformed)
  console.log('⚠️ ATTENTION: Les menus ont été supprimés dans la transformation!')
  
  return transformed
}

export const tableColumns = [
  {
    key: "image",
    label: "Image",
  },
  {
    key: "name", 
    label: "Nom",
  },
  {
    key: "type",
    label: "Type",
  },
  {
    key: "location",
    label: "Emplacement",
  },
  {
    key: "rating",
    label: "Note",
  },
  {
    key: "offer",
    label: "Offre",
  },
]

export function formatTableData(restaurants: Restaurant[]) {
  return restaurants.map((restaurant) => {
    const imageUrl = restaurant.image || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=center"
    const galleryCount = restaurant.gallery_images?.length || 0
    
    return {
      id: restaurant.id.toString(),
      image: (
        <div className="relative">
          <img
            src={imageUrl}
            alt={restaurant.name}
            className="w-12 h-12 rounded object-cover"
          />
          {galleryCount > 1 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 text-xs h-5 w-5 p-0 flex items-center justify-center"
            >
              +{galleryCount - 1}
            </Badge>
          )}
        </div>
      ),
      name: restaurant.name,
      type: <Badge variant="outline">{restaurant.type}</Badge>,
      location: restaurant.location,
      rating: (
        <div className="flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1">{restaurant.rating.toFixed(1)}</span>
        </div>
      ),
      offer: restaurant.offer ? (
        <Badge className="bg-green-100 text-green-800">{restaurant.offer}</Badge>
      ) : (
        <span className="text-gray-400">Aucune</span>
      ),
    }
  })
}
