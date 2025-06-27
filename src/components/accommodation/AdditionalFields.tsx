
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, useFormContext } from "react-hook-form"
import { AccommodationFormData } from "./accommodationSchema"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"
import { AmenitiesManager } from "./AmenitiesManager"

interface AdditionalFieldsProps {
  control: Control<AccommodationFormData>
}

interface Amenity {
  name: string
  available: boolean
}

export function AdditionalFields({ control }: AdditionalFieldsProps) {
  const { setValue, getValues, watch } = useFormContext<AccommodationFormData>()
  
  // Surveiller les changements dans les champs image et gallery_images
  const currentImage = watch("image")
  const currentGalleryImages = watch("gallery_images")
  const currentAmenities = watch("amenities")

  const handleGalleryImagesChange = (images: string[]) => {
    // Mettre à jour les images de la galerie
    setValue("gallery_images", images)
    
    // Si le champ photo principale est vide et qu'il y a des images dans la galerie,
    // utiliser la première image de la galerie comme photo principale
    if (!currentImage && images.length > 0) {
      setValue("image", images[0])
    }
    
    // Si la photo principale actuelle n'est plus dans la galerie et qu'il y a d'autres images,
    // utiliser la première image disponible
    if (currentImage && !images.includes(currentImage) && images.length > 0) {
      setValue("image", images[0])
    }
    
    // Si la galerie est vide, vider aussi le champ photo principale
    if (images.length === 0) {
      setValue("image", "")
    }
  }

  const handleAmenitiesChange = (amenities: Amenity[]) => {
    setValue("amenities", amenities)
  }

  // Fonction pour convertir les données JSON en tableau d'objets Amenity
  const parseAmenities = (value: any): Amenity[] => {
    console.log("🔄 Parsing des amenities:", value)
    
    if (!value) return []
    
    if (typeof value === "string") {
      try {
        // Si c'est une chaîne JSON, essayer de la parser
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed)) {
          return parsed.map(item => ({
            name: typeof item === "object" && item.name ? String(item.name) : String(item),
            available: typeof item === "object" && typeof item.available === "boolean" ? item.available : true
          }))
        }
        // Si ce n'est pas un tableau après parsing, traiter comme une chaîne simple
        return value.split(",").map((item: string) => ({
          name: item.trim(),
          available: true
        })).filter((item: Amenity) => item.name)
      } catch {
        // Si le parsing JSON échoue, traiter comme une chaîne séparée par des virgules
        return value.split(",").map((item: string) => ({
          name: item.trim(),
          available: true
        })).filter((item: Amenity) => item.name)
      }
    }
    
    if (Array.isArray(value)) {
      return value.map(item => {
        if (typeof item === "object" && item !== null) {
          return {
            name: String(item.name || ""),
            available: typeof item.available === "boolean" ? item.available : true
          }
        }
        return {
          name: String(item),
          available: true
        }
      }).filter(item => item.name)
    }
    
    return []
  }

  // Fonction pour convertir les données JSON en chaîne de caractères (pour les autres champs)
  const convertJsonToString = (value: any): string => {
    console.log("🔄 Conversion des données JSON en chaîne:", value)
    if (typeof value === "string") {
      return value
    }
    if (!value) return ""
   
    if (Array.isArray(value)) {
      // Si c'est un tableau, mapper chaque élément en chaîne de caractères
      return value
        .map((item) => {
          if (typeof item === "string") {
            return item
          }

          if (item && typeof item === "object") {
            if ("name" in item) {
              // Gestion des objets du type { name: string, available: boolean }
              return String(item.name)
            }
            return Object.values(item).join(", ")
          }

          return String(item)
        })
        .join(", ")
    }
    if (typeof value === "object") {
      if ("name" in value) {
        return String(value.name)
      }
      return Object.values(value).join(", ")
    }
    return ""
  }

  return (
    <>
      <FormField
        control={control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Photo principale</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/image.jpg" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="gallery_images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Galerie d'images</FormLabel>
            <FormControl>
              <MultiImageUpload
                images={field.value || []}
                onImagesChange={handleGalleryImagesChange}
                bucketName="accommodation-images"
                maxImages={8}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="amenities"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <AmenitiesManager
                amenities={parseAmenities(field.value)}
                onAmenitiesChange={handleAmenitiesChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="features"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Caractéristiques (séparées par des virgules)</FormLabel>
            <FormControl>
              <Input 
                placeholder="Vue mer, Balcon, Jardin..." 
                {...field}
                value={convertJsonToString(field.value)}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="rules"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Règles (séparées par des virgules)</FormLabel>
            <FormControl>
              <Input 
                placeholder="Non-fumeur, Animaux interdits..." 
                {...field}
                value={convertJsonToString(field.value)}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
