
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"

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
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    gallery_images: [] as string[],
    specialties: [] as string[],
    languages: ['français'],
    consultation_types: ['présentiel'],
    experience_years: 0,
    price_per_session: 0,
    rating: 0,
    is_active: true,
    location: '',
    contact_email: '',
    contact_phone: '',
    contact_whatsapp: '',
    availability_schedule: {}
  })
  const [newSpecialty, setNewSpecialty] = useState('')
  const [newLanguage, setNewLanguage] = useState('')

  useEffect(() => {
    if (medium) {
      setFormData({
        name: medium.name || '',
        description: medium.description || '',
        image: medium.image || '',
        gallery_images: medium.gallery_images || [],
        specialties: medium.specialties || [],
        languages: medium.languages || ['français'],
        consultation_types: medium.consultation_types || ['présentiel'],
        experience_years: medium.experience_years || 0,
        price_per_session: medium.price_per_session || 0,
        rating: medium.rating || 0,
        is_active: medium.is_active ?? true,
        location: medium.location || '',
        contact_email: medium.contact_email || '',
        contact_phone: medium.contact_phone || '',
        contact_whatsapp: medium.contact_whatsapp || '',
        availability_schedule: medium.availability_schedule || {}
      })
    } else {
      setFormData({
        name: '',
        description: '',
        image: '',
        gallery_images: [],
        specialties: [],
        languages: ['français'],
        consultation_types: ['présentiel'],
        experience_years: 0,
        price_per_session: 0,
        rating: 0,
        is_active: true,
        location: '',
        contact_email: '',
        contact_phone: '',
        contact_whatsapp: '',
        availability_schedule: {}
      })
    }
  }, [medium])

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }))
      setNewSpecialty('')
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }))
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }))
      setNewLanguage('')
    }
  }

  const removeLanguage = (language: string) => {
    if (formData.languages.length > 1) {
      setFormData(prev => ({
        ...prev,
        languages: prev.languages.filter(l => l !== language)
      }))
    }
  }

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }))
  }

  const handleGalleryImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, gallery_images: images }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSubmit = {
        ...formData,
        // Ensure arrays are properly formatted for PostgreSQL
        specialties: formData.specialties,
        languages: formData.languages,
        consultation_types: formData.consultation_types,
        gallery_images: formData.gallery_images
      }

      if (medium) {
        const { error } = await supabase
          .from('voyance_mediums')
          .update(dataToSubmit)
          .eq('id', medium.id)

        if (error) throw error

        toast({
          title: "Médium modifié",
          description: "Les informations du médium ont été mises à jour."
        })
      } else {
        const { error } = await supabase
          .from('voyance_mediums')
          .insert(dataToSubmit)

        if (error) throw error

        toast({
          title: "Médium créé",
          description: "Le nouveau médium a été ajouté avec succès."
        })
      }

      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience_years">Années d'expérience</Label>
              <Input
                id="experience_years"
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={3}
            />
          </div>

          {/* Photo principale */}
          <div className="space-y-2">
            <Label>Photo principale</Label>
            <ImageUpload
              value={formData.image}
              onImageChange={handleImageChange}
              bucketName="voyance-images"
            />
          </div>

          {/* Galerie d'images */}
          <div className="space-y-2">
            <Label>Galerie d'images</Label>
            <MultiImageUpload
              images={formData.gallery_images}
              onImagesChange={handleGalleryImagesChange}
              bucketName="voyance-images"
              maxImages={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Spécialités</Label>
            <div className="flex space-x-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Ajouter une spécialité"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
              />
              <Button type="button" onClick={addSpecialty}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="flex items-center space-x-1">
                  <span>{specialty}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeSpecialty(specialty)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Langues parlées</Label>
            <div className="flex space-x-2">
              <Input
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Ajouter une langue"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
              />
              <Button type="button" onClick={addLanguage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((language) => (
                <Badge key={language} variant="outline" className="flex items-center space-x-1">
                  <span>{language}</span>
                  {formData.languages.length > 1 && (
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeLanguage(language)}
                    />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_per_session">Prix par séance (€)</Label>
              <Input
                id="price_per_session"
                type="number"
                value={formData.price_per_session}
                onChange={(e) => setFormData(prev => ({ ...prev, price_per_session: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email de contact</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Téléphone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_whatsapp">WhatsApp (optionnel)</Label>
            <Input
              id="contact_whatsapp"
              value={formData.contact_whatsapp}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_whatsapp: e.target.value }))}
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
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
