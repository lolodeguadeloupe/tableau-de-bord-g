import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Partner } from '../types/partner';
import { v4 as uuidv4 } from 'uuid';

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

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
        const { data, error } = await supabase.from('partners').select('*');
        if (error) throw error;
        setPartners(data || []);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

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
      };

      const { data, error } = await supabase.from('partners').insert([partnerToInsert]).single();
      if (error) throw error;
      if (data) {
        setPartners([...partners, data]);
      }
    } catch (error) {
      console.error('Error adding partner:', error);
    }
  };

  const updatePartner = async (id: string, updatedPartner: Partial<Partner>, mainImageFile: File | null, galleryImageFiles: File[]) => {
    try {
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

      const { data, error } = await supabase.from('partners').update(partnerToUpdate).eq('id', id).single();
      if (error) throw error;
      if (data) {
        setPartners(partners.map(p => p.id === id ? data : p));
      }
    } catch (error) {
      console.error('Error updating partner:', error);
    }
  };

  const deletePartner = async (id: string) => {
    try {
      const { error } = await supabase.from('partners').delete().eq('id', id);
      if (error) throw error;
      setPartners(partners.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  return { partners, loading, addPartner, updatePartner, deletePartner };
};