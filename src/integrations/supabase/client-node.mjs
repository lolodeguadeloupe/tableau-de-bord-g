import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../../../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
// Pour les opérations admin, nous avons besoin de la clé de service
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Variables d\'environnement Supabase manquantes. Vérifiez votre fichier .env')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
