
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { PartnerBasicFields } from "./PartnerBasicFields"
import { PartnerContactFields } from "./PartnerContactFields"
import { PartnerImageSection } from "./PartnerImageSection"
import { Partner } from "@/hooks/usePartners"

interface PartnerFormData {
  business_name: string
  business_type: string
  description: string
  address: string
  phone: string
  website: string
  image: string
  location: string
  rating: number
  offer: string
  icon_name: string
  type: string
  gallery_images: string[]
  status: string
}

interface PartnerFormProps {
  partner: Partner | null
  onSuccess: () => void
  onCancel: () => void
}

export function PartnerForm({ partner, onSuccess, onCancel }: PartnerFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PartnerFormData>({
    business_name: '',
    business_type: '',
    description: '',
    address: '',
    phone: '',
    website: '',
    image: '',
    location: '',
    rating: 5,
    offer: '',
    icon_name: 'building',
    type: '',
    gallery_images: [],
    status: 'en_attente'
  })
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (partner) {
      setFormData({
        business_name: partner.business_name,
        business_type: partner.business_type,
        description: partner.description || '',
        address: partner.address || '',
        phone: partner.phone || '',
        website: partner.website || '',
        image: partner.image || '',
        location: partner.location || '',
        rating: typeof partner.rating === 'number' ? partner.rating : 5,
        offer: partner.offer || '',
        icon_name: partner.icon_name || 'building',
        type: partner.type || '',
        gallery_images: partner.gallery_images || [],
        status: partner.status
      })
    }
  }, [partner])

  const handleFieldChange = (field: string, value: any) => {
    console.log('🔄 Changement de champ:', field, value, typeof value)
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour gérer les partenaires.",
        variant: "destructive",
      })
      return
    }

    console.log('📋 Données du formulaire:', formData)

    // Validation simple
    if (!formData.business_name.trim() || !formData.business_type.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le nom commercial et le type d'activité sont requis.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      console.log('💾 Sauvegarde du partenaire:', formData)

      if (partner) {
        // Modification
        const { error } = await supabase
          .from('partners')
          .update(formData)
          .eq('id', partner.id)

        if (error) {
          console.error('❌ Erreur lors de la modification:', error)
          throw error
        }

        toast({
          title: "Partenaire modifié",
          description: "Le partenaire a été modifié avec succès.",
        })
      } else {
        // Création
        const { error } = await supabase
          .from('partners')
          .insert(formData)

        if (error) {
          console.error('❌ Erreur lors de la création:', error)
          throw error
        }

        toast({
          title: "Partenaire créé",
          description: "Le partenaire a été créé avec succès.",
        })
      }

      onSuccess()
    } catch (error: unknown) {
      console.error('💥 Erreur lors de la sauvegarde:', error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le partenaire.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PartnerBasicFields formData={formData} onFieldChange={handleFieldChange} />
      <PartnerContactFields formData={formData} onFieldChange={handleFieldChange} />
      <PartnerImageSection formData={formData} onFieldChange={handleFieldChange} />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {partner ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}
