
import React from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CarModel } from "@/hooks/useCarRentalActions"

interface CarModelStatusFieldsProps {
  formData: Partial<CarModel>
  onFieldChange: (field: keyof CarModel, value: any) => void
}

export function CarModelStatusFields({ formData, onFieldChange }: CarModelStatusFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="air_con"
          checked={formData.air_con ?? true}
          onCheckedChange={(checked) => onFieldChange('air_con', checked)}
        />
        <Label htmlFor="air_con">Climatisation</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active ?? true}
          onCheckedChange={(checked) => onFieldChange('is_active', checked)}
        />
        <Label htmlFor="is_active">Actif</Label>
      </div>
    </div>
  )
}
