
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Json } from "@/integrations/supabase/types"

interface Loisir {
  id?: number
  title: string
  description: string
  location: string
  start_date: string
  end_date: string
  max_participants: number
  current_participants?: number
  image: string
  gallery_images?: Json
}

interface DateFieldsProps {
  formData: Loisir
  setFormData: React.Dispatch<React.SetStateAction<Loisir>>
}

export function DateFields({ formData, setFormData }: DateFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="start_date">Date de début *</Label>
        <Input
          id="start_date"
          type="date"
          value={formData.start_date}
          onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="end_date">Date de fin *</Label>
        <Input
          id="end_date"
          type="date"
          value={formData.end_date}
          onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
          required
        />
      </div>
    </div>
  )
}
