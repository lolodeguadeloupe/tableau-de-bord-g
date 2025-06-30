
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NightlifeStats } from "@/components/nightlife/NightlifeStats"
import { NightlifeTable } from "@/components/nightlife/NightlifeTable"
import { NightlifeModal } from "@/components/nightlife/NightlifeModal"
import { useNightlifeActions } from "@/hooks/useNightlifeActions"
import { useNightlife } from "@/hooks/useNightlife"
import { useAuth } from "@/hooks/useAuth"
import type { NightlifeEvent, NightlifeEventTableData } from "@/types/nightlife"

export default function Nightlife() {
  const { loading: authLoading } = useAuth()
  const { nightlife: events, loading, fetchNightlife } = useNightlife(authLoading)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<NightlifeEvent | null>(null)

  const { fetchEvents, handleEdit, handleDelete, saveEvent } = useNightlifeActions()


  const handleEditEvent = (eventData: NightlifeEventTableData) => {
    const event = handleEdit(eventData)
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  const handleDeleteEvent = async (id: string) => {
    const success = await handleDelete(id)
    if (success) {
      await fetchNightlife()
    }
  }

  const handleSaveEvent = async (eventData: Partial<NightlifeEvent>) => {
    const result = await saveEvent(eventData)
    if (result) {
      await fetchNightlife()
      return result
    }
    return null
  }

  const handleNewEvent = () => {
    setEditingEvent(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEvent(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des événements nightlife...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Soirées & Nightlife</h1>
          <p className="text-muted-foreground mt-1">Gérez vos événements de soirée</p>
        </div>
        <Button onClick={handleNewEvent} className="bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel événement
        </Button>
      </div>

      <NightlifeStats events={events} />

      <NightlifeTable
        events={events}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      <NightlifeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={editingEvent}
        onSave={handleSaveEvent}
      />
    </div>
  )
}
