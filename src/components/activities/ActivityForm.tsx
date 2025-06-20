
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import type { Activity } from "@/types/activity"

interface ActivityFormProps {
  activity: Activity | null
  onClose: () => void
  onSuccess: () => void
}

interface FormData {
  name: string
  icon_name: string
  path: string
  is_active: boolean
}

const initialFormData: FormData = {
  name: '',
  icon_name: '',
  path: '',
  is_active: true
}

export function ActivityForm({ activity, onClose, onSuccess }: ActivityFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name || '',
        icon_name: activity.icon_name || '',
        path: activity.path || '',
        is_active: activity.is_active ?? true
      })
    } else {
      setFormData(initialFormData)
    }
  }, [activity])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (activity) {
        const { error } = await supabase
          .from('activities')
          .update(formData)
          .eq('id', activity.id)

        if (error) throw error

        toast({
          title: "Activité modifiée",
          description: "L'activité a été mise à jour avec succès."
        })
      } else {
        const { error } = await supabase
          .from('activities')
          .insert(formData)

        if (error) throw error

        toast({
          title: "Activité créée",
          description: "La nouvelle activité a été ajoutée avec succès."
        })
      }

      onSuccess()
      
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Nom de l'activité</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="icon_name">Nom de l'icône</Label>
        <Input
          id="icon_name"
          value={formData.icon_name}
          onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
          placeholder="ex: Home, User, Settings"
          required
        />
      </div>

      <div>
        <Label htmlFor="path">Chemin de navigation</Label>
        <Input
          id="path"
          value={formData.path}
          onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
          placeholder="ex: /restaurants, /loisirs"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">
          Activité visible sur le site
        </Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Sauvegarde..." : activity ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  )
}
