// Ce code configure et initialise un client Supabase pour l'application

// Importe la fonction createClient de la bibliothèque Supabase
import { createClient } from '@supabase/supabase-js';

// Récupère l'URL de l'API Supabase depuis les variables d'environnement
// Si non définie, utilise une chaîne vide comme fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
console.log(supabaseUrl);

// Récupère la clé anonyme Supabase depuis les variables d'environnement 
// Si non définie, utilise une chaîne vide comme fallback
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
console.log(supabaseAnonKey);

// Crée et exporte une instance du client Supabase configurée avec l'URL et la clé
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 

// Exporte la fonction createClient de Supabase pour une utilisation future
export { createClient };