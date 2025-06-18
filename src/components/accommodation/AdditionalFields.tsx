
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, useFormContext } from "react-hook-form"
import { AccommodationFormData } from "./accommodationSchema"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"

interface AdditionalFieldsProps {
  control: Control<AccommodationFormData>
}

export function AdditionalFields({ control }: AdditionalFieldsProps) {
  const { setValue, getValues, watch } = useFormContext<AccommodationFormData>()
  
  // Surveiller les changements dans les champs image et gallery_images
  const currentImage = watch("image")
  const currentGalleryImages = watch("gallery_images")

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
            <FormLabel>Équipements (séparés par des virgules)</FormLabel>
            <FormControl>
              <Input placeholder="WiFi, Climatisation, Piscine..." {...field} />
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
              <Input placeholder="Vue mer, Balcon, Jardin..." {...field} />
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
              <Input placeholder="Non-fumeur, Animaux interdits..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
