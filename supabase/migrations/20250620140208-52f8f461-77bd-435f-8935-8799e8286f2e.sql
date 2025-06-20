
-- Créer une table pour les avantages des médiums
CREATE TABLE public.voyance_medium_advantages (
  id SERIAL PRIMARY KEY,
  medium_id INTEGER NOT NULL REFERENCES public.voyance_mediums(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'star',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer un index pour améliorer les performances
CREATE INDEX idx_voyance_medium_advantages_medium_id ON public.voyance_medium_advantages(medium_id);

-- Activer RLS (Row Level Security)
ALTER TABLE public.voyance_medium_advantages ENABLE ROW LEVEL SECURITY;

-- Créer des politiques RLS pour permettre à tous les utilisateurs authentifiés de voir les avantages
CREATE POLICY "Tout le monde peut voir les avantages des médiums" 
  ON public.voyance_medium_advantages 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Créer des politiques pour permettre aux admins de gérer les avantages
CREATE POLICY "Les admins peuvent insérer des avantages" 
  ON public.voyance_medium_advantages 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (public.is_admin());

CREATE POLICY "Les admins peuvent modifier des avantages" 
  ON public.voyance_medium_advantages 
  FOR UPDATE 
  TO authenticated 
  USING (public.is_admin());

CREATE POLICY "Les admins peuvent supprimer des avantages" 
  ON public.voyance_medium_advantages 
  FOR DELETE 
  TO authenticated 
  USING (public.is_admin());

-- Créer un trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_voyance_medium_advantages_updated_at
  BEFORE UPDATE ON public.voyance_medium_advantages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
