
import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CarModel, CarRentalCompany } from "@/hooks/useCarRentalActions"

interface CarModelBasicFieldsProps {
  formData: Partial<CarModel>
  companies: CarRentalCompany[]
  onFieldChange: (field: keyof CarModel, value: any) => void
}

export function CarModelBasicFields({ formData, companies, onFieldChange }: CarModelBasicFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nom du modèle *</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => onFieldChange('name', e.target.value)}
            placeholder="Ex: BMW X3, Peugeot 308"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="company_id">Compagnie *</Label>
          <Select 
            value={formData.company_id || ''} 
            onValueChange={(value) => onFieldChange('company_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la compagnie" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.business_name || company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price_per_day">Prix par jour (€) *</Label>
          <Input
            id="price_per_day"
            type="number"
            min="0"
            value={formData.price_per_day || 0}
            onChange={(e) => onFieldChange('price_per_day', parseInt(e.target.value))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="category">Catégorie *</Label>
          <Select value={formData.category || ''} onValueChange={(value) => onFieldChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Économique">Économique</SelectItem>
              <SelectItem value="Compacte">Compacte</SelectItem>
              <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Pleine grandeur">Pleine grandeur</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Luxe">Luxe</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="Cabriolet">Cabriolet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )
}
