
import React from "react"
import { Plus, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/DataTable"
import { CarRentalCompany } from "@/hooks/useCarRentalActions"

interface CarCompanyTableProps {
  companies: CarRentalCompany[]
  onAddCompany: () => void
  onEditCompany: (item: any) => void
  onDeleteCompany: (id: string) => void
}

export function CarCompanyTable({ 
  companies, 
  onAddCompany, 
  onEditCompany, 
  onDeleteCompany 
}: CarCompanyTableProps) {
  const companyColumns = [
    { key: 'name', label: 'Nom' },
    { key: 'type', label: 'Type' },
    { key: 'location', label: 'Localisation' },
    { 
      key: 'rating', 
      label: 'Note',
    },
    { key: 'offer', label: 'Offre' }
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Compagnies de location ({companies.length})
        </CardTitle>
        <Button onClick={onAddCompany}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une compagnie
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          title="Liste des compagnies"
          data={companies.map(company => ({
            ...company,
            id: company.id.toString(),
            rating: `${company.rating}/5`
          }))}
          columns={companyColumns}
          onEdit={onEditCompany}
          onDelete={onDeleteCompany}
          hideSearch={false}
        />
      </CardContent>
    </Card>
  )
}
