import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CarRentalCompany } from "@/hooks/useCarRentalActions"

interface CarRentalModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<CarRentalCompany>) => void
  company?: CarRentalCompany | null
  loading?: boolean
}

export function CarRentalModal({ isOpen, onClose, onSave, company, loading }: CarRentalModalProps) {
  const [formData, setFormData] = useState<Partial<CarRentalCompany>>({
    name: '',
    type: '',
    image: '',
    location: '',
    description: '',
    rating: 4.5,
    offer: '',
    icon_name: 'Car'
  })

  useEffect(() => {
    if (company) {
      console.log('Setting form data with company:', company)
      setFormData({
        id: company.id,
        name: company.name,
        type: company.type,
        image: company.image,
        location: company.location,
        description: company.description,
        rating: company.rating,
        offer: company.offer,
        icon_name: company.icon_name
      })
    } else {
      setFormData({
        name: '',
        type: '',
        image: '',
        location: '',
        description: '',
        rating: 4.5,
        offer: '',
        icon_name: 'Car'
      })
    }
  }, [company, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting form data:', formData)
    onSave(formData)
  }

  const handleChange = (field: keyof CarRentalCompany, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {company ? 'Modifier la compagnie' : 'Ajouter une compagnie'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nom de la compagnie"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select 
                value={formData.type || ''} 
                onValueChange={(value) => handleChange('type', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Économique">Économique</SelectItem>
                  <SelectItem value="Luxe">Luxe</SelectItem>
                  <SelectItem value="Véhicules électriques">Véhicules électriques</SelectItem>
                  <SelectItem value="Véhicules tout-terrain">Véhicules tout-terrain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Localisation *</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Localisation de la compagnie"
              required
            />
          </div>

          <div>
            <Label htmlFor="image">URL de l'image</Label>
            <Input
              id="image"
              value={formData.image || ''}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="https://exemple.com/image.jpg"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description de la compagnie"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating">Note</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating || 4.5}
                onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="icon_name">Icône</Label>
              <Select value={formData.icon_name || 'Car'} onValueChange={(value) => handleChange('icon_name', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'icône" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Bike">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="offer">Offre spéciale</Label>
            <Input
              id="offer"
              value={formData.offer || ''}
              onChange={(e) => handleChange('offer', e.target.value)}
              placeholder="Offre spéciale ou promotion"
            />
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
