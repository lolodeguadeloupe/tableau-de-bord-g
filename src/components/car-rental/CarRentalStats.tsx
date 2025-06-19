
import React from "react"
import { Car } from "lucide-react"

interface CarRentalStatsProps {
  companiesCount: number
  modelsCount: number
}

export function CarRentalStats({ companiesCount, modelsCount }: CarRentalStatsProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Locations de Voitures</h1>
        <p className="text-gray-600">Gérez les compagnies de location et leurs véhicules</p>
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4" />
          <span>{companiesCount} compagnies</span>
        </div>
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4" />
          <span>{modelsCount} modèles</span>
        </div>
      </div>
    </div>
  )
}
