
import { useState } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface ImageUploadProps {
  value?: string
  onImageChange: (url: string) => void
  bucketName: string
  className?: string
}

export function ImageUpload({ value, onImageChange, bucketName, className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

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
      
      onImageChange(data.publicUrl)
      
      toast({
        title: "Image uploadée",
        description: "L'image a été uploadée avec succès.",
      })
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

  const removeImage = () => {
    onImageChange('')
  }

  // Afficher l'image existante, ou le placeholder par défaut si pas d'image
  const displayImage = value || defaultPlaceholder

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative inline-block">
        <img
          src={displayImage}
          alt={value ? "Image uploadée" : "Image placeholder"}
          className="w-32 h-32 object-cover rounded-lg border"
        />
        {value && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {!value && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="text-white text-center">
              <ImageIcon className="h-6 w-6 mx-auto mb-1" />
              <span className="text-xs">Placeholder</span>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={uploadImage}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            asChild
          >
            <span className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Upload..." : "Choisir une image"}
            </span>
          </Button>
        </label>
      </div>
    </div>
  )
}
