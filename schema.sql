-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.accommodations (
  id integer NOT NULL DEFAULT nextval('accommodations_id_seq'::regclass),
  name text NOT NULL,
  type text NOT NULL,
  location text NOT NULL,
  price numeric NOT NULL,
  rating numeric NOT NULL,
  image text NOT NULL,
  gallery_images jsonb NOT NULL,
  features jsonb NOT NULL,
  description text NOT NULL,
  rooms integer NOT NULL,
  bathrooms integer NOT NULL,
  max_guests integer NOT NULL,
  amenities jsonb NOT NULL,
  rules jsonb NOT NULL,
  discount integer,
  CONSTRAINT accommodations_pkey PRIMARY KEY (id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.activity_images (
  id integer NOT NULL DEFAULT nextval('activity_images_id_seq'::regclass),
  activity_id integer NOT NULL,
  url text NOT NULL,
  alt_text text NOT NULL,
  title text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_images_pkey PRIMARY KEY (id),
  CONSTRAINT activity_images_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.leisure_activities(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.activity_inclusions (
  id integer NOT NULL DEFAULT nextval('activity_inclusions_id_seq'::regclass),
  activity_id integer NOT NULL,
  inclusion_text text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_inclusions_pkey PRIMARY KEY (id),
  CONSTRAINT activity_inclusions_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.leisure_activities(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.activity_levels (
  id integer NOT NULL DEFAULT nextval('activity_levels_id_seq'::regclass),
  activity_id integer NOT NULL,
  level_name text NOT NULL,
  level_description text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_levels_pkey PRIMARY KEY (id),
  CONSTRAINT activity_levels_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.leisure_activities(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.activity_reservations (
  id integer NOT NULL DEFAULT nextval('activity_reservations_id_seq'::regclass),
  activity_id integer NOT NULL,
  user_id uuid,
  reservation_date date NOT NULL,
  time_slot time without time zone NOT NULL,
  number_of_participants integer NOT NULL DEFAULT 1,
  total_price integer NOT NULL,
  participant_names ARRAY NOT NULL,
  participant_levels ARRAY NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  special_requests text,
  status text NOT NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_reservations_pkey PRIMARY KEY (id),
  CONSTRAINT activity_reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT activity_reservations_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.leisure_activities(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.activity_time_slots (
  id integer NOT NULL DEFAULT nextval('activity_time_slots_id_seq'::regclass),
  activity_id integer NOT NULL,
  time_slot time without time zone NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_time_slots_pkey PRIMARY KEY (id),
  CONSTRAINT activity_time_slots_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.leisure_activities(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.car_client_reviews (
  id integer NOT NULL DEFAULT nextval('car_client_reviews_id_seq'::regclass),
  name text NOT NULL,
  location text NOT NULL,
  avatar text NOT NULL,
  comment text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_date date NOT NULL,
  rental_company_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT car_client_reviews_pkey PRIMARY KEY (id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.car_models (
  id integer NOT NULL DEFAULT nextval('car_models_id_seq'::regclass),
  company_id integer NOT NULL,
  name text NOT NULL,
  image text NOT NULL,
  price_per_day integer NOT NULL,
  category text NOT NULL,
  seats integer NOT NULL,
  transmission text NOT NULL,
  air_con boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT car_models_pkey PRIMARY KEY (id),
  CONSTRAINT car_models_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.car_rental_companies(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.car_rental_companies (
  id integer NOT NULL DEFAULT nextval('car_rental_companies_id_seq'::regclass),
  name text NOT NULL,
  type text NOT NULL,
  image text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  rating numeric NOT NULL,
  offer text NOT NULL,
  icon_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  partner_id uuid,
  CONSTRAINT car_rental_companies_pkey PRIMARY KEY (id),
  CONSTRAINT car_rental_companies_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.profiles(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.car_rental_features (
  id integer NOT NULL DEFAULT nextval('car_rental_features_id_seq'::regclass),
  company_id integer NOT NULL,
  feature text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT car_rental_features_pkey PRIMARY KEY (id),
  CONSTRAINT car_rental_features_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.car_rental_companies(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.car_rental_reservations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rental_company_name text NOT NULL,
  selected_model text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  driver_name text NOT NULL,
  driver_email text NOT NULL,
  driver_phone text NOT NULL,
  status text NOT NULL DEFAULT 'confirmed'::text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  partner_id uuid,
  CONSTRAINT car_rental_reservations_pkey PRIMARY KEY (id),
  CONSTRAINT car_rental_reservations_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.profiles(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.diving_reservations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reservation_date date NOT NULL,
  reservation_time text NOT NULL,
  participant_name text NOT NULL,
  participant_email text NOT NULL,
  participant_phone text NOT NULL,
  experience_level text NOT NULL DEFAULT 'beginner'::text,
  special_requests text,
  status text NOT NULL DEFAULT 'confirmed'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT diving_reservations_pkey PRIMARY KEY (id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.fleet_managers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  company_id integer NOT NULL,
  permissions jsonb DEFAULT '{"manage_vehicles": true, "view_reservations": true, "manage_reservations": false}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fleet_managers_pkey PRIMARY KEY (id),
  CONSTRAINT fleet_managers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT fleet_managers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.car_rental_companies(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.leisure_activities (
  id integer NOT NULL DEFAULT nextval('leisure_activities_id_seq'::regclass),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  price_per_person integer NOT NULL,
  duration_hours numeric NOT NULL,
  min_level text NOT NULL,
  max_participants integer DEFAULT 10,
  equipment_provided boolean DEFAULT true,
  professional_guide boolean DEFAULT true,
  icon_name text NOT NULL DEFAULT 'waves'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT leisure_activities_pkey PRIMARY KEY (id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.loisirs (
  id integer NOT NULL DEFAULT nextval('loisirs_id_seq'::regclass),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  start_date text NOT NULL,
  max_participants integer NOT NULL,
  current_participants integer NOT NULL DEFAULT 0,
  image text NOT NULL,
  end_date text NOT NULL DEFAULT ''::text,
  gallery_images jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT loisirs_pkey PRIMARY KEY (id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.loisirs_inscriptions (
  id integer NOT NULL DEFAULT nextval('loisirs_inscriptions_id_seq'::regclass),
  loisir_id integer NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  inscription_date timestamp with time zone NOT NULL DEFAULT now(),
  confirmation_sent boolean NOT NULL DEFAULT false,
  CONSTRAINT loisirs_inscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT loisirs_inscriptions_loisir_id_fkey FOREIGN KEY (loisir_id) REFERENCES public.loisirs(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.newsletter_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_subscriptions_pkey PRIMARY KEY (id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.offers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  price numeric,
  discount_percentage integer,
  is_active boolean NOT NULL DEFAULT true,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT offers_pkey PRIMARY KEY (id),
  CONSTRAINT offers_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partners(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.partners (
  id uuid NOT NULL,
  business_name text NOT NULL,
  business_type text NOT NULL,
  description text,
  address text,
  phone text,
  website text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT partners_pkey PRIMARY KEY (id),
  CONSTRAINT partners_id_fkey FOREIGN KEY (id) REFERENCES public.profiles(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  first_name text,
  last_name text,
  role text NOT NULL CHECK (role = ANY (ARRAY['admin'::text, 'partner'::text, 'client'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  company_id integer,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.car_rental_companies(id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.purchases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  email text NOT NULL,
  item_type text NOT NULL,
  item_name text NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'EUR'::text,
  purchase_date timestamp with time zone NOT NULL DEFAULT now(),
  status text DEFAULT 'completed'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT purchases_pkey PRIMARY KEY (id),
  CONSTRAINT purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.reservations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  partner_id uuid NOT NULL,
  offer_id uuid,
  reservation_date timestamp with time zone NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'cancelled'::text, 'completed'::text])),
  number_of_people integer DEFAULT 1,
  special_requests text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reservations_pkey PRIMARY KEY (id),
  CONSTRAINT reservations_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id),
  CONSTRAINT reservations_offer_id_fkey FOREIGN KEY (offer_id) REFERENCES public.offers(id),
  CONSTRAINT reservations_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partners(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.restaurant_reservations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  restaurant_id integer NOT NULL,
  reservation_date date NOT NULL,
  reservation_time text NOT NULL,
  guests integer NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'confirmed'::text,
  CONSTRAINT restaurant_reservations_pkey PRIMARY KEY (id),
  CONSTRAINT restaurant_reservations_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.restaurants (
  id integer NOT NULL DEFAULT nextval('restaurants_id_seq'::regclass),
  name text NOT NULL,
  type text NOT NULL,
  image text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  rating numeric NOT NULL,
  offer text NOT NULL,
  icon text NOT NULL,
  CONSTRAINT restaurants_pkey PRIMARY KEY (id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  email text NOT NULL UNIQUE,
  stripe_customer_id text,
  subscribed boolean NOT NULL DEFAULT false,
  subscription_tier text,
  subscription_end timestamp with time zone,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  subscription_start timestamp with time zone,
  subscription_price numeric,
  CONSTRAINT subscribers_pkey PRIMARY KEY (id),
  CONSTRAINT subscribers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_name text NOT NULL,
  status text NOT NULL DEFAULT 'active'::text,
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  end_date timestamp with time zone,
  price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'EUR'::text,
  auto_renew boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE public.user_consumption (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  service_type text NOT NULL,
  service_name text NOT NULL,
  consumption_date timestamp with time zone NOT NULL DEFAULT now(),
  amount_consumed numeric NOT NULL,
  currency text NOT NULL DEFAULT 'EUR'::text,
  status text NOT NULL DEFAULT 'completed'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_consumption_pkey PRIMARY KEY (id),
  CONSTRAINT user_consumption_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE auth.audit_log_entries (
  instance_id uuid,
  id uuid NOT NULL,
  payload json,
  created_at timestamp with time zone,
  ip_address character varying NOT NULL DEFAULT ''::character varying,
  CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE auth.flow_state (
  id uuid NOT NULL,
  user_id uuid,
  auth_code text NOT NULL,
  code_challenge_method USER-DEFINED NOT NULL,
  code_challenge text NOT NULL,
  provider_type text NOT NULL,
  provider_access_token text,
  provider_refresh_token text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  authentication_method text NOT NULL,
  auth_code_issued_at timestamp with time zone,
  CONSTRAINT flow_state_pkey PRIMARY KEY (id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE auth.identities (
  provider_id text NOT NULL,
  user_id uuid NOT NULL,
  identity_data jsonb NOT NULL,
  provider text NOT NULL,
  last_sign_in_at timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  email text DEFAULT lower((identity_data ->> 'email'::text)),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT identities_pkey PRIMARY KEY (id),
  CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE auth.instances (
  id uuid NOT NULL,
  uuid uuid,
  raw_base_config text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  CONSTRAINT instances_pkey PRIMARY KEY (id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE auth.mfa_amr_claims (
  session_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  authentication_method text NOT NULL,
  id uuid NOT NULL,
  CONSTRAINT mfa_amr_claims_pkey PRIMARY KEY (id),
  CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE auth.mfa_challenges (
  id uuid NOT NULL,
  factor_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL,
  verified_at timestamp with time zone,
  ip_address inet NOT NULL,
  otp_code text,
  web_authn_session_data jsonb,
  CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id),
  CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE auth.mfa_factors (
  id uuid NOT NULL,
  user_id uuid NOT NULL,
  friendly_name text,
  factor_type USER-DEFINED NOT NULL,
  status USER-DEFINED NOT NULL,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  secret text,
  phone text,
  last_challenged_at timestamp with time zone UNIQUE,
  web_authn_credential jsonb,
  web_authn_aaguid uuid,
  CONSTRAINT mfa_factors_pkey PRIMARY KEY (id),
  CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE auth.one_time_tokens (
  id uuid NOT NULL,
  user_id uuid NOT NULL,
  token_type USER-DEFINED NOT NULL,
  token_hash text NOT NULL CHECK (char_length(token_hash) > 0),
  relates_to text NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id),
  CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE auth.refresh_tokens (
  instance_id uuid,
  id bigint NOT NULL DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass),
  token character varying UNIQUE,
  user_id character varying,
  revoked boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  parent character varying,
  session_id uuid,
  CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id),
  CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id)
);

-- WARNING: This schema is for context only and is not meant to be run.

CREATE TABLE auth.saml_providers (
  id uuid NOT NULL,
  sso_provider_id uuid NOT NULL,
  entity_id text NOT NULL UNIQUE CHECK (char_length(entity_id) > 0),
  metadata_xml text NOT NULL CHECK (char_length(metadata_xml) > 0),
  metadata_url text CHECK (metadata_url = NULL::text OR char_length(metadata_url) > 0),
  attribute_mapping jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  name_id_format text,
  CONSTRAINT saml_providers_pkey PRIMARY KEY (id),
  CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id)
);
CREATE TABLE auth.saml_relay_states (
  id uuid NOT NULL,
  sso_provider_id uuid NOT NULL,
  request_id text NOT NULL CHECK (char_length(request_id) > 0),
  for_email text,
  redirect_to text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  flow_state_id uuid,
  CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id),
  CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id),
  CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id)
);

-- WARNING: This schema is for context only and is not meant to be run.
CREATE TABLE auth.schema_migrations (
  version character varying NOT NULL,
  CONSTRAINT schema_migrations_pkey PRIMARY KEY (version)
);

-- WARNING: This schema is for context only and is not meant to be run.
CREATE TABLE auth.sessions (
  id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  factor_id uuid,
  aal USER-DEFINED,
  not_after timestamp with time zone,
  refreshed_at timestamp without time zone,
  user_agent text,
  ip inet,
  tag text,
  CONSTRAINT sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.


CREATE TABLE auth.sso_domains (
  id uuid NOT NULL,
  sso_provider_id uuid NOT NULL,
  domain text NOT NULL CHECK (char_length(domain) > 0),
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  CONSTRAINT sso_domains_pkey PRIMARY KEY (id),
  CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id)
);


CREATE TABLE auth.sso_providers (
  id uuid NOT NULL,
  resource_id text CHECK (resource_id = NULL::text OR char_length(resource_id) > 0),
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  CONSTRAINT sso_providers_pkey PRIMARY KEY (id)
);


CREATE TABLE auth.users (
  instance_id uuid,
  id uuid NOT NULL,
  aud character varying,
  role character varying,
  email character varying,
  encrypted_password character varying,
  email_confirmed_at timestamp with time zone,
  invited_at timestamp with time zone,
  confirmation_token character varying,
  confirmation_sent_at timestamp with time zone,
  recovery_token character varying,
  recovery_sent_at timestamp with time zone,
  email_change_token_new character varying,
  email_change character varying,
  email_change_sent_at timestamp with time zone,
  last_sign_in_at timestamp with time zone,
  raw_app_meta_data jsonb,
  raw_user_meta_data jsonb,
  is_super_admin boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  phone text DEFAULT NULL::character varying UNIQUE,
  phone_confirmed_at timestamp with time zone,
  phone_change text DEFAULT ''::character varying,
  phone_change_token character varying DEFAULT ''::character varying,
  phone_change_sent_at timestamp with time zone,
  confirmed_at timestamp with time zone DEFAULT LEAST(email_confirmed_at, phone_confirmed_at),
  email_change_token_current character varying DEFAULT ''::character varying,
  email_change_confirm_status smallint DEFAULT 0 CHECK (email_change_confirm_status >= 0 AND email_change_confirm_status <= 2),
  banned_until timestamp with time zone,
  reauthentication_token character varying DEFAULT ''::character varying,
  reauthentication_sent_at timestamp with time zone,
  is_sso_user boolean NOT NULL DEFAULT false,
  deleted_at timestamp with time zone,
  is_anonymous boolean NOT NULL DEFAULT false,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);