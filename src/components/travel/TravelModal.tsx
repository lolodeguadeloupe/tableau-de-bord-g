
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TravelFormFields } from "./TravelFormFields"
import { useTravelFormLogic } from "./TravelFormLogic"
import type { TravelOffer } from "@/types/travel"

interface TravelModalProps {
  isOpen: boolean
  onClose: () => void
  offer?: TravelOffer | null
  onSave: (offer: Partial<TravelOffer>) => Promise<TravelOffer | null>
}

export function TravelModal({ isOpen, onClose, offer, onSave }: TravelModalProps) {
  const {
    formData,
    isLoading,
    handleSubmit,
    handleImagesChange,
    updateFormData
  } = useTravelFormLogic(offer, isOpen, onSave)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {offer ? 'Modifier l\'offre de voyage' : 'Nouvelle offre de voyage'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-6">
          <TravelFormFields
            formData={formData}
            onUpdateFormData={updateFormData}
            onImagesChange={handleImagesChange}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
