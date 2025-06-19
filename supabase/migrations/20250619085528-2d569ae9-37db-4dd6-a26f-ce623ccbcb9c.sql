
-- Créer un bucket pour les images des concerts (s'il n'existe pas déjà)
INSERT INTO storage.buckets (id, name, public)
VALUES ('concert-images', 'concert-images', true)
ON CONFLICT (id) DO NOTHING;

-- Créer une politique pour permettre aux utilisateurs authentifiés d'uploader des images
CREATE POLICY "Authenticated users can upload concert images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'concert-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de supprimer leurs images
CREATE POLICY "Authenticated users can delete concert images" ON storage.objects
FOR DELETE USING (bucket_id = 'concert-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de mettre à jour leurs images
CREATE POLICY "Authenticated users can update concert images" ON storage.objects
FOR UPDATE USING (bucket_id = 'concert-images' AND auth.role() = 'authenticated');

-- Ajouter une colonne gallery_images à la table concerts pour stocker les images
ALTER TABLE concerts ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;
