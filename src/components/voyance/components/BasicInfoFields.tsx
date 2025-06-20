
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BasicInfoFieldsProps {
  formData: {
    name: string
    description: string
    experience_years: number
  }
  onUpdate: (updates: any) => void
}

export function BasicInfoFields({ formData, onUpdate }: BasicInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience_years">Années d'expérience</Label>
          <Input
            id="experience_years"
            type="number"
            value={formData.experience_years}
            onChange={(e) => onUpdate({ experience_years: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          required
          rows={3}
        />
      </div>
    </>
  )
}
