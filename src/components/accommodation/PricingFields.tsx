
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { AccommodationFormData } from "./accommodationSchema"

interface PricingFieldsProps {
  control: Control<AccommodationFormData>
}

export function PricingFields({ control }: PricingFieldsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prix (€) *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                min="0" 
                placeholder="150" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Note (0-5) *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                max="5" 
                step="0.1" 
                placeholder="4.5" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="discount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Remise (%)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                max="100" 
                placeholder="10" 
                {...field}
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
