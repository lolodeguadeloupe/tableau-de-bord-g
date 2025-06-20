
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VoyanceMediumsTable } from "@/components/voyance/VoyanceMediumsTable"
import { VoyanceConsultationsTable } from "@/components/voyance/VoyanceConsultationsTable"
import { VoyanceReviewsTable } from "@/components/voyance/VoyanceReviewsTable"
import { VoyanceStats } from "@/components/voyance/VoyanceStats"
import { VoyanceMediumModal } from "@/components/voyance/VoyanceMediumModal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Voyance() {
  const [showMediumModal, setShowMediumModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voyance</h1>
          <p className="text-muted-foreground">
            Gérez les médiums, consultations et avis clients
          </p>
        </div>
      </div>

      <VoyanceStats />

      <Tabs defaultValue="mediums" className="space-y-4">
        <TabsList>
          <TabsTrigger value="mediums">Médiums</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
        </TabsList>

        <TabsContent value="mediums" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Médiums</CardTitle>
                  <CardDescription>
                    Gérez les profils des médiums et leurs disponibilités
                  </CardDescription>
                </div>
                <Button onClick={() => setShowMediumModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un médium
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <VoyanceMediumsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consultations</CardTitle>
              <CardDescription>
                Suivez les demandes de consultation et leur statut
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoyanceConsultationsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Avis clients</CardTitle>
              <CardDescription>
                Consultez les avis et évaluations des clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoyanceReviewsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <VoyanceMediumModal
        open={showMediumModal}
        onOpenChange={setShowMediumModal}
        medium={null}
      />
    </div>
  )
}
