import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
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
import { Trash2, Mail } from "lucide-react"
import type { NewsletterSubscription } from "@/types/newsletter"

interface NewsletterTableProps {
  subscriptions: NewsletterSubscription[]
  loading: boolean
  onDelete: (id: string) => Promise<void>
}

export function NewsletterTable({ subscriptions, loading, onDelete }: NewsletterTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatSubscriptionsForTable = () => {
    return subscriptions.map(subscription => ({
      id: subscription.id,
      email: (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{subscription.email}</span>
        </div>
      ),
      created_at: new Date(subscription.created_at).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: <Badge variant="default">Actif</Badge>,
      actions: subscription.id
    }))
  }

  const columns = [
    { key: "email", label: "Adresse email" },
    { key: "created_at", label: "Date d'inscription" },
    { key: "status", label: "Statut" },
  ]

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    
    setIsDeleting(true)
    try {
      await onDelete(deleteId)
      setDeleteId(null)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setDeleteId(null)
  }

  const CustomActionsButton = ({ id }: { id: string }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleDeleteClick(id)}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
      Supprimer
    </Button>
  )

  if (loading) {
    return (
      <div className="h-96 bg-muted animate-pulse rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Chargement des abonnements...</p>
      </div>
    )
  }

  const tableData = formatSubscriptionsForTable()

  return (
    <>
      <DataTable
        title="Abonnements Newsletter"
        data={tableData}
        columns={columns}
        onDelete={handleDeleteClick}
        showActions={true}
      />

      <AlertDialog open={!!deleteId} onOpenChange={handleCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet abonnement newsletter ? 
              Cette action est irréversible et l'utilisateur ne recevra plus de newsletters.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}