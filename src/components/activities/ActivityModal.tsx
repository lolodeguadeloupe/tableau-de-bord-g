
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ActivityForm } from "./ActivityForm"
import type { Activity } from "@/types/activity"

interface ActivityModalProps {
  activity: Activity | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ActivityModal({ activity, isOpen, onClose, onSuccess }: ActivityModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {activity ? "Modifier l'activité" : "Nouvelle activité"}
          </DialogTitle>
        </DialogHeader>
        <ActivityForm
          activity={activity}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
