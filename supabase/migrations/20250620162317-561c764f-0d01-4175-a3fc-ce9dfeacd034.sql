
-- Ajouter le champ URL à la table bons_plans
ALTER TABLE public.bons_plans 
ADD COLUMN url text;

-- Ajouter un commentaire pour documenter ce champ
COMMENT ON COLUMN public.bons_plans.url IS 'URL de redirection vers une page interne ou externe';
