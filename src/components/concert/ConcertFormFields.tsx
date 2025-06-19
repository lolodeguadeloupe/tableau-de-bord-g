
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"
import type { Concert } from "@/types/concert"

interface ConcertFormFieldsProps {
  formData: Partial<Concert>
  onUpdateFormData: (updates: Partial<Concert>) => void
  onImagesChange: (images: string[]) => void
}

export function ConcertFormFields({ formData, onUpdateFormData, onImagesChange }: ConcertFormFieldsProps) {
  const genres = [
    'Zouk',
    'Reggae',
    'Jazz & Biguine',
    'Électro / Dance',
    'Gospel',
    'Blues',
    'Pop',
    'Rock',
    'R&B',
    'Rap',
    'Salsa',
    'Autre'
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du concert *</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => onUpdateFormData({ name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="artist">Artiste *</Label>
          <Input
            id="artist"
            value={formData.artist || ''}
            onChange={(e) => onUpdateFormData({ artist: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="genre">Genre musical *</Label>
          <Select
            value={formData.genre || ''}
            onValueChange={(value) => onUpdateFormData({ genre: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Note (sur 5) *</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating || ''}
            onChange={(e) => onUpdateFormData({ rating: parseFloat(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Images du concert</Label>
        <MultiImageUpload
          images={formData.gallery_images || []}
          onImagesChange={onImagesChange}
          bucketName="concert-images"
          maxImages={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Lieu *</Label>
        <Input
          id="location"
          value={formData.location || ''}
          onChange={(e) => onUpdateFormData({ location: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            value={formData.date || ''}
            onChange={(e) => onUpdateFormData({ date: e.target.value })}
            placeholder="ex: 15 juillet 2024"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Heure *</Label>
          <Input
            id="time"
            value={formData.time || ''}
            onChange={(e) => onUpdateFormData({ time: e.target.value })}
            placeholder="ex: 20:00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Prix (€) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={formData.price || ''}
            onChange={(e) => onUpdateFormData({ price: parseFloat(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => onUpdateFormData({ description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="offer">Offre Club Créole *</Label>
        <Textarea
          id="offer"
          value={formData.offer || ''}
          onChange={(e) => onUpdateFormData({ offer: e.target.value })}
          rows={2}
          required
        />
      </div>
    </>
  )
}
