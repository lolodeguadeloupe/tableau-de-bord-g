
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X, Plus } from "lucide-react"

interface TagManagerProps {
  label: string
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder: string
  variant?: "secondary" | "outline"
  allowRemoveAll?: boolean
}

export function TagManager({ 
  label, 
  tags, 
  onTagsChange, 
  placeholder, 
  variant = "secondary",
  allowRemoveAll = true 
}: TagManagerProps) {
  const [newTag, setNewTag] = useState('')

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    if (!allowRemoveAll && tags.length <= 1) return
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex space-x-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder={placeholder}
          onKeyPress={handleKeyPress}
        />
        <Button type="button" onClick={addTag}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant={variant} className="flex items-center space-x-1">
            <span>{tag}</span>
            {(allowRemoveAll || tags.length > 1) && (
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeTag(tag)}
              />
            )}
          </Badge>
        ))}
      </div>
    </div>
  )
}
