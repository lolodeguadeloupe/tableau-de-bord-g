
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface BonsPlanBasicFieldsProps {
  formData: {
    title: string
    description: string
    badge: string
    url: string
  }
  setFormData: (updater: (prev: any) => any) => void
}

export function BonsPlanBasicFields({ formData, setFormData }: BonsPlanBasicFieldsProps) {
  return (
    <>
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="badge">Badge (optionnel)</Label>
        <Input
          id="badge"
          value={formData.badge}
          onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
          placeholder="ex: NOUVEAU, -50%, EXCLUSIF"
        />
      </div>

      <div>
        <Label htmlFor="url">URL de redirection</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://example.com ou /page-interne"
        />
        <p className="text-sm text-muted-foreground mt-1">
          URL vers laquelle rediriger l'utilisateur (interne ou externe)
        </p>
      </div>
    </>
  )
}
