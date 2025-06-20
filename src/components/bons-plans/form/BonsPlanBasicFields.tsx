
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
  const validateUrl = (url: string) => {
    if (!url) return true // URL is optional
    
    // Check if it's an external URL (starts with http:// or https://)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return true
    }
    
    // Check if it's an internal URL (format: /section/id/)
    const internalUrlPattern = /^\/[a-zA-Z-]+\/\d+\/?$/
    return internalUrlPattern.test(url)
  }

  const isUrlValid = validateUrl(formData.url)

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
          type="text"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://example.com ou /restauration/2/"
          className={!isUrlValid ? "border-red-500" : ""}
        />
        <p className="text-sm text-muted-foreground mt-1">
          URL externe (https://...) ou interne (/restauration/2/, /concerts/5/, etc.)
        </p>
        {!isUrlValid && (
          <p className="text-sm text-red-500 mt-1">
            Format invalide. Utilisez une URL externe (https://...) ou interne (/section/id/)
          </p>
        )}
      </div>
    </>
  )
}
