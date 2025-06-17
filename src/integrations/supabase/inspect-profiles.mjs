import { supabase } from './client-node.mjs'

async function inspectProfilesTable() {
  // Récupérer la structure de la table profiles
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }

  console.log('Structure de la table profiles:', data);
}

inspectProfilesTable();
