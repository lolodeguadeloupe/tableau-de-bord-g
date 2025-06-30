import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Partner } from '../types/partner';
import { useAuth } from './useAuth';
import { usePartnerActivities } from './usePartnerActivities';
import { v4 as uuidv4 } from 'uuid';

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const { canAccessAllData, profile } = useAuth();
  const { getPartnerIds, canAccessPartner, loading: activitiesLoading } = usePartnerActivities();

  // Helper function to upload an image to Supabase storage
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `partner-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('partner-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from('partner-images').getPublicUrl(filePath);
    return data?.publicUrl || null;
  };

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        let query = supabase.from('partners').select('*');
        
        if (canAccessAllData) {
          // Super Admin : tous les partenaires
          console.log('🔓 Super Admin: accès à tous les partenaires');
        } else {
          // Admin Partenaire : seulement les partenaires accessibles
          const accessiblePartnerIds = getPartnerIds();
          console.log('🏢 IDs partenaires accessibles:', accessiblePartnerIds);
          
          if (accessiblePartnerIds.length > 0) {
            query = query.in('id', accessiblePartnerIds);
          } else {
            // Si aucun partenaire accessible, retourner une liste vide
            console.log('🚫 Aucun partenaire accessible pour cet utilisateur');
            setPartners([]);
            return;
          }
        }
        
        const { data, error } = await query;
        if (error) throw error;
        setPartners(data || []);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    // Attendre que le profil et les activités soient chargés
    if (profile !== null && !activitiesLoading) {
      fetchPartners();
    }
  }, [canAccessAllData, profile, activitiesLoading, getPartnerIds]);

  const addPartner = async (partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>, mainImageFile: File | null, galleryImageFiles: File[]) => {
    try {
      let imageUrl: string | null = partner.image || null;
      if (mainImageFile) {
        imageUrl = await uploadImage(mainImageFile);
      }

      const galleryUrls: string[] = [];
      for (const file of galleryImageFiles) {
        const url = await uploadImage(file);
        if (url) galleryUrls.push(url);
      }

      const partnerToInsert = {
        ...partner,
        image: imageUrl,
        gallery_images: galleryUrls.length > 0 ? galleryUrls : partner.gallery_images || [],
        // Si l'utilisateur n'est pas Super Admin, forcer l'association avec son user_id
        user_id: canAccessAllData ? partner.user_id : profile?.id,
      };

      const { data, error } = await supabase.from('partners').insert([partnerToInsert]).single<Partner>();
      if (error) throw error;
      if (data) {
        setPartners([...partners, data as Partner]);
      }
    } catch (error) {
      console.error('Error adding partner:', error);
    }
  };

  const updatePartner = async (id: number, updatedPartner: Partial<Partner>, mainImageFile: File | null, galleryImageFiles: File[]) => {
    try {
      // Vérifier les droits avant la modification
      if (!canAccessPartner(id)) {
        console.error('Accès refusé: Vous ne pouvez modifier que vos partenaires autorisés');
        return;
      }

      let imageUrl: string | undefined = updatedPartner.image;
      if (mainImageFile) {
        imageUrl = await uploadImage(mainImageFile) || undefined;
      }

      const galleryUrls: string[] = updatedPartner.gallery_images ? [...updatedPartner.gallery_images] : [];
      for (const file of galleryImageFiles) {
        const url = await uploadImage(file);
        if (url) galleryUrls.push(url);
      }

      const partnerToUpdate = {
        ...updatedPartner,
        image: imageUrl,
        gallery_images: galleryUrls,
      };

      const query = supabase
        .from('partners')
        .update(partnerToUpdate)
        .eq('id', id);

      const { data, error } = await query.single<Partner>();
      if (error) throw error;
      if (data) {
        setPartners(partners.map(p => p.id === id ? data as Partner : p));
      }
    } catch (error) {
      console.error('Error updating partner:', error);
    }
  };

  const deletePartner = async (id: number) => {
    try {
      // Vérifier les droits avant la suppression
      if (!canAccessPartner(id)) {
        console.error('Accès refusé: Vous ne pouvez supprimer que vos partenaires autorisés');
        return;
      }

      let query = supabase.from('partners').delete().eq('id', id);

      const { error } = await query;
      if (error) throw error;
      setPartners(partners.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  return { partners, loading, addPartner, updatePartner, deletePartner };
};