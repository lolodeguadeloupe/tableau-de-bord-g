
-- Créer un bucket pour stocker les images des loisirs
INSERT INTO storage.buckets (id, name, public)
VALUES ('loisir-images', 'loisir-images', true);

-- Créer une politique pour permettre à tous de voir les images
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'loisir-images');

-- Créer une politique pour permettre aux utilisateurs authentifiés d'uploader
CREATE POLICY "Authenticated users can upload loisir images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'loisir-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de supprimer leurs images
CREATE POLICY "Authenticated users can delete loisir images" ON storage.objects
FOR DELETE USING (bucket_id = 'loisir-images' AND auth.role() = 'authenticated');
