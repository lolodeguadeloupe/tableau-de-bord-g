
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { PartnerForm } from "./PartnerForm"
import { Partner } from "@/hooks/usePartners"

interface PartnerModalProps {
  partner: Partner | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function PartnerModal({ partner, isOpen, onClose, onSuccess }: PartnerModalProps) {
  const { user, loading: authLoading } = useAuth()

  const handleSuccess = () => {
    onSuccess()
    onClose()
  }

  if (authLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Vérification de l'authentification...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Authentification requise</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="text-muted-foreground mb-4">
              Vous devez être connecté pour gérer les partenaires.
            </p>
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {partner ? 'Modifier le partenaire' : 'Nouveau partenaire'}
          </DialogTitle>
        </DialogHeader>

        <PartnerForm
          partner={partner}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
