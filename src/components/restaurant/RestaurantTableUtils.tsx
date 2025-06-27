
import { ColumnDef } from "@tanstack/react-table"
import { Restaurant } from "./restaurantSchema"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

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
  poids: number
  menus?: {
    name: string
    items: { name: string; price: number }[]
  }[]
}

export const transformRestaurantsToTableData = (restaurants: Restaurant[]): RestaurantTableData[] => {
  return restaurants.map(restaurant => ({
    id: restaurant.id.toString(),
    name: restaurant.name,
    type: restaurant.type,
    location: restaurant.location,
    description: restaurant.description,
    offer: restaurant.offer,
    icon: restaurant.icon,
    image: restaurant.image,
    gallery_images: restaurant.gallery_images,
    rating: restaurant.rating,
    poids: restaurant.poids,
    menus: restaurant.menus // Inclure les menus dans les données de table
  }))
}

export const formatTableData = (restaurants: Restaurant[]) => {
  return restaurants.map(restaurant => ({
    id: restaurant.id.toString(),
    name: restaurant.name,
    type: <Badge variant="secondary">{restaurant.type}</Badge>,
    location: restaurant.location,
    rating: (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span>{restaurant.rating}</span>
      </div>
    ),
    poids: restaurant.poids,
    offer: <Badge variant="outline">{restaurant.offer || 'Aucune offre'}</Badge>,
    actions: restaurant.id.toString()
  }))
}

// Columns for DataTable component (different format)
export const dataTableColumns = [
  { key: "name", label: "Nom" },
  { key: "type", label: "Type" },
  { key: "location", label: "Localisation" },
  { key: "rating", label: "Note" },
  { key: "poids", label: "Poids" },
  { key: "offer", label: "Offre" },
]

// Columns for TanStack Table (existing format)
export const tableColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "type", 
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("type")}</Badge>
    ),
  },
  {
    accessorKey: "location",
    header: "Localisation",
  },
  {
    accessorKey: "rating",
    header: "Note",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span>{row.getValue("rating")}</span>
      </div>
    ),
  },
  {
    accessorKey: "poids",
    header: "Poids",
  },
  {
    accessorKey: "offer",
    header: "Offre",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("offer")}</Badge>
    ),
  },
]
