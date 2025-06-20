
-- Créer un bucket pour les images de voyance
INSERT INTO storage.buckets (id, name, public)
VALUES ('voyance-images', 'voyance-images', true);

-- Politique pour permettre à tous les utilisateurs authentifiés d'uploader des images
CREATE POLICY "Users can upload voyance images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'voyance-images' AND auth.role() = 'authenticated');

-- Politique pour permettre à tous de voir les images (public)
CREATE POLICY "Anyone can view voyance images"
ON storage.objects FOR SELECT
USING (bucket_id = 'voyance-images');

-- Politique pour permettre aux utilisateurs authentifiés de supprimer des images
CREATE POLICY "Users can delete voyance images"
ON storage.objects FOR DELETE
USING (bucket_id = 'voyance-images' AND auth.role() = 'authenticated');

-- Politique pour permettre aux utilisateurs authentifiés de mettre à jour des images
CREATE POLICY "Users can update voyance images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'voyance-images' AND auth.role() = 'authenticated');
