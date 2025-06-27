
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { PartnerModal } from "@/components/partners/PartnerModal"
import { useAuth } from "@/hooks/useAuth"
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
import { PartnerStats } from "@/components/partners/PartnerStats"
import { AuthGuard } from "@/components/restaurant/AuthGuard"
import { EmptyState } from "@/components/partners/EmptyState"
import { formatPartnersForTable, partnerTableColumns } from "@/components/partners/PartnerTableUtils"
import { usePartners } from "@/hooks/usePartners"
import { usePartnerActions } from "@/hooks/usePartnerActions"

export default function Partners() {
  const { user, loading: authLoading } = useAuth()
  const { partners, loading, fetchPartners } = usePartners(authLoading)
  const {
    isModalOpen,
    selectedPartner,
    deletePartnerId,
    setDeletePartnerId,
    handleEdit,
    handleDelete,
    handleModalClose,
    handleCreateNew
  } = usePartnerActions(user, fetchPartners)

  console.log('🏢 État actuel:', { loading, partners: partners.length, isModalOpen, user: user?.id })

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des partenaires...</div>
      </div>
    )
  }

  if (!user) {
    return <AuthGuard />
  }

  const formattedTableData = formatPartnersForTable(partners)

  const handleEditWrapper = (item: any) => {
    const partner = partners.find(p => p.id.toString() === item.id)
    if (partner) {
      handleEdit(partner)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Partenaires</h1>
          <p className="text-muted-foreground">Gérez vos partenaires commerciaux</p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau partenaire
        </Button>
      </div>

      {partners.length === 0 && !loading && <EmptyState />}

      <PartnerStats partners={partners} />

      {partners.length > 0 && (
        <DataTable
          title="Liste des partenaires"
          data={formattedTableData}
          columns={partnerTableColumns}
          onEdit={handleEditWrapper}
          onDelete={(id) => setDeletePartnerId(parseInt(id))}
        />
      )}

      <PartnerModal
        partner={selectedPartner}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchPartners}
      />

      <AlertDialog open={deletePartnerId !== null} onOpenChange={() => setDeletePartnerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce partenaire ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletePartnerId && handleDelete(deletePartnerId.toString())}
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
