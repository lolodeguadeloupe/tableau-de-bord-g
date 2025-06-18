
import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface MultiImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  bucketName: string
  maxImages?: number
  className?: string
}

export function MultiImageUpload({ 
  images, 
  onImagesChange, 
  bucketName, 
  maxImages = 5,
  className = "" 
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Image placeholder par défaut
  const defaultPlaceholder = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=center"

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      
      if (!event.target.files || event.target.files.length === 0) {
        return
      }

      const file = event.target.files[0]
      
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un fichier image.",
          variant: "destructive",
        })
        return
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "La taille du fichier ne doit pas dépasser 5MB.",
          variant: "destructive",
        })
        return
      }

      // Vérifier le nombre maximum d'images
      if (images.length >= maxImages) {
        toast({
          title: "Erreur",
          description: `Vous ne pouvez pas ajouter plus de ${maxImages} images.`,
          variant: "destructive",
        })
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`

      console.log('📤 Upload de l\'image:', fileName)

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file)

      if (uploadError) {
        console.error('❌ Erreur upload:', uploadError)
        throw uploadError
      }

      // Obtenir l'URL publique
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName)

      console.log('✅ Image uploadée:', data.publicUrl)
      
      const newImages = [...images, data.publicUrl]
      onImagesChange(newImages)
      
      toast({
        title: "Image uploadée",
        description: "L'image a été uploadée avec succès.",
      })

      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('💥 Erreur lors de l\'upload:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'uploader l'image.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
  }

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Images existantes */}
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <div className="relative aspect-square">
              <img
                src={imageUrl}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border"
              />
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Photo principale
                </div>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-6 w-6 rounded-full p-0"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              {/* Boutons de réorganisation */}
              {index > 0 && (
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 rounded-full p-0 bg-white"
                    onClick={() => moveImage(index, index - 1)}
                  >
                    ←
                  </Button>
                </div>
              )}
              {index < images.length - 1 && (
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 rounded-full p-0 bg-white"
                    onClick={() => moveImage(index, index + 1)}
                  >
                    →
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Placeholder si aucune image */}
        {images.length === 0 && (
          <div className="relative aspect-square">
            <img
              src={defaultPlaceholder}
              alt="Image placeholder"
              className="w-full h-full object-cover rounded-lg border opacity-50"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                <span className="text-sm">Photo principale</span>
              </div>
            </div>
          </div>
        )}

        {/* Bouton d'ajout d'image */}
        {images.length < maxImages && (
          <div className="relative aspect-square">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={uploadImage}
              disabled={uploading}
              className="hidden"
            />
            <div 
              onClick={handleAddImageClick}
              className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            >
              <div className="text-center">
                {uploading ? (
                  <div className="text-gray-500">
                    <Upload className="h-6 w-6 mx-auto mb-2 animate-spin" />
                    <span className="text-sm">Upload...</span>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <Plus className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Ajouter une image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        <p>• La première image sera utilisée comme photo principale</p>
        <p>• Vous pouvez ajouter jusqu'à {maxImages} images</p>
        <p>• Utilisez les flèches pour réorganiser les images</p>
        <p>• Taille maximum : 5MB par image</p>
      </div>
    </div>
  )
}
