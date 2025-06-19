
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { NightlifeFormFields } from "./NightlifeFormFields"
import { useNightlifeFormLogic } from "./NightlifeFormLogic"
import type { NightlifeEvent } from "@/types/nightlife"

interface NightlifeModalProps {
  isOpen: boolean
  onClose: () => void
  event?: NightlifeEvent | null
  onSave: (event: Partial<NightlifeEvent>) => Promise<NightlifeEvent | null>
}

export function NightlifeModal({ isOpen, onClose, event, onSave }: NightlifeModalProps) {
  const {
    formData,
    isLoading,
    handleSubmit,
    handleImagesChange,
    updateFormData
  } = useNightlifeFormLogic(event, isOpen, onSave)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Modifier l\'événement' : 'Nouvel événement'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-6">
          <NightlifeFormFields
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
