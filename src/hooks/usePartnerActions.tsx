
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Partner } from "@/hooks/usePartners"

export function usePartnerActions(user: any, fetchPartners: () => void) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [deletePartnerId, setDeletePartnerId] = useState<number | null>(null)
  const { toast } = useToast()

  const handleEdit = (partner: Partner) => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour modifier les partenaires.",
        variant: "destructive",
      })
      return
    }

    console.log('✏️ Édition du partenaire:', partner)
    setSelectedPartner(partner)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour supprimer les partenaires.",
        variant: "destructive",
      })
      return
    }

    const partnerId = parseInt(id)
    console.log('🗑️ Suppression du partenaire ID:', partnerId)
    
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', partnerId)

      if (error) {
        console.error('❌ Erreur lors de la suppression:', error)
        throw error
      }

      toast({
        title: "Partenaire supprimé",
        description: "Le partenaire a été supprimé avec succès.",
      })

      fetchPartners()
    } catch (error: unknown) {
      console.error('❌ Erreur lors de la suppression:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le partenaire.",
        variant: "destructive",
      })
    }
    setDeletePartnerId(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedPartner(null)
  }

  const handleCreateNew = () => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour créer des partenaires.",
        variant: "destructive",
      })
      return
    }
    console.log('➕ Création d\'un nouveau partenaire')
    setSelectedPartner(null)
    setIsModalOpen(true)
  }

  return {
    isModalOpen,
    selectedPartner,
    deletePartnerId,
    setDeletePartnerId,
    handleEdit,
    handleDelete,
    handleModalClose,
    handleCreateNew
  }
}
