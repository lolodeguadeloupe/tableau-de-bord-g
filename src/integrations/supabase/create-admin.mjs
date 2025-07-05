const { createClient } = require('@supabase/supabase-js');

const VITE_SUPABASE_URL="https://services-supabase.clubcreole.fr"
const VITE_SUPABASE_KEY="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0OTk5MzM2MCwiZXhwIjo0OTA1NjY2OTYwLCJyb2xlIjoiYW5vbiJ9.Hm4qwoXVtNU7PSixG_rgYDPUrCkwegvleFnXjJX7I7Y";

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@clubcreole.com',
    password: 'adminPassword123',
    email_confirm: true,
    user_metadata: { role: 'super_admin' }
  });
  if (error) {
    console.error('Erreur création utilisateur:', error);
  } else {
    console.log('Utilisateur créé:', data);
  }
}

createAdmin();
