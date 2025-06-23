
import * as z from "zod"

// Interface pour les équipements avec disponibilité
export interface Amenity {
  name: string
  available: boolean
}

export const accommodationSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.string().min(1, "Le type est requis"),
  location: z.string().min(1, "Le lieu est requis"),
  description: z.string().min(1, "La description est requise"),
  price: z.number().min(0.01, "Le prix doit être supérieur à 0"),
  rating: z.number().min(0, "La note doit être positive").max(5, "La note ne peut pas dépasser 5"),
  rooms: z.number().int().min(1, "Au moins 1 chambre requise"),
  bathrooms: z.number().int().min(1, "Au moins 1 salle de bain requise"),
  max_guests: z.number().int().min(1, "Au moins 1 invité autorisé"),
  image: z.string().optional(),
  discount: z.number().int().min(0).max(100).optional(),
  amenities: z.array(z.object({
    name: z.string(),
    available: z.boolean()
  })).optional(),
  features: z.string().optional(),
  rules: z.string().optional(),
  gallery_images: z.array(z.string()).optional(),
})

export type AccommodationFormData = z.infer<typeof accommodationSchema>
