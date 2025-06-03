
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { AccommodationFormData } from "./accommodationSchema"

interface CapacityFieldsProps {
  control: Control<AccommodationFormData>
}

export function CapacityFields({ control }: CapacityFieldsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <FormField
        control={control}
        name="rooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chambres *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1" 
                placeholder="2" 
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="bathrooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salles de bain *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1" 
                placeholder="1" 
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="max_guests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Invités max *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1" 
                placeholder="4" 
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
