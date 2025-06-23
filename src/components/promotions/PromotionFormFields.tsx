
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { Switch } from "@/components/ui/switch"
import type { Promotion } from "@/hooks/usePromotionActions"

interface PromotionFormFieldsProps {
  formData: Partial<Promotion>
  onUpdateFormData: (field: string, value: any) => void
}

export function PromotionFormFields({ formData, onUpdateFormData }: PromotionFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Informations de base */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titre de la promotion *</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => onUpdateFormData('title', e.target.value)}
            placeholder="Ex: Offre spéciale été"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => onUpdateFormData('description', e.target.value)}
            placeholder="Décrivez votre promotion..."
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="badge">Badge (optionnel)</Label>
          <Input
            id="badge"
            value={formData.badge || ''}
            onChange={(e) => onUpdateFormData('badge', e.target.value)}
            placeholder="Ex: -50%, NOUVEAU, LIMITÉ"
          />
        </div>

        <div>
          <Label htmlFor="cta_text">Texte du bouton *</Label>
          <Input
            id="cta_text"
            value={formData.cta_text || ''}
            onChange={(e) => onUpdateFormData('cta_text', e.target.value)}
            placeholder="Ex: Découvrir l'offre"
            required
          />
        </div>

        <div>
          <Label htmlFor="cta_url">URL de destination *</Label>
          <Input
            id="cta_url"
            value={formData.cta_url || ''}
            onChange={(e) => onUpdateFormData('cta_url', e.target.value)}
            placeholder="Ex: https://example.com/promo"
            required
          />
        </div>

        <div>
          <Label htmlFor="sort_order">Ordre d'affichage</Label>
          <Input
            id="sort_order"
            type="number"
            min="0"
            value={formData.sort_order || 0}
            onChange={(e) => onUpdateFormData('sort_order', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active !== false}
            onCheckedChange={(checked) => onUpdateFormData('is_active', checked)}
          />
          <Label htmlFor="is_active">Promotion active</Label>
        </div>
      </div>

      {/* Image */}
      <div className="space-y-4">
        <div>
          <Label>Image de la promotion</Label>
          <ImageUpload
            value={formData.image || ''}
            onImageChange={(url) => onUpdateFormData('image', url)}
            bucketName="promotion-images"
          />
        </div>
      </div>
    </div>
  )
}
