
import { useState, useEffect } from "react"
import { Activity, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface LeisureActivity {
  id?: number
  name: string
  category: string
  description: string
  price_per_person: number
  duration_hours: number
  min_level: string
  max_participants?: number
  equipment_provided?: boolean
  professional_guide?: boolean
  icon_name: string
  image?: string
}

interface LeisureActivityModalProps {
  activity: LeisureActivity | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function LeisureActivityModal({ activity, isOpen, onClose, onSuccess }: LeisureActivityModalProps) {
  const [formData, setFormData] = useState<LeisureActivity>({
    name: "",
    category: "",
    description: "",
    price_per_person: 0,
    duration_hours: 1,
    min_level: "débutant",
    max_participants: 10,
    equipment_provided: true,
    professional_guide: true,
    icon_name: "waves",
    image: ""
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (activity) {
      setFormData(activity)
    } else {
      setFormData({
        name: "",
        category: "",
        description: "",
        price_per_person: 0,
        duration_hours: 1,
        min_level: "débutant",
        max_participants: 10,
        equipment_provided: true,
        professional_guide: true,
        icon_name: "waves",
        image: ""
      })
    }
  }, [activity])

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSave = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price_per_person: formData.price_per_person,
        duration_hours: formData.duration_hours,
        min_level: formData.min_level,
        max_participants: formData.max_participants,
        equipment_provided: formData.equipment_provided,
        professional_guide: formData.professional_guide,
        icon_name: formData.icon_name,
        image: formData.image || ''
      }

      if (activity?.id) {
        // Mise à jour
        const { error } = await supabase
          .from('leisure_activities')
          .update({
            ...dataToSave,
            updated_at: new Date().toISOString()
          })
          .eq('id', activity.id)

        if (error) throw error

        toast({
          title: "Activité modifiée",
          description: "L'activité de loisir a été modifiée avec succès.",
        })
      } else {
        // Création
        const { error } = await supabase
          .from('leisure_activities')
          .insert([dataToSave])

        if (error) throw error

        toast({
          title: "Activité créée",
          description: "L'activité de loisir a été créée avec succès.",
        })
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'activité.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {activity ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {activity ? "Modifier l'activité" : "Créer une activité"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom de l'activité"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aquatique">Aquatique</SelectItem>
                    <SelectItem value="terrestre">Terrestre</SelectItem>
                    <SelectItem value="aérien">Aérien</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="aventure">Aventure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de l'activité"
                rows={3}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Image de l'activité</Label>
              <ImageUpload
                value={formData.image || ''}
                onImageChange={handleImageChange}
                bucketName="loisir-images"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Prix par personne (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_per_person}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_per_person: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Durée (heures) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: parseFloat(e.target.value) || 1 }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="min_level">Niveau minimum *</Label>
                <Select value={formData.min_level} onValueChange={(value) => setFormData(prev => ({ ...prev, min_level: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau minimum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="débutant">Débutant</SelectItem>
                    <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="avancé">Avancé</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_participants">Participants max</Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="1"
                  value={formData.max_participants || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) || undefined }))}
                  placeholder="Illimité"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="icon_name">Icône</Label>
              <Select value={formData.icon_name} onValueChange={(value) => setFormData(prev => ({ ...prev, icon_name: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une icône" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waves">Vagues</SelectItem>
                  <SelectItem value="mountain">Montagne</SelectItem>
                  <SelectItem value="bike">Vélo</SelectItem>
                  <SelectItem value="plane">Avion</SelectItem>
                  <SelectItem value="camera">Appareil photo</SelectItem>
                  <SelectItem value="compass">Boussole</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="equipment_provided"
                  checked={formData.equipment_provided}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, equipment_provided: checked }))}
                />
                <Label htmlFor="equipment_provided">Équipement fourni</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="professional_guide"
                  checked={formData.professional_guide}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, professional_guide: checked }))}
                />
                <Label htmlFor="professional_guide">Guide professionnel</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sauvegarde..." : (activity ? "Modifier" : "Créer")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
