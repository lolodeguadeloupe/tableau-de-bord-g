
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Amenity {
  name: string
  available: boolean
}

interface AmenitiesManagerProps {
  amenities: Amenity[]
  onAmenitiesChange: (amenities: Amenity[]) => void
}

export function AmenitiesManager({ amenities, onAmenitiesChange }: AmenitiesManagerProps) {
  const [newAmenityName, setNewAmenityName] = useState('')

  const addAmenity = () => {
    if (newAmenityName.trim() && !amenities.some(amenity => amenity.name === newAmenityName.trim())) {
      const newAmenity: Amenity = {
        name: newAmenityName.trim(),
        available: true
      }
      onAmenitiesChange([...amenities, newAmenity])
      setNewAmenityName('')
    }
  }

  const removeAmenity = (nameToRemove: string) => {
    onAmenitiesChange(amenities.filter(amenity => amenity.name !== nameToRemove))
  }

  const toggleAvailability = (name: string) => {
    onAmenitiesChange(
      amenities.map(amenity =>
        amenity.name === name
          ? { ...amenity, available: !amenity.available }
          : amenity
      )
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addAmenity()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Équipements et services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulaire d'ajout */}
        <div className="space-y-2">
          <Label htmlFor="new-amenity">Ajouter un équipement</Label>
          <div className="flex space-x-2">
            <Input
              id="new-amenity"
              value={newAmenityName}
              onChange={(e) => setNewAmenityName(e.target.value)}
              placeholder="Nom de l'équipement (ex: WiFi gratuit)"
              onKeyPress={handleKeyPress}
            />
            <Button type="button" onClick={addAmenity} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Liste des équipements */}
        <div className="space-y-2">
          <Label>Équipements configurés ({amenities.length})</Label>
          {amenities.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun équipement configuré</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {amenities.map((amenity) => (
                <div
                  key={amenity.name}
                  className={`flex items-center justify-between p-2 border rounded-md ${
                    amenity.available ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <Checkbox
                      checked={amenity.available}
                      onCheckedChange={() => toggleAvailability(amenity.name)}
                    />
                    <span className={`text-sm ${
                      amenity.available ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {amenity.name}
                    </span>
                    <Badge variant={amenity.available ? "default" : "secondary"} className="text-xs">
                      {amenity.available ? "Disponible" : "Non disponible"}
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAmenity(amenity.name)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Résumé */}
        {amenities.length > 0 && (
          <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
            {amenities.filter(a => a.available).length} équipement(s) disponible(s) sur {amenities.length} total
          </div>
        )}
      </CardContent>
    </Card>
  )
}
