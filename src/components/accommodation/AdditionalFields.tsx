
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, useFormContext } from "react-hook-form"
import { AccommodationFormData } from "./accommodationSchema"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"

interface AdditionalFieldsProps {
  control: Control<AccommodationFormData>
}

export function AdditionalFields({ control }: AdditionalFieldsProps) {
  const { setValue, getValues } = useFormContext<AccommodationFormData>()

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
                onImagesChange={(images) => {
                  field.onChange(images)
                  // Mettre à jour automatiquement l'image principale si elle n'est pas définie
                  const currentImage = getValues("image")
                  if (images.length > 0 && !currentImage) {
                    setValue("image", images[0])
                  }
                }}
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
