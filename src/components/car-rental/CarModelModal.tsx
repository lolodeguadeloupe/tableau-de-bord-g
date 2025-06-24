
import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CarModel, CarRentalCompany } from "@/hooks/useCarRentalActions"
import { CarModelImageSection } from "./CarModelImageSection"
import { CarModelBasicFields } from "./form/CarModelBasicFields"
import { CarModelTechnicalFields } from "./form/CarModelTechnicalFields"
import { CarModelStatusFields } from "./form/CarModelStatusFields"
import { useCarModelForm } from "./hooks/useCarModelForm"

interface CarModelModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<CarModel>) => void
  model?: CarModel | null
  companies: CarRentalCompany[]
  loading?: boolean
}

export function CarModelModal({ isOpen, onClose, onSave, model, companies, loading }: CarModelModalProps) {
  const { formData, handleFieldChange, handleImagesChange } = useCarModelForm({ model })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
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
          <CarModelBasicFields
            formData={formData}
            companies={companies}
            onFieldChange={handleFieldChange}
          />

          <CarModelImageSection
            formData={formData as CarModel}
            onImagesChange={handleImagesChange}
          />

          <CarModelTechnicalFields
            formData={formData}
            onFieldChange={handleFieldChange}
          />

          <CarModelStatusFields
            formData={formData}
            onFieldChange={handleFieldChange}
          />

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
