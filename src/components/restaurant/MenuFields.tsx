
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { RestaurantFormData } from "./restaurantSchema"
import { useEffect } from "react"

interface MenuFieldsProps {
  formData: RestaurantFormData
  onFieldChange: (field: string, value: RestaurantFormData[keyof RestaurantFormData]) => void
}

// Menus par défaut pour les nouveaux restaurants
const defaultMenus = [
  {
    name: "Entrées",
    items: [
      { name: "Salade César", price: 12 },
      { name: "Carpaccio de bœuf", price: 14 },
      { name: "Soupe du jour", price: 9 }
    ]
  },
  {
    name: "Plats principaux", 
    items: [
      { name: "Filet de bœuf, sauce au poivre", price: 28 },
      { name: "Risotto aux champignons", price: 21 },
      { name: "Poisson du jour", price: 24 }
    ]
  },
  {
    name: "Desserts",
    items: [
      { name: "Tiramisu maison", price: 9 },
      { name: "Crème brûlée", price: 8 },
      { name: "Mousse au chocolat", price: 7 }
    ]
  }
]

export function MenuFields({ formData, onFieldChange }: MenuFieldsProps) {
  // Initialiser avec des menus par défaut si aucun menu n'existe
  useEffect(() => {
    if (!formData.menus || formData.menus.length === 0) {
      console.log('🍽️ Initialisation des menus par défaut')
      onFieldChange("menus", defaultMenus)
    }
  }, [formData.menus, onFieldChange])

  const addMenuSection = () => {
    const newMenus = [...(formData.menus || []), { name: "", items: [{ name: "", price: 0 }] }]
    onFieldChange("menus", newMenus)
  }

  const removeMenuSection = (sectionIndex: number) => {
    const newMenus = formData.menus?.filter((_, index) => index !== sectionIndex) || []
    onFieldChange("menus", newMenus)
  }

  const updateMenuSection = (sectionIndex: number, field: string, value: string) => {
    const newMenus = [...(formData.menus || [])]
    newMenus[sectionIndex] = { ...newMenus[sectionIndex], [field]: value }
    onFieldChange("menus", newMenus)
  }

  const addMenuItem = (sectionIndex: number) => {
    const newMenus = [...(formData.menus || [])]
    newMenus[sectionIndex].items.push({ name: "", price: 0 })
    onFieldChange("menus", newMenus)
  }

  const removeMenuItem = (sectionIndex: number, itemIndex: number) => {
    const newMenus = [...(formData.menus || [])]
    newMenus[sectionIndex].items = newMenus[sectionIndex].items.filter((_, index) => index !== itemIndex)
    onFieldChange("menus", newMenus)
  }

  const updateMenuItem = (sectionIndex: number, itemIndex: number, field: string, value: string | number) => {
    const newMenus = [...(formData.menus || [])]
    newMenus[sectionIndex].items[itemIndex] = { ...newMenus[sectionIndex].items[itemIndex], [field]: value }
    onFieldChange("menus", newMenus)
  }

  const resetToDefaultMenus = () => {
    console.log('🔄 Réinitialisation aux menus par défaut')
    onFieldChange("menus", defaultMenus)
  }

  // Assurer qu'il y a toujours un tableau de menus
  const menus = formData.menus || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Menus</Label>
        <div className="flex gap-2">
          <Button 
            type="button" 
            onClick={resetToDefaultMenus} 
            size="sm"
            variant="outline"
          >
            Menus par défaut
          </Button>
          <Button type="button" onClick={addMenuSection} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une section
          </Button>
        </div>
      </div>

      {menus.map((section, sectionIndex) => (
        <Card key={sectionIndex} className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Section {sectionIndex + 1}</CardTitle>
              {formData.menus!.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeMenuSection(sectionIndex)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`section-name-${sectionIndex}`}>Nom de la section</Label>
              <Input
                id={`section-name-${sectionIndex}`}
                value={section.name}
                onChange={(e) => updateMenuSection(sectionIndex, "name", e.target.value)}
                placeholder="Ex: Entrées, Plats principaux, Desserts..."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Plats</Label>
                <Button
                  type="button"
                  onClick={() => addMenuItem(sectionIndex)}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un plat
                </Button>
              </div>

              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`item-name-${sectionIndex}-${itemIndex}`} className="text-sm">
                      Nom du plat
                    </Label>
                    <Input
                      id={`item-name-${sectionIndex}-${itemIndex}`}
                      value={item.name}
                      onChange={(e) => updateMenuItem(sectionIndex, itemIndex, "name", e.target.value)}
                      placeholder="Nom du plat"
                    />
                  </div>
                  <div className="w-24">
                    <Label htmlFor={`item-price-${sectionIndex}-${itemIndex}`} className="text-sm">
                      Prix (€)
                    </Label>
                    <Input
                      id={`item-price-${sectionIndex}-${itemIndex}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price}
                      onChange={(e) => updateMenuItem(sectionIndex, itemIndex, "price", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  {section.items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMenuItem(sectionIndex, itemIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
