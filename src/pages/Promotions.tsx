
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PromotionTable } from "@/components/promotions/PromotionTable"
import { PromotionModal } from "@/components/promotions/PromotionModal"
import { PromotionStats } from "@/components/promotions/PromotionStats"
import { usePromotionActions, type Promotion } from "@/hooks/usePromotionActions"

export default function Promotions() {
  const [showModal, setShowModal] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { fetchPromotions, handleDelete, savePromotion, toggleVisibility } = usePromotionActions()

  const loadPromotions = async () => {
    setIsLoading(true)
    const data = await fetchPromotions()
    setPromotions(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadPromotions()
  }, [])

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedPromotion(null)
  }

  const handleSave = async (promotionData: Partial<Promotion>) => {
    const result = await savePromotion(promotionData)
    if (result) {
      await loadPromotions()
    }
    return result
  }

  const handleDeletePromotion = async (id: number) => {
    const success = await handleDelete(id)
    if (success) {
      await loadPromotions()
    }
  }

  const handleToggleVisibility = async (promotion: Promotion) => {
    const success = await toggleVisibility(promotion)
    if (success) {
      await loadPromotions()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
          <p className="text-muted-foreground">
            Gérez les promotions et offres spéciales
          </p>
        </div>
      </div>

      <PromotionStats promotions={promotions} />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Promotions</CardTitle>
              <CardDescription>
                Créez et gérez vos promotions
              </CardDescription>
            </div>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle promotion
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-8">
              <p>Chargement des promotions...</p>
            </div>
          ) : (
            <PromotionTable
              promotions={promotions}
              onEdit={handleEdit}
              onDelete={handleDeletePromotion}
              onToggleVisibility={handleToggleVisibility}
            />
          )}
        </CardContent>
      </Card>

      <PromotionModal
        isOpen={showModal}
        onClose={handleCloseModal}
        promotion={selectedPromotion}
        onSave={handleSave}
      />
    </div>
  )
}
