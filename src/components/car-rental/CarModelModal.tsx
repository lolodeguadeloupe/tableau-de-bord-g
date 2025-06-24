import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CarModel, CarRentalCompany } from "@/hooks/useCarRentalActions"
import { CarModelImageSection } from "./CarModelImageSection"

interface CarModelModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<CarModel>) => void
  model?: CarModel | null
  companies: CarRentalCompany[]
  loading?: boolean
}

export function CarModelModal({ isOpen, onClose, onSave, model, companies, loading }: CarModelModalProps) {
  const [formData, setFormData] = useState<Partial<CarModel>>({
    name: '',
    company_id: '',
    image: '',
    price_per_day: 0,
    category: '',
    seats: 5,
    transmission: 'Automatique',
    air_con: true,
    is_active: true,
    gallery_images: []
  })

  useEffect(() => {
    if (model) {
      setFormData({
        ...model,
        gallery_images: model.gallery_images || []
      })
    } else {
      setFormData({
        name: '',
        company_id: '',
        image: '',
        price_per_day: 0,
        category: '',
        seats: 5,
        transmission: 'Automatique',
        air_con: true,
        is_active: true,
        gallery_images: []
      })
    }
  }, [model])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof CarModel, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImagesChange = (images: string[]) => {
    const mainImage = images.length > 0 ? images[0] : ''
    const galleryImages = images.slice(1) // Toutes les images sauf la première
    
    setFormData(prev => ({
      ...prev,
      image: mainImage,
      gallery_images: galleryImages
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {model ? 'Modifier le modèle' : 'Ajouter un modèle'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom du modèle *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: BMW X3, Peugeot 308"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="company_id">Compagnie *</Label>
              <Select 
                value={formData.company_id || ''} 
                onValueChange={(value) => handleChange('company_id', value)}
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

          <CarModelImageSection
            formData={formData as CarModel}
            onImagesChange={handleImagesChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price_per_day">Prix par jour (€) *</Label>
              <Input
                id="price_per_day"
                type="number"
                min="0"
                value={formData.price_per_day || 0}
                onChange={(e) => handleChange('price_per_day', parseInt(e.target.value))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={formData.category || ''} onValueChange={(value) => handleChange('category', value)}>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seats">Nombre de places</Label>
              <Input
                id="seats"
                type="number"
                min="2"
                max="9"
                value={formData.seats || 5}
                onChange={(e) => handleChange('seats', parseInt(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="transmission">Transmission</Label>
              <Select value={formData.transmission || 'Automatique'} onValueChange={(value) => handleChange('transmission', value)}>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="air_con"
                checked={formData.air_con ?? true}
                onCheckedChange={(checked) => handleChange('air_con', checked)}
              />
              <Label htmlFor="air_con">Climatisation</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active ?? true}
                onCheckedChange={(checked) => handleChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Actif</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
