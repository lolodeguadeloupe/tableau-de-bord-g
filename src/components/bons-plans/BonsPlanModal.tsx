
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BonsPlanBasicFields } from "./form/BonsPlanBasicFields"
import { BonsPlanMediaFields } from "./form/BonsPlanMediaFields"
import { BonsPlanStatusField } from "./form/BonsPlanStatusField"
import { useBonsPlanForm } from "./hooks/useBonsPlanForm"

interface BonsPlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bonPlan: any
  onClose: () => void
}

export function BonsPlanModal({ open, onOpenChange, bonPlan, onClose }: BonsPlanModalProps) {
  const { formData, setFormData, loading, handleSubmit } = useBonsPlanForm(bonPlan, onClose)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {bonPlan ? 'Modifier le bon plan' : 'Ajouter un bon plan'}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations du bon plan
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <BonsPlanBasicFields formData={formData} setFormData={setFormData} />
            <BonsPlanMediaFields formData={formData} setFormData={setFormData} />
            <BonsPlanStatusField formData={formData} setFormData={setFormData} />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sauvegarde...' : (bonPlan ? 'Modifier' : 'Créer')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
