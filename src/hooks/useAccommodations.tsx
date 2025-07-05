import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePartnerActivities } from "./usePartnerActivities";
import { useAuth } from "./useAuth";
import type { Json } from "@/integrations/supabase/types";

interface Accommodation {
  id: number;
  name: string;
  type: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  rooms: number;
  bathrooms: number;
  max_guests: number;
  image: string;
  amenities: Json;
  features: Json;
  rules: Json;
  gallery_images: Json;
  discount: number | null;
}

export function useAccommodations(authLoading: boolean) {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { canAccessAllData } = useAuth();
  const { getPartnerIds, loading: activitiesLoading } = usePartnerActivities();

  const fetchAccommodations = useCallback(async () => {
    console.log('🔄 Début de la récupération des hébergements...');
    try {
      // Obtenir les IDs des partenaires accessibles à l'utilisateur
      const accessiblePartnerIds = getPartnerIds();
      console.log('🏨 IDs partenaires accessibles:', accessiblePartnerIds);

      let query = supabase.from('accommodations').select('*').order('name');

      // Si l'utilisateur n'a pas accès à tout, filtrer par les partenaires accessibles
      if (!canAccessAllData) {
        if (accessiblePartnerIds.length > 0) {
          query = query.in('partner_id', accessiblePartnerIds);
        } else {
          // Si aucun partenaire accessible, retourner une liste vide
          console.log('🚫 Aucun partenaire accessible pour cet utilisateur');
          setAccommodations([]);
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
            description: "Veuillez vous connecter pour voir les hébergements.",
            variant: "destructive",
          });
          return;
        }
        
        throw error;
      }
      
      console.log('✅ Nombre d\'hébergements récupérés:', data?.length || 0);
      setAccommodations(data || []);
    } catch (error: unknown) {
      console.error('💥 Erreur lors du chargement des hébergements:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les hébergements.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('🏁 Fin de la récupération des hébergements');
    }
  }, [getPartnerIds, canAccessAllData, toast]);

  useEffect(() => {
    if (!authLoading && !activitiesLoading) {
      fetchAccommodations();
    }
  }, [authLoading, activitiesLoading, fetchAccommodations]);

  return {
    accommodations,
    loading,
    fetchAccommodations
  };
}