
-- Ajouter le champ is_active à la table activities
ALTER TABLE public.activities 
ADD COLUMN is_active boolean NOT NULL DEFAULT true;

-- Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN public.activities.is_active IS 'Indique si l''activité doit être affichée ou non';
