
-- Activer RLS sur les tables de location de voitures
ALTER TABLE public.car_rental_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_rental_features ENABLE ROW LEVEL SECURITY;

-- Politiques pour car_rental_companies
CREATE POLICY "Admins can view all car rental companies"
  ON public.car_rental_companies
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert car rental companies"
  ON public.car_rental_companies
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update car rental companies"
  ON public.car_rental_companies
  FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete car rental companies"
  ON public.car_rental_companies
  FOR DELETE
  USING (public.is_admin());

-- Politiques pour car_models
CREATE POLICY "Admins can view all car models"
  ON public.car_models
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert car models"
  ON public.car_models
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update car models"
  ON public.car_models
  FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete car models"
  ON public.car_models
  FOR DELETE
  USING (public.is_admin());

-- Politiques pour car_rental_features
CREATE POLICY "Admins can view all car rental features"
  ON public.car_rental_features
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert car rental features"
  ON public.car_rental_features
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update car rental features"
  ON public.car_rental_features
  FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete car rental features"
  ON public.car_rental_features
  FOR DELETE
  USING (public.is_admin());
