import { supabase } from './client-node.mjs'

async function updateUserRole() {
  const userId = '474e3a74-5d59-4c89-b12e-ffa6198515ea';
  
  // Mise à jour du profil utilisateur
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: 'admin@clubcreole.com',
      role: 'admin',
      first_name: 'Admin',
      last_name: 'System',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (profileError) {
    console.error('Erreur lors de la mise à jour du profil:', profileError);
    process.exit(1);
  }

  console.log('Le rôle admin a été ajouté au profil avec succès');
}

updateUserRole();
