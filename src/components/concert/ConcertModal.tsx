
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ConcertFormFields } from "./ConcertFormFields"
import { useConcertFormLogic } from "./ConcertFormLogic"
import type { Concert } from "@/types/concert"

interface ConcertModalProps {
  isOpen: boolean
  onClose: () => void
  concert?: Concert | null
  onSave: (concert: Partial<Concert>) => Promise<Concert | null>
}

export function ConcertModal({ isOpen, onClose, concert, onSave }: ConcertModalProps) {
  const {
    formData,
    isLoading,
    handleSubmit,
    handleImagesChange,
    updateFormData
  } = useConcertFormLogic(concert, isOpen, onSave)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {concert ? 'Modifier le concert' : 'Nouveau concert'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-6">
          <ConcertFormFields
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
