
import React, { useState, useEffect } from "react"
import { Plus, Car, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/DataTable"
import { CarRentalModal } from "@/components/car-rental/CarRentalModal"
import { CarModelModal } from "@/components/car-rental/CarModelModal"
import { useCarRentalActions, CarRentalCompany, CarModel } from "@/hooks/useCarRentalActions"
import { useAuth } from "@/hooks/useAuth"

export default function CarRentals() {
  const { isAdmin } = useAuth()
  const { 
    fetchCompanies, 
    saveCompany, 
    deleteCompany,
    fetchCarModels,
    saveCarModel,
    deleteCarModel,
    loading 
  } = useCarRentalActions()

  const [companies, setCompanies] = useState<CarRentalCompany[]>([])
  const [carModels, setCarModels] = useState<CarModel[]>([])
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [isModelModalOpen, setIsModelModalOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<CarRentalCompany | null>(null)
  const [selectedModel, setSelectedModel] = useState<CarModel | null>(null)

  useEffect(() => {
    loadCompanies()
    loadCarModels()
  }, [])

  const loadCompanies = async () => {
    const data = await fetchCompanies()
    setCompanies(data)
  }

  const loadCarModels = async () => {
    const data = await fetchCarModels()
    setCarModels(data)
  }

  const handleSaveCompany = async (companyData: Partial<CarRentalCompany>) => {
    const result = await saveCompany(companyData)
    if (result) {
      setIsCompanyModalOpen(false)
      setSelectedCompany(null)
      loadCompanies()
    }
  }

  const handleEditCompany = (item: any) => {
    // Find the original company object using the string ID
    const company = companies.find(c => c.id.toString() === item.id)
    if (company) {
      setSelectedCompany(company)
      setIsCompanyModalOpen(true)
    }
  }

  const handleDeleteCompany = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette compagnie ?')) {
      const success = await deleteCompany(parseInt(id))
      if (success) {
        loadCompanies()
        loadCarModels() // Reload models as they might be affected
      }
    }
  }

  const handleSaveModel = async (modelData: Partial<CarModel>) => {
    const result = await saveCarModel(modelData)
    if (result) {
      setIsModelModalOpen(false)
      setSelectedModel(null)
      loadCarModels()
    }
  }

  const handleEditModel = (item: any) => {
    // Find the original model object using the string ID
    const model = carModels.find(m => m.id.toString() === item.id)
    if (model) {
      setSelectedModel(model)
      setIsModelModalOpen(true)
    }
  }

  const handleDeleteModel = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
      const success = await deleteCarModel(parseInt(id))
      if (success) {
        loadCarModels()
      }
    }
  }

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

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Accès refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Locations de Voitures</h1>
          <p className="text-gray-600">Gérez les compagnies de location et leurs véhicules</p>
        </div>
      </div>

      <Tabs defaultValue="companies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="companies">Compagnies</TabsTrigger>
          <TabsTrigger value="models">Modèles de voitures</TabsTrigger>
        </TabsList>

        <TabsContent value="companies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Compagnies de location ({companies.length})
              </CardTitle>
              <Button onClick={() => setIsCompanyModalOpen(true)}>
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
                onEdit={handleEditCompany}
                onDelete={handleDeleteCompany}
                hideSearch={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Modèles de voitures ({carModels.length})
              </CardTitle>
              <Button 
                onClick={() => setIsModelModalOpen(true)}
                disabled={companies.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un modèle
              </Button>
            </CardHeader>
            <CardContent>
              {companies.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Vous devez d'abord créer une compagnie avant d'ajouter des modèles.</p>
                </div>
              ) : (
                <DataTable
                  title="Liste des modèles"
                  data={enrichedModels.map(model => ({
                    ...model,
                    id: model.id.toString()
                  }))}
                  columns={modelColumns}
                  onEdit={handleEditModel}
                  onDelete={handleDeleteModel}
                  hideSearch={false}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CarRentalModal
        isOpen={isCompanyModalOpen}
        onClose={() => {
          setIsCompanyModalOpen(false)
          setSelectedCompany(null)
        }}
        onSave={handleSaveCompany}
        company={selectedCompany}
        loading={loading}
      />

      <CarModelModal
        isOpen={isModelModalOpen}
        onClose={() => {
          setIsModelModalOpen(false)
          setSelectedModel(null)
        }}
        onSave={handleSaveModel}
        model={selectedModel}
        companies={companies}
        loading={loading}
      />
    </div>
  )
}
