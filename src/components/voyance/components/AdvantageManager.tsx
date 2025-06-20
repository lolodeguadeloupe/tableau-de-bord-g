
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Star, Award, Shield, Clock, Heart, Zap, Target, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Advantage {
  id?: number
  title: string
  description: string
  icon: string
  is_active: boolean
  sort_order: number
}

interface AdvantageManagerProps {
  mediumId?: number
  advantages: Advantage[]
  onAdvantagesChange: (advantages: Advantage[]) => void
}

const iconOptions = [
  { value: 'star', label: 'Étoile', icon: Star },
  { value: 'award', label: 'Récompense', icon: Award },
  { value: 'shield', label: 'Bouclier', icon: Shield },
  { value: 'clock', label: 'Horloge', icon: Clock },
  { value: 'heart', label: 'Cœur', icon: Heart },
  { value: 'zap', label: 'Éclair', icon: Zap },
  { value: 'target', label: 'Cible', icon: Target },
  { value: 'check-circle', label: 'Validé', icon: CheckCircle },
]

export function AdvantageManager({ advantages, onAdvantagesChange }: AdvantageManagerProps) {
  const [newAdvantage, setNewAdvantage] = useState<Advantage>({
    title: '',
    description: '',
    icon: 'star',
    is_active: true,
    sort_order: 0
  })
  const [isAdding, setIsAdding] = useState(false)

  const addAdvantage = () => {
    if (newAdvantage.title.trim() && newAdvantage.description.trim()) {
      const updatedAdvantages = [...advantages, { 
        ...newAdvantage, 
        sort_order: advantages.length 
      }]
      onAdvantagesChange(updatedAdvantages)
      setNewAdvantage({
        title: '',
        description: '',
        icon: 'star',
        is_active: true,
        sort_order: 0
      })
      setIsAdding(false)
    }
  }

  const removeAdvantage = (index: number) => {
    const updatedAdvantages = advantages.filter((_, i) => i !== index)
    onAdvantagesChange(updatedAdvantages)
  }

  const toggleAdvantageStatus = (index: number) => {
    const updatedAdvantages = advantages.map((advantage, i) => 
      i === index ? { ...advantage, is_active: !advantage.is_active } : advantage
    )
    onAdvantagesChange(updatedAdvantages)
  }

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.value === iconName)
    return iconOption ? iconOption.icon : Star
  }

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Avantages du médium</Label>
      
      {/* Liste des avantages existants */}
      <div className="space-y-3">
        {advantages.map((advantage, index) => {
          const IconComponent = getIconComponent(advantage.icon)
          return (
            <Card key={index} className={`${!advantage.is_active ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{advantage.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={advantage.is_active ? "default" : "secondary"}
                          className="cursor-pointer text-xs"
                          onClick={() => toggleAdvantageStatus(index)}
                        >
                          {advantage.is_active ? "Actif" : "Inactif"}
                        </Badge>
                        <X
                          className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
                          onClick={() => removeAdvantage(index)}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{advantage.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Formulaire d'ajout */}
      {isAdding ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Nouvel avantage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="advantage-title">Titre</Label>
              <Input
                id="advantage-title"
                value={newAdvantage.title}
                onChange={(e) => setNewAdvantage({ ...newAdvantage, title: e.target.value })}
                placeholder="Ex: Consultation rapide"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="advantage-description">Description</Label>
              <Textarea
                id="advantage-description"
                value={newAdvantage.description}
                onChange={(e) => setNewAdvantage({ ...newAdvantage, description: e.target.value })}
                placeholder="Décrivez cet avantage..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="advantage-icon">Icône</Label>
              <Select
                value={newAdvantage.icon}
                onValueChange={(value) => setNewAdvantage({ ...newAdvantage, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button onClick={addAdvantage} size="sm">
                Ajouter
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAdding(false)} 
                size="sm"
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un avantage
        </Button>
      )}
    </div>
  )
}
