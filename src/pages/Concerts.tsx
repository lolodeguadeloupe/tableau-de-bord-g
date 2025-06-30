
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConcertStats } from "@/components/concert/ConcertStats"
import { ConcertTable } from "@/components/concert/ConcertTable"
import { ConcertModal } from "@/components/concert/ConcertModal"
import { useConcertActions } from "@/hooks/useConcertActions"
import { useConcerts } from "@/hooks/useConcerts"
import { useAuth } from "@/hooks/useAuth"
import type { Concert, ConcertTableData } from "@/types/concert"

export default function Concerts() {
  const { loading: authLoading } = useAuth()
  const { concerts, loading, fetchConcerts } = useConcerts(authLoading)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null)

  const { handleEdit, handleDelete, saveConcert } = useConcertActions()


  const handleEditConcert = (concertData: ConcertTableData) => {
    const concert = handleEdit(concertData)
    setEditingConcert(concert)
    setIsModalOpen(true)
  }

  const handleDeleteConcert = async (id: string) => {
    const success = await handleDelete(id)
    if (success) {
      await fetchConcerts()
    }
  }

  const handleSaveConcert = async (concertData: Partial<Concert>) => {
    const result = await saveConcert(concertData)
    if (result) {
      await fetchConcerts()
      return result
    }
    return null
  }

  const handleNewConcert = () => {
    setEditingConcert(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingConcert(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des concerts...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Concerts</h1>
          <p className="text-muted-foreground mt-1">Gérez vos événements musicaux</p>
        </div>
        <Button onClick={handleNewConcert} className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau concert
        </Button>
      </div>

      <ConcertStats concerts={concerts} />

      <ConcertTable
        concerts={concerts}
        onEdit={handleEditConcert}
        onDelete={handleDeleteConcert}
      />

      <ConcertModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        concert={editingConcert}
        onSave={handleSaveConcert}
      />
    </div>
  )
}
