// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js'

// Anciennes valeurs en dur:
const supabaseUrl = 'https://psryoyugyimibjhwhvlh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcnlveXVneWltaWJqaHdodmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NTM2NDMsImV4cCI6MjA0OTQyOTY0M30.HqVFT7alWrZtjf1cHxeAeqpsWMjVEnnXfVtwesYga-0'

//  const supabaseUrl='https://supabase.clubcreole.fr'
//  const supabaseKey='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0OTcxOTQwMCwiZXhwIjo0OTA1MzkzMDAwLCJyb2xlIjoiYW5vbiJ9.0WYDVcKmJDfC9yGCyW9GA38zfKG-_11TBqESdlB43P0'

// Utilisation des variables d'environnement
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// Valeurs de secours en cas de problème avec les variables d'environnement
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes. Vérifiez votre fichier .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
