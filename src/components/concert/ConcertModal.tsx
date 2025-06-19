
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"
import type { Concert } from "@/types/concert"

interface ConcertModalProps {
  isOpen: boolean
  onClose: () => void
  concert?: Concert | null
  onSave: (concert: Partial<Concert>) => Promise<Concert | null>
}

export function ConcertModal({ isOpen, onClose, concert, onSave }: ConcertModalProps) {
  const [formData, setFormData] = useState<Partial<Concert>>({
    name: '',
    artist: '',
    genre: '',
    image: '',
    location: '',
    description: '',
    date: '',
    time: '',
    price: 0,
    offer: '',
    rating: 4.5,
    icon: 'Music',
    gallery_images: []
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (concert) {
      // Initialize gallery images with existing image as first item if gallery is empty
      let initialGalleryImages = concert.gallery_images || []
      
      // If we have an existing image but no gallery images, add the existing image as the first gallery image
      if (concert.image && (!initialGalleryImages || initialGalleryImages.length === 0)) {
        initialGalleryImages = [concert.image]
      }
      
      // If we have an existing image and gallery images, but the existing image is not in the gallery, add it as first
      if (concert.image && initialGalleryImages && initialGalleryImages.length > 0 && !initialGalleryImages.includes(concert.image)) {
        initialGalleryImages = [concert.image, ...initialGalleryImages]
      }

      setFormData({
        ...concert,
        gallery_images: initialGalleryImages
      })
    } else {
      setFormData({
        name: '',
        artist: '',
        genre: '',
        image: '',
        location: '',
        description: '',
        date: '',
        time: '',
        price: 0,
        offer: '',
        rating: 4.5,
        icon: 'Music',
        gallery_images: []
      })
    }
  }, [concert, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Set the main image as the first gallery image if gallery_images exist
      const finalFormData = {
        ...formData,
        image: formData.gallery_images && formData.gallery_images.length > 0 
          ? formData.gallery_images[0] 
          : formData.image
      }

      const result = await onSave(finalFormData)
      if (result) {
        onClose()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleImagesChange = (images: string[]) => {
    setFormData({ 
      ...formData, 
      gallery_images: images,
      // Update the main image with the first gallery image
      image: images.length > 0 ? images[0] : formData.image
    })
  }

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {concert ? 'Modifier le concert' : 'Nouveau concert'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du concert *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">Artiste *</Label>
              <Input
                id="artist"
                value={formData.artist || ''}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre musical *</Label>
              <Select
                value={formData.genre || ''}
                onValueChange={(value) => setFormData({ ...formData, genre: value })}
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
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Images du concert</Label>
            <MultiImageUpload
              images={formData.gallery_images || []}
              onImagesChange={handleImagesChange}
              bucketName="concert-images"
              maxImages={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lieu *</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="ex: 15 juillet 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Heure *</Label>
              <Input
                id="time"
                value={formData.time || ''}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offer">Offre Club Créole *</Label>
            <Textarea
              id="offer"
              value={formData.offer || ''}
              onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
              rows={2}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
