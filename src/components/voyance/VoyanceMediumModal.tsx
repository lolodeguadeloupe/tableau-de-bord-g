
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useVoyanceMediumForm } from "./hooks/useVoyanceMediumForm"
import { TagManager } from "./components/TagManager"
import { BasicInfoFields } from "./components/BasicInfoFields"
import { ImageUploadSection } from "./components/ImageUploadSection"
import { ContactPricingFields } from "./components/ContactPricingFields"

interface VoyanceMediumModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medium: any
  onSuccess?: () => void
}

export function VoyanceMediumModal({ 
  open, 
  onOpenChange, 
  medium,
  onSuccess 
}: VoyanceMediumModalProps) {
  const { formData, updateFormData, handleSubmit, loading } = useVoyanceMediumForm(
    medium, 
    onSuccess, 
    () => onOpenChange(false)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {medium ? 'Modifier le médium' : 'Ajouter un médium'}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations du médium
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfoFields 
            formData={formData} 
            onUpdate={updateFormData} 
          />

          <ImageUploadSection 
            formData={formData} 
            onUpdate={updateFormData} 
          />

          <TagManager
            label="Spécialités"
            tags={formData.specialties}
            onTagsChange={(specialties) => updateFormData({ specialties })}
            placeholder="Ajouter une spécialité"
            variant="secondary"
          />

          <TagManager
            label="Langues parlées"
            tags={formData.languages}
            onTagsChange={(languages) => updateFormData({ languages })}
            placeholder="Ajouter une langue"
            variant="outline"
            allowRemoveAll={false}
          />

          <ContactPricingFields 
            formData={formData} 
            onUpdate={updateFormData} 
          />

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => updateFormData({ is_active: checked })}
            />
            <Label htmlFor="is_active">Médium actif</Label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sauvegarde...' : (medium ? 'Modifier' : 'Créer')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
