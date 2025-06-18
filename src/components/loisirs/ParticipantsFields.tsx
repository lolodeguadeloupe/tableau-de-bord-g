
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

interface ParticipantsFieldsProps {
  formData: Loisir
  setFormData: React.Dispatch<React.SetStateAction<Loisir>>
}

export function ParticipantsFields({ formData, setFormData }: ParticipantsFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="max_participants">Participants max *</Label>
        <Input
          id="max_participants"
          type="number"
          min="1"
          value={formData.max_participants}
          onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) || 1 }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="current_participants">Participants actuels</Label>
        <Input
          id="current_participants"
          type="number"
          min="0"
          value={formData.current_participants || 0}
          onChange={(e) => setFormData(prev => ({ ...prev, current_participants: parseInt(e.target.value) || 0 }))}
        />
      </div>
    </div>
  )
}
