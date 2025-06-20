
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BonsPlansTable } from "@/components/bons-plans/BonsPlansTable"
import { BonsPlanModal } from "@/components/bons-plans/BonsPlanModal"
import { BonsPlansStats } from "@/components/bons-plans/BonsPlansStats"

export default function BonsPlans() {
  const [showModal, setShowModal] = useState(false)
  const [selectedBonPlan, setSelectedBonPlan] = useState(null)

  const handleEdit = (bonPlan: any) => {
    setSelectedBonPlan(bonPlan)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedBonPlan(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bons Plans</h1>
          <p className="text-muted-foreground">
            Gérez les offres spéciales et promotions
          </p>
        </div>
      </div>

      <BonsPlansStats />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Bons Plans</CardTitle>
              <CardDescription>
                Créez et gérez vos offres spéciales
              </CardDescription>
            </div>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un bon plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <BonsPlansTable onEdit={handleEdit} />
        </CardContent>
      </Card>

      <BonsPlanModal
        open={showModal}
        onOpenChange={setShowModal}
        bonPlan={selectedBonPlan}
        onClose={handleCloseModal}
      />
    </div>
  )
}
