import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePartnerActivities } from "./usePartnerActivities";
import { useAuth } from "./useAuth";

interface Concert {
  id: number;
  name: string;
  artist: string;
  date: string;
  location: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tickets_available: number;
  gallery_images: string[];
}

export function useConcerts(authLoading: boolean) {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { canAccessAllData } = useAuth();
  const { getPartnerIds, loading: activitiesLoading } = usePartnerActivities();

  const fetchConcerts = async () => {
    console.log('🔄 Début de la récupération des concerts...');
    try {
      // Obtenir les IDs des partenaires accessibles à l'utilisateur
      const accessiblePartnerIds = getPartnerIds();
      console.log('🎵 IDs partenaires accessibles:', accessiblePartnerIds);

      let query = supabase.from('concerts').select('*').order('date');

      // Si l'utilisateur n'a pas accès à tout, filtrer par les partenaires accessibles
      if (!canAccessAllData) {
        if (accessiblePartnerIds.length > 0) {
          query = query.in('partner_id', accessiblePartnerIds);
        } else {
          // Si aucun partenaire accessible, retourner une liste vide
          console.log('🚫 Aucun partenaire accessible pour cet utilisateur');
          setConcerts([]);
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
            description: "Veuillez vous connecter pour voir les concerts.",
            variant: "destructive",
          });
          return;
        }
        
        throw error;
      }
      
      console.log('✅ Nombre de concerts récupérés:', data?.length || 0);
      setConcerts(data || []);
    } catch (error: unknown) {
      console.error('💥 Erreur lors du chargement des concerts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les concerts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('🏁 Fin de la récupération des concerts');
    }
  };

  useEffect(() => {
    if (!authLoading && !activitiesLoading) {
      fetchConcerts();
    }
  }, [authLoading, activitiesLoading]);

  return {
    concerts,
    loading,
    fetchConcerts
  };
}