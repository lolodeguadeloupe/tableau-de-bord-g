
import { ColumnDef } from "@tanstack/react-table"
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
  return restaurants.map((restaurant) => ({
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
}

export const tableColumns: ColumnDef<RestaurantTableData>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const restaurant = row.original
      const imageUrl = restaurant.image || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=center"
      const galleryCount = restaurant.gallery_images?.length || 0
      
      return (
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
      )
    },
  },
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("type")}</Badge>
    ),
  },
  {
    accessorKey: "location",
    header: "Emplacement",
  },
  {
    accessorKey: "rating",
    header: "Note",
    cell: ({ row }) => {
      const rating = parseFloat(row.getValue("rating"))
      return (
        <div className="flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1">{rating.toFixed(1)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "offer",
    header: "Offre",
    cell: ({ row }) => {
      const offer = row.getValue("offer") as string
      return offer ? (
        <Badge className="bg-green-100 text-green-800">{offer}</Badge>
      ) : (
        <span className="text-gray-400">Aucune</span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const restaurant = row.original
      const meta = table.options.meta as {
        onEdit?: (restaurant: RestaurantTableData) => void
        onDelete?: (id: string) => void
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => meta?.onEdit?.(restaurant)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => meta?.onDelete?.(restaurant.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
