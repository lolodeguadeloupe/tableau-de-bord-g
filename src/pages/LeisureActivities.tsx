
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoisirsModal } from "@/components/LoisirsModal"
import { useLeisureActions } from "@/hooks/useLeisureActions"
import { LeisureActivityStats } from "@/components/leisure/LeisureActivityStats"
import { LeisureActivityTable } from "@/components/leisure/LeisureActivityTable"
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
import type { Loisir } from "@/types/leisure"

export default function LeisureActivities() {
  const [loisirs, setLoisirs] = useState<Loisir[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLoisir, setSelectedLoisir] = useState<Loisir | null>(null)
  const [deleteLoisirId, setDeleteLoisirId] = useState<number | null>(null)

  const { fetchLoisirs, handleEdit, handleDelete, handleImageClick } = useLeisureActions()

  const loadLoisirs = async () => {
    setLoading(true)
    const data = await fetchLoisirs()
    setLoisirs(data)
    setLoading(false)
  }

  useEffect(() => {
    loadLoisirs()
  }, [])

  const onEdit = (loisirData: any) => {
    const loisir = handleEdit(loisirData)
    setSelectedLoisir(loisir)
    setIsModalOpen(true)
  }

  const onDelete = async (id: string) => {
    const loisirId = parseInt(id)
    const success = await handleDelete(id)
    if (success) {
      loadLoisirs()
    }
    setDeleteLoisirId(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedLoisir(null)
  }

  console.log('🎯 État actuel:', { loading, loisirs: loisirs.length, isModalOpen })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des loisirs...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Loisirs</h1>
          <p className="text-muted-foreground">Gérez vos activités de loisirs</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau loisir
        </Button>
      </div>

      <LeisureActivityStats loisirs={loisirs} />

      <LeisureActivityTable
        loisirs={loisirs}
        onEdit={onEdit}
        onDelete={(id) => setDeleteLoisirId(parseInt(id))}
        onImageClick={handleImageClick}
      />

      <LoisirsModal
        loisir={selectedLoisir}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={loadLoisirs}
      />

      <AlertDialog open={deleteLoisirId !== null} onOpenChange={() => setDeleteLoisirId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce loisir ? Cette action est irréversible. Vous êtes sur le point de supprimer le loisir : {selectedLoisir?.title}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteLoisirId && onDelete(deleteLoisirId.toString())}
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
