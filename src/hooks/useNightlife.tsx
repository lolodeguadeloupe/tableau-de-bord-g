import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePartnerActivities } from "./usePartnerActivities";
import { useAuth } from "./useAuth";

interface Nightlife {
  id: number;
  name: string;
  type: string;
  location: string;
  description: string;
  image: string;
  opening_hours: string;
  price_range: string;
  rating: number;
  gallery_images: string[];
}

export function useNightlife(authLoading: boolean) {
  const [nightlife, setNightlife] = useState<Nightlife[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { canAccessAllData } = useAuth();
  const { getPartnerIds, loading: activitiesLoading } = usePartnerActivities();

  const fetchNightlife = async () => {
    console.log('🔄 Début de la récupération des soirées...');
    try {
      // Obtenir les IDs des partenaires accessibles à l'utilisateur
      const accessiblePartnerIds = getPartnerIds();
      console.log('🌙 IDs partenaires accessibles:', accessiblePartnerIds);

      let query = supabase.from('nightlife_events').select('*').order('name');

      // Si l'utilisateur n'a pas accès à tout, filtrer par les partenaires accessibles
      if (!canAccessAllData) {
        if (accessiblePartnerIds.length > 0) {
          query = query.in('partner_id', accessiblePartnerIds);
        } else {
          // Si aucun partenaire accessible, retourner une liste vide
          console.log('🚫 Aucun partenaire accessible pour cet utilisateur');
          setNightlife([]);
          return;
        }
      }

      const { data, error } = await query;

      console.log('📊 Données récupérées:', data);
      console.log('❌ Erreur éventuelle:', error);

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        
        if (error.code === 'PGRST301') {
          toast({
            title: "Authentification requise",
            description: "Veuillez vous connecter pour voir les soirées.",
            variant: "destructive",
          });
          return;
        }
        
        throw error;
      }
      
      console.log('✅ Nombre de soirées récupérées:', data?.length || 0);
      setNightlife(data || []);
    } catch (error: unknown) {
      console.error('💥 Erreur lors du chargement des soirées:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les soirées.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('🏁 Fin de la récupération des soirées');
    }
  };

  useEffect(() => {
    if (!authLoading && !activitiesLoading) {
      fetchNightlife();
    }
  }, [authLoading, activitiesLoading]);

  return {
    nightlife,
    loading,
    fetchNightlife
  };
}