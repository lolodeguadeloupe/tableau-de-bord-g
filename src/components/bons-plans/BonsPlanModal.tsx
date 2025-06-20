
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ImageUpload } from "@/components/ui/ImageUpload"

interface BonsPlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bonPlan: any
  onClose: () => void
}

export function BonsPlanModal({ open, onOpenChange, bonPlan, onClose }: BonsPlanModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    badge: '',
    icon: 'star',
    image: '',
    is_active: true
  })

  useEffect(() => {
    if (bonPlan) {
      setFormData({
        title: bonPlan.title || '',
        description: bonPlan.description || '',
        badge: bonPlan.badge || '',
        icon: bonPlan.icon || 'star',
        image: bonPlan.image || '',
        is_active: bonPlan.is_active ?? true
      })
    } else {
      setFormData({
        title: '',
        description: '',
        badge: '',
        icon: 'star',
        image: '',
        is_active: true
      })
    }
  }, [bonPlan])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (bonPlan) {
        const { error } = await supabase
          .from('bons_plans')
          .update(formData)
          .eq('id', bonPlan.id)

        if (error) throw error

        toast({
          title: "Bon plan modifié",
          description: "Le bon plan a été mis à jour avec succès."
        })
      } else {
        const { error } = await supabase
          .from('bons_plans')
          .insert(formData)

        if (error) throw error

        toast({
          title: "Bon plan créé",
          description: "Le nouveau bon plan a été ajouté avec succès."
        })
      }

      onClose()
      // Forcer le rechargement de la page pour s'assurer que les données sont à jour
      window.location.reload()
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {bonPlan ? 'Modifier le bon plan' : 'Ajouter un bon plan'}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations du bon plan
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
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
              <Label htmlFor="icon">Icône</Label>
              <Select 
                value={formData.icon} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="star">Étoile</SelectItem>
                  <SelectItem value="tag">Tag</SelectItem>
                  <SelectItem value="gift">Cadeau</SelectItem>
                  <SelectItem value="percent">Pourcentage</SelectItem>
                  <SelectItem value="fire">Feu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Image</Label>
              <ImageUpload
                value={formData.image}
                onImageChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                bucketName="voyance-images"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Bon plan actif</Label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sauvegarde...' : (bonPlan ? 'Modifier' : 'Créer')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
