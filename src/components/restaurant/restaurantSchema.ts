
import { z } from "zod"

export const restaurantSchema = z.object({
  name: z.string().min(1, "Le nom du restaurant est requis"),
  type: z.string().min(1, "Le type de cuisine est requis"),
  location: z.string().min(1, "La localisation est requise"),
  description: z.string().min(1, "La description est requise"),
  offer: z.string().optional(),
  icon: z.string().default("utensils"),
  image: z.string().optional(),
  rating: z.number().min(1).max(5).default(5)
})

export type RestaurantFormData = z.infer<typeof restaurantSchema>

export interface Restaurant {
  id: number
  name: string
  type: string
  location: string
  description: string
  offer: string
  icon: string
  image: string
  rating: number
}

export const restaurantTypes = [
  'Italien',
  'Français',
  'Asiatique',
  'Méditerranéen',
  'Fusion',
  'Traditionnel',
  'Fast Food',
  'Gastronomique',
  'Brasserie',
  'Pizzeria'
]

export const iconOptions = [
  { value: 'utensils', label: 'Couverts' },
  { value: 'chef-hat', label: 'Toque de chef' },
  { value: 'wine', label: 'Vin' },
  { value: 'coffee', label: 'Café' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'fish', label: 'Poisson' }
]
