
import React from "react"
import { Plus, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/DataTable"
import { CarRentalCompany, CarModel } from "@/hooks/useCarRentalActions"

interface CarModelTableProps {
  carModels: CarModel[]
  companies: CarRentalCompany[]
  onAddModel: () => void
  onEditModel: (item: any) => void
  onDeleteModel: (id: string) => void
}

export function CarModelTable({ 
  carModels, 
  companies, 
  onAddModel, 
  onEditModel, 
  onDeleteModel 
}: CarModelTableProps) {
  const modelColumns = [
    { key: 'name', label: 'Modèle' },
    { 
      key: 'company_name', 
      label: 'Compagnie',
    },
    { key: 'category', label: 'Catégorie' },
    { 
      key: 'price_per_day', 
      label: 'Prix/jour',
    },
    { key: 'seats', label: 'Places' },
    { key: 'transmission', label: 'Transmission' },
    { 
      key: 'status', 
      label: 'Statut',
    }
  ]

  // Enrichir les données des modèles avec les noms des compagnies
  const enrichedModels = carModels.map(model => {
    const company = companies.find(c => c.id === model.company_id)
    return {
      ...model,
      company_name: company?.name || 'N/A',
      price_per_day: `${model.price_per_day}€`,
      status: (
        <Badge variant={model.is_active ? "default" : "secondary"}>
          {model.is_active ? 'Actif' : 'Inactif'}
        </Badge>
      )
    }
  })

  if (companies.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Modèles de voitures ({carModels.length})
          </CardTitle>
          <Button 
            onClick={onAddModel}
            disabled={companies.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un modèle
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">Vous devez d'abord créer une compagnie avant d'ajouter des modèles.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Modèles de voitures ({carModels.length})
        </CardTitle>
        <Button 
          onClick={onAddModel}
          disabled={companies.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un modèle
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          title="Liste des modèles"
          data={enrichedModels.map(model => ({
            ...model,
            id: model.id.toString()
          }))}
          columns={modelColumns}
          onEdit={onEditModel}
          onDelete={onDeleteModel}
          hideSearch={false}
        />
      </CardContent>
    </Card>
  )
}
