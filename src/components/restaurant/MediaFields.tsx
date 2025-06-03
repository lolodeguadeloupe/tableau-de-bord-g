
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RestaurantFormData, iconOptions } from "./restaurantSchema"

interface MediaFieldsProps {
  formData: RestaurantFormData
  onFieldChange: (field: string, value: string | number) => void
}

export function MediaFields({ formData, onFieldChange }: MediaFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon">Icône</Label>
          <Select value={formData.icon} onValueChange={(value) => onFieldChange('icon', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">URL de l'image</Label>
          <Input
            id="image"
            value={formData.image || ''}
            onChange={(e) => onFieldChange('image', e.target.value)}
            placeholder="https://exemple.com/image.jpg"
            type="url"
          />
        </div>
      </div>

      {formData.image && (
        <div className="space-y-2">
          <Label>Aperçu de l'image</Label>
          <img 
            src={formData.image} 
            alt="Aperçu" 
            className="w-full h-32 object-cover rounded border"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
    </>
  )
}
