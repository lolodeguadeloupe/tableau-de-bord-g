import { supabase } from './client'

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@clubcreole.com',
    password: 'adminPassword123',
    email_confirm: true,
    user_metadata: { role: 'admin' }
  });
  if (error) {
    console.error('Erreur lors de la création de l\'utilisateur admin:', error);
    process.exit(1);
  }
  console.log('Utilisateur admin créé:', data);
}

createAdmin();
