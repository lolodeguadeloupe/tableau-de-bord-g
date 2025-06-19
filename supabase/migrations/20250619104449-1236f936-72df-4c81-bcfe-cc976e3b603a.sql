
-- Ajouter une colonne gallery_images à la table nightlife_events pour stocker les images
ALTER TABLE nightlife_events ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;

-- Créer un bucket pour les images des soirées (s'il n'existe pas déjà)
INSERT INTO storage.buckets (id, name, public)
VALUES ('nightlife-images', 'nightlife-images', true)
ON CONFLICT (id) DO NOTHING;

-- Créer une politique pour permettre aux utilisateurs authentifiés d'uploader des images
CREATE POLICY "Authenticated users can upload nightlife images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'nightlife-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de supprimer leurs images
CREATE POLICY "Authenticated users can delete nightlife images" ON storage.objects
FOR DELETE USING (bucket_id = 'nightlife-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de mettre à jour leurs images
CREATE POLICY "Authenticated users can update nightlife images" ON storage.objects
FOR UPDATE USING (bucket_id = 'nightlife-images' AND auth.role() = 'authenticated');
