
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TravelStats } from "@/components/travel/TravelStats"
import { TravelTable } from "@/components/travel/TravelTable"
import { TravelModal } from "@/components/travel/TravelModal"
import { useTravelActions } from "@/hooks/useTravelActions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { TravelOffer } from "@/types/travel"

export default function Travel() {
  const [offers, setOffers] = useState<TravelOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<TravelOffer | null>(null)
  const [deleteOfferId, setDeleteOfferId] = useState<number | null>(null)

  const { fetchTravelOffers, handleDelete, saveOffer } = useTravelActions()

  const loadOffers = async () => {
    setLoading(true)
    const data = await fetchTravelOffers()
    setOffers(data)
    setLoading(false)
  }

  useEffect(() => {
    loadOffers()
  }, [])

  const handleEditOffer = (offer: TravelOffer) => {
    setEditingOffer(offer)
    setIsModalOpen(true)
  }

  const handleDeleteOffer = async (id: string) => {
    const success = await handleDelete(id)
    if (success) {
      await loadOffers()
    }
    setDeleteOfferId(null)
  }

  const handleSaveOffer = async (offerData: Partial<TravelOffer>) => {
    const result = await saveOffer(offerData)
    if (result) {
      await loadOffers()
      return result
    }
    return null
  }

  const handleNewOffer = () => {
    setEditingOffer(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingOffer(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des offres de voyage...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Voyages</h1>
          <p className="text-muted-foreground mt-1">Gérez vos offres de voyage</p>
        </div>
        <Button onClick={handleNewOffer} className="bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau voyage
        </Button>
      </div>

      <TravelStats offers={offers} />

      <TravelTable
        offers={offers}
        onEdit={handleEditOffer}
        onDelete={(id) => setDeleteOfferId(parseInt(id))}
        onRefresh={loadOffers}
      />

      <TravelModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        offer={editingOffer}
        onSave={handleSaveOffer}
      />

      <AlertDialog open={deleteOfferId !== null} onOpenChange={() => setDeleteOfferId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette offre de voyage ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteOfferId && handleDeleteOffer(deleteOfferId.toString())}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
