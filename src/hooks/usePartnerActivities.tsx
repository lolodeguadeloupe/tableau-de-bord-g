import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

type ActivityType = 'restaurant' | 'accommodation' | 'concert' | 'leisure_activity' | 'car_rental' | 'travel' | 'nightlife' | 'voyance' | 'bon_plan' | 'promotion';

export const usePartnerActivities = () => {
  const [userPartnerIds, setUserPartnerIds] = useState<number[]>([]);
  const [activityTypesWithData, setActivityTypesWithData] = useState<Set<ActivityType>>(new Set());
  const [loading, setLoading] = useState(true);
  const { profile, canAccessAllData } = useAuth();

  useEffect(() => {
    const fetchUserPartnersAndData = async () => {
      try {
        setLoading(true);

        let partnerIds: number[] = [];

        if (canAccessAllData) {
          // Super Admin : accès à tous les partenaires
          const { data: allPartners, error } = await supabase
            .from('partners')
            .select('id');

          if (error) {
            console.error('Erreur lors de la récupération des partenaires:', error);
            setUserPartnerIds([]);
            return;
          } else {
            partnerIds = allPartners?.map(p => p.id) || [];
            setUserPartnerIds(partnerIds);
          }
        } else if (profile?.id) {
          // Admin Partenaire : récupérer ses partenaires associés
          const { data: userPartnersData, error: userPartnersError } = await supabase
            .from('partners')
            .select('id')
            .eq('user_id', profile.id);

          if (userPartnersError) {
            console.error('Erreur lors de la récupération des partenaires utilisateur:', userPartnersError);
            setUserPartnerIds([]);
            return;
          } else {
            partnerIds = userPartnersData?.map(p => p.id) || [];
            setUserPartnerIds(partnerIds);
          }
        } else {
          setUserPartnerIds([]);
          return;
        }

        // Vérifier quels types d'activités ont des données pour ces partenaires
        const activityTypesWithDataSet = new Set<ActivityType>();

        if (partnerIds.length > 0 || canAccessAllData) {
          // Vérifier chaque type d'activité
          const checks = [
            { type: 'restaurant' as ActivityType, table: 'restaurants' },
            { type: 'accommodation' as ActivityType, table: 'accommodations' },
            { type: 'concert' as ActivityType, table: 'concerts' },
            { type: 'nightlife' as ActivityType, table: 'nightlife_events' },
            { type: 'leisure_activity' as ActivityType, table: 'loisirs' },
            // Les autres types peuvent être ajoutés ici quand les tables existent
          ];

          for (const check of checks) {
            try {
              let query = supabase.from(check.table).select('id', { count: 'exact', head: true });
              
              if (!canAccessAllData && partnerIds.length > 0) {
                query = query.in('partner_id', partnerIds);
              }

              const { count, error } = await query;

              if (!error && count && count > 0) {
                activityTypesWithDataSet.add(check.type);
              }
            } catch (error) {
              console.log(`Table ${check.table} n'existe pas ou erreur:`, error);
            }
          }
        }

        setActivityTypesWithData(activityTypesWithDataSet);
      } catch (error) {
        console.error('Erreur lors de la récupération des partenaires utilisateur:', error);
        setUserPartnerIds([]);
      } finally {
        setLoading(false);
      }
    };

    if (profile !== null) {
      fetchUserPartnersAndData();
    }
  }, [profile, canAccessAllData]);

  // Obtenir les IDs des partenaires accessibles à l'utilisateur
  const getPartnerIds = (): number[] => {
    return userPartnerIds;
  };

  // Vérifier si l'utilisateur peut accéder à un partenaire spécifique
  const canAccessPartner = (partnerId: number): boolean => {
    if (canAccessAllData) return true;
    
    return userPartnerIds.includes(partnerId);
  };

  // Vérifier si l'utilisateur a accès à au moins une donnée d'un type d'activité
  const hasAccessToActivityType = (activityType: ActivityType): boolean => {
    if (canAccessAllData) return true;
    
    // Vérifier si ce type d'activité a des données accessibles pour l'utilisateur
    return activityTypesWithData.has(activityType);
  };

  return {
    userPartnerIds,
    loading,
    getPartnerIds,
    canAccessPartner,
    hasAccessToActivityType
  };
};