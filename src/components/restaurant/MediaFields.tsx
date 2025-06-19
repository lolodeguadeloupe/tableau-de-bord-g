
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RestaurantFormData, iconOptions } from "./restaurantSchema"
import { ImageUploadSection } from "./ImageUploadSection"

interface MediaFieldsProps {
  formData: RestaurantFormData
  onFieldChange: (field: string, value: string | number | string[]) => void
}

export function MediaFields({ formData, onFieldChange }: MediaFieldsProps) {
  return (
    <>
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

      <ImageUploadSection
        formData={formData}
        onFieldChange={onFieldChange}
      />
    </>
  )
}
