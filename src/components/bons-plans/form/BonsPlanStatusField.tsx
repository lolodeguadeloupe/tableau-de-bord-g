
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface BonsPlanStatusFieldProps {
  formData: {
    is_active: boolean
  }
  setFormData: (updater: (prev: any) => any) => void
}

export function BonsPlanStatusField({ formData, setFormData }: BonsPlanStatusFieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="is_active"
        checked={formData.is_active}
        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
      />
      <Label htmlFor="is_active">Bon plan actif</Label>
    </div>
  )
}
