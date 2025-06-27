
-- Créer un bucket pour les images des voyages (s'il n'existe pas déjà)
INSERT INTO storage.buckets (id, name, public)
VALUES ('travel-images', 'travel-images', true)
ON CONFLICT (id) DO NOTHING;

-- Créer une politique pour permettre aux utilisateurs authentifiés d'uploader des images
CREATE POLICY "Authenticated users can upload travel images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'travel-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de supprimer leurs images
CREATE POLICY "Authenticated users can delete travel images" ON storage.objects
FOR DELETE USING (bucket_id = 'travel-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de mettre à jour leurs images
CREATE POLICY "Authenticated users can update travel images" ON storage.objects
FOR UPDATE USING (bucket_id = 'travel-images' AND auth.role() = 'authenticated');
