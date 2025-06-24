
import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CarModel } from "@/hooks/useCarRentalActions"

interface CarModelTechnicalFieldsProps {
  formData: Partial<CarModel>
  onFieldChange: (field: keyof CarModel, value: any) => void
}

export function CarModelTechnicalFields({ formData, onFieldChange }: CarModelTechnicalFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="seats">Nombre de places</Label>
        <Input
          id="seats"
          type="number"
          min="2"
          max="9"
          value={formData.seats || 5}
          onChange={(e) => onFieldChange('seats', parseInt(e.target.value))}
        />
      </div>
      
      <div>
        <Label htmlFor="transmission">Transmission</Label>
        <Select value={formData.transmission || 'Automatique'} onValueChange={(value) => onFieldChange('transmission', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner la transmission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Automatique">Automatique</SelectItem>
            <SelectItem value="Manuelle">Manuelle</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
