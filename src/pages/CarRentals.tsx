
import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CarRentalModal } from "@/components/car-rental/CarRentalModal"
import { CarModelModal } from "@/components/car-rental/CarModelModal"
import { CarCompanyTable } from "@/components/car-rental/CarCompanyTable"
import { CarModelTable } from "@/components/car-rental/CarModelTable"
import { CarRentalStats } from "@/components/car-rental/CarRentalStats"
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
    // Find the original company object using the string ID (UUID)
    const company = companies.find(c => c.id === item.id)
    if (company) {
      setSelectedCompany(company)
      setIsCompanyModalOpen(true)
    }
  }

  const handleDeleteCompany = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette compagnie ?')) {
      const success = await deleteCompany(id)
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
      <CarRentalStats 
        companiesCount={companies.length} 
        modelsCount={carModels.length} 
      />

      <Tabs defaultValue="companies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="companies">Compagnies</TabsTrigger>
          <TabsTrigger value="models">Modèles de voitures</TabsTrigger>
        </TabsList>

        <TabsContent value="companies">
          <CarCompanyTable
            companies={companies}
            onAddCompany={() => setIsCompanyModalOpen(true)}
            onEditCompany={handleEditCompany}
            onDeleteCompany={handleDeleteCompany}
          />
        </TabsContent>

        <TabsContent value="models">
          <CarModelTable
            carModels={carModels}
            companies={companies}
            onAddModel={() => setIsModelModalOpen(true)}
            onEditModel={handleEditModel}
            onDeleteModel={handleDeleteModel}
          />
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
