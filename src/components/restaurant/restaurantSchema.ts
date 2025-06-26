import { z } from "zod"

export const iconOptions = [
  { value: "utensils", label: "Couverts" },
  { value: "chef-hat", label: "Toque de chef" },
  { value: "wine", label: "Vin" },
  { value: "coffee", label: "Café" },  
  { value: "pizza", label: "Pizza" },
  { value: "fish", label: "Poisson" },
  { value: "soup", label: "Soupe" },
  { value: "cake", label: "Gâteau" },
  { value: "burger", label: "Burger" },
  { value: "salad", label: "Salade" },
  { value: "sandwich", label: "Sandwich" },
  { value: "pasta", label: "Pâtes" },
  { value: "dessert", label: "Dessert" },
  { value: "drink", label: "Boisson" },
  { value: "other", label: "Autre" }
]

export const restaurantTypes = [
  "Créole",
  "Haïtien",
  "Français",
  "Antillais",
  "Italien",
  "Japonais",
  "Chinois",
  "Indien",
  "Mexicain",
  "Méditerranéen",
  "Américain",
  "Thaï",
  "Libanais",
  "Marocain",
  "Végétarien",
  "Fruits de mer",
  "Grillades",
  "Pizzeria",
  "Brasserie",
  "Bistrot",
  "Gastronomique",
  "Fast-food",
  "Traditionnel",
  "Autre"
]


export const restaurantSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.string().min(1, "Le type est requis"),
  location: z.string().min(1, "L'emplacement est requis"),
  description: z.string().min(1, "La description est requise"),
  offer: z.string().optional(),
  icon: z.string().min(1, "L'icône est requise"),
  image: z.string().optional(),
  gallery_images: z.array(z.string()).optional(),
  rating: z.number().min(1).max(5),
  poids: z.number({ required_error: "Le poids est requis" }),
  menus: z.array(z.object({
    name: z.string().min(1, "Le nom de la section est requis"),
    items: z.array(z.object({
      name: z.string().min(1, "Le nom du plat est requis"),
      price: z.number({ required_error: "Le prix est requis" })
    }))
  })).optional()
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
  gallery_images?: string[]
  rating: number
  poids: number
  menus?: {
    name: string
    items: { name: string; price: number }[]
  }[]
}
