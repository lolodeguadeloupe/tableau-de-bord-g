
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Control } from "react-hook-form"
import { AccommodationFormData } from "./accommodationSchema"

interface BasicInfoFieldsProps {
  control: Control<AccommodationFormData>
}

export function BasicInfoFields({ control }: BasicInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom *</FormLabel>
              <FormControl>
                <Input placeholder="Villa Paradis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="appartement">Appartement</SelectItem>
                  <SelectItem value="maison">Maison</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="resort">Resort</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lieu *</FormLabel>
            <FormControl>
              <Input placeholder="Paris, France" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Description de l'hébergement..."
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
