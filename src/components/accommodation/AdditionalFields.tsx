
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { AccommodationFormData } from "./accommodationSchema"

interface AdditionalFieldsProps {
  control: Control<AccommodationFormData>
}

export function AdditionalFields({ control }: AdditionalFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL de l'image</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/image.jpg" {...field} />
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
