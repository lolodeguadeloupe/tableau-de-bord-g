
-- Ajouter le champ rating à la table activities
ALTER TABLE public.activities 
ADD COLUMN rating numeric(3,2) DEFAULT 0.0;

-- Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN public.activities.rating IS 'Note de l''activité (0.0 à 5.0)';

-- Ajouter une contrainte pour s'assurer que la note est entre 0 et 5
ALTER TABLE public.activities 
ADD CONSTRAINT activities_rating_check CHECK (rating >= 0.0 AND rating <= 5.0);
