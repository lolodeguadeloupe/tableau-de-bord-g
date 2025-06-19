
-- Créer d'abord la séquence
CREATE SEQUENCE IF NOT EXISTS concerts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Créer la table concerts
CREATE TABLE public.concerts (
  id integer NOT NULL DEFAULT nextval('concerts_id_seq'::regclass),
  name text NOT NULL,
  artist text NOT NULL,
  genre text NOT NULL,
  image text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  price numeric NOT NULL,
  offer text NOT NULL,
  rating numeric NOT NULL,
  icon text NOT NULL DEFAULT 'Music',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT concerts_pkey PRIMARY KEY (id)
);

-- Associer la séquence à la colonne id
ALTER SEQUENCE concerts_id_seq OWNED BY public.concerts.id;

-- Insérer les données de mock
INSERT INTO public.concerts (id, name, artist, genre, image, location, description, date, time, price, offer, rating, icon) VALUES
(1, 'Festival Zouk & Love', 'Kassav'' & Invités', 'Zouk', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'Stade de Dillon, Fort-de-France', 'Le légendaire groupe Kassav'' revient pour une soirée exceptionnelle dédiée au zouk. Avec des invités surprise et une ambiance garantie, ce concert s''annonce comme l''événement musical de l''année en Martinique.', '15 juillet 2024', '20:00', 45, 'Réduction de 20% sur le tarif normal pour les membres du Club Créole', 4.9, 'Music'),
(2, 'Nuit du Reggae', 'Alpha Blondy & The Solar System', 'Reggae', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'Plage de Grande Anse, Guadeloupe', 'Alpha Blondy, l''une des figures majeures du reggae africain, se produira pour un concert exceptionnel au coucher du soleil sur la magnifique plage de Grande Anse. Vibrations positives garanties!', '23 juillet 2024', '19:30', 38, 'Un cocktail offert sur présentation de la carte Club Créole', 4.7, 'Music'),
(3, 'Soirée Biguine Jazz', 'Martinique Jazz Orchestra', 'Jazz & Biguine', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'Théâtre de Pointe-à-Pitre', 'Une soirée unique mêlant les rythmes traditionnels de la biguine aux harmonies sophistiquées du jazz. Le Martinique Jazz Orchestra vous propose un voyage musical à travers l''histoire des Antilles.', '5 août 2024', '20:30', 32, 'Places en catégorie supérieure au tarif standard pour les membres du Club Créole', 4.8, 'Music'),
(4, 'Carnaval Électronique', 'DJ Snake & artistes locaux', 'Électro / Dance', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'Plage des Salines, Martinique', 'Le célèbre DJ Snake vient mixer sur la plage des Salines pour une nuit électro mémorable. En première partie, découvrez les meilleurs talents locaux de la scène électronique antillaise.', '12 août 2024', '22:00', 55, 'Accès à l''espace VIP avec une consommation offerte pour les membres du Club Créole', 4.6, 'Music'),
(5, 'Concert Gospel - Dena Mwana', 'Dena Mwana avec Samantha Jean & Joella', 'Gospel', '/lovable-uploads/dbe431ca-1435-4f4d-9e21-fe2aa7ccfc86.png', 'Palais des Sports du Gosier', 'Venez vivre une soirée inoubliable au Palais des Sports du Gosier avec la voix céleste de Dena Mwana ! Un concert gospel puissant, rempli d''amour, de foi et d''émotions. Préparez-vous à chanter, danser, prier et vibrer dans une ambiance spirituelle exceptionnelle.', '14 juillet 2025', '17:00', 40, 'Tarif préférentiel à 30€ au lieu de 40€ pour les membres du Club Créole', 4.9, 'Music'),
(6, 'Festival Terre de Blues', 'Artistes Blues & Soul', 'Blues', '/lovable-uploads/b74f7363-a541-46fc-991d-f00043c98c3f.png', 'Plage du 3ème Pont à Grand-Bourg, Marie-Galante', 'La 23ème édition du Festival Terre de Blues vous invite à découvrir les plus grands noms du blues dans un cadre exceptionnel à Marie-Galante. Un festival de 4 jours avec possibilité de camping sur place pour une expérience musicale complète.', '6 au 9 juin 2025', '18:00', 60, 'Tarif préférentiel à 45€ au lieu de 60€ pour les membres du Club Créole - Forfait camping 4 nuits inclus', 4.8, 'Music');

-- Ajuster la séquence pour les prochains ID
SELECT setval('concerts_id_seq', (SELECT MAX(id) FROM public.concerts));
