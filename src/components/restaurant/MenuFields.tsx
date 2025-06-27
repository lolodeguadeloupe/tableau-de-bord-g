import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"

interface MenuItem {
  name: string
  price: number
}

interface MenuSection {
  name: string
  items: MenuItem[]
}

interface MenuFieldsProps {
  menus: MenuSection[]
  onMenusChange: (menus: MenuSection[]) => void
}
// Les menus doivent être chargés depuis la base de données Supabase
// Dans RestaurantForm.tsx, il faut modifier:

// 1. Supprimer l'initialisation à vide de menus:
// const [formData, setFormData] = useState<RestaurantFormData>({
//   ...
//   menus: [] // <- À SUPPRIMER
// })

// 2. Charger les menus depuis Supabase dans le useEffect:
// useEffect(() => {
//   const loadRestaurant = async () => {
//     const { data, error } = await supabase
//       .from('restaurants')
//       .select('*, menus')
//       .eq('id', restaurantId)
//       .single()
//     
//     if (data) {
//       setFormData({
//         ...data,
//         menus: data.menus || [] // Fallback à [] uniquement si null
//       })
//     }
//   }
//   loadRestaurant()
// }, [restaurantId])



export function MenuFields({ menus, onMenusChange }: MenuFieldsProps) {
  console.log('📋 MenuFields - menus reçus:', menus)
  
  const addMenuSection = () => {
    const newSection: MenuSection = {
      name: "",
      items: [{ name: "", price: 0 }]
    }
    onMenusChange([...menus, newSection])
  }

  const removeMenuSection = (sectionIndex: number) => {
    const updatedMenus = menus.filter((_, index) => index !== sectionIndex)
    onMenusChange(updatedMenus)
  }

  const updateSectionName = (sectionIndex: number, name: string) => {
    const updatedMenus = menus.map((section, index) =>
      index === sectionIndex ? { ...section, name } : section
    )
    onMenusChange(updatedMenus)
  }

  const addMenuItem = (sectionIndex: number) => {
    const updatedMenus = menus.map((section, index) =>
      index === sectionIndex
        ? { ...section, items: [...section.items, { name: "", price: 0 }] }
        : section
    )
    onMenusChange(updatedMenus)
  }

  const removeMenuItem = (sectionIndex: number, itemIndex: number) => {
    const updatedMenus = menus.map((section, index) =>
      index === sectionIndex
        ? { ...section, items: section.items.filter((_, i) => i !== itemIndex) }
        : section
    )
    onMenusChange(updatedMenus)
  }

  const updateMenuItem = (sectionIndex: number, itemIndex: number, field: 'name' | 'price', value: string | number) => {
    const updatedMenus = menus.map((section, index) =>
      index === sectionIndex
        ? {
            ...section,
            items: section.items.map((item, i) =>
              i === itemIndex ? { ...item, [field]: value } : item
            )
          }
        : section
    )
    onMenusChange(updatedMenus)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Menus</Label>
        <Button type="button" onClick={addMenuSection} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une section
        </Button>
      </div>

      {menus.map((section, sectionIndex) => (
        <Card key={sectionIndex} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Section {sectionIndex + 1}</CardTitle>
              <Button
                type="button"
                onClick={() => removeMenuSection(sectionIndex)}
                size="sm"
                variant="destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <Input
                placeholder="Nom de la section (ex: Entrées, Plats principaux...)"
                value={section.name}
                onChange={(e) => updateSectionName(sectionIndex, e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    placeholder="Nom du plat"
                    value={item.name}
                    onChange={(e) => updateMenuItem(sectionIndex, itemIndex, 'name', e.target.value)}
                  />
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    placeholder="Prix"
                    value={item.price || ''}
                    onChange={(e) => updateMenuItem(sectionIndex, itemIndex, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => removeMenuItem(sectionIndex, itemIndex)}
                  size="sm"
                  variant="outline"
                  disabled={section.items.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => addMenuItem(sectionIndex)}
              size="sm"
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un plat
            </Button>
          </CardContent>
        </Card>
      ))}

      {menus.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Aucun menu ajouté</p>
          <p className="text-sm">Cliquez sur "Ajouter une section" pour commencer</p>
        </div>
      )}
    </div>
  )
}