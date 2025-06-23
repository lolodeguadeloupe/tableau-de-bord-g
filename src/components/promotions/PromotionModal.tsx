
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PromotionFormFields } from "./PromotionFormFields"
import { usePromotionFormLogic } from "./PromotionFormLogic"
import type { Promotion } from "@/hooks/usePromotionActions"

interface PromotionModalProps {
  isOpen: boolean
  onClose: () => void
  promotion?: Promotion | null
  onSave: (promotion: Partial<Promotion>) => Promise<Promotion | null>
}

export function PromotionModal({ isOpen, onClose, promotion, onSave }: PromotionModalProps) {
  const {
    formData,
    isLoading,
    handleSubmit,
    updateFormData
  } = usePromotionFormLogic(promotion, isOpen, onSave)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {promotion ? 'Modifier la promotion' : 'Nouvelle promotion'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-6">
          <PromotionFormFields
            formData={formData}
            onUpdateFormData={updateFormData}
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
