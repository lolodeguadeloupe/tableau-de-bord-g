
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

interface BasicInfoFieldsProps {
  formData: Loisir
  setFormData: React.Dispatch<React.SetStateAction<Loisir>>
}

export function BasicInfoFields({ formData, setFormData }: BasicInfoFieldsProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="title">Titre *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Titre du loisir"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Description du loisir"
          rows={3}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Lieu *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="Lieu du loisir"
          required
        />
      </div>
    </>
  )
}
