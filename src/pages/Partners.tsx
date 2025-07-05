import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from 'react';
import { usePartners } from '../hooks/usePartners';
import PartnerTable from '../components/PartnerTable';
import PartnerModal from '../components/PartnerModal';
import { Partner } from '../types/partner';
import { useAuth } from '../hooks/useAuth';

const Partners = () => {
  const { partners, loading, hasMore, loadMore, addPartner, updatePartner, deletePartner } = usePartners();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { isSuperAdmin, loading: authLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    }, { rootMargin: '100px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  // Seuls les Super Admin peuvent accéder à cette page
  if (!isSuperAdmin && !authLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Accès refusé</h2>
          <p className="text-muted-foreground">Seuls les Super Administrateurs peuvent accéder à la gestion des partenaires.</p>
        </div>
      </div>
    )
  }

  const handleAdd = () => {
    setSelectedPartner(null);
    setIsModalOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      deletePartner(id);
    }
  };

  const handleSave = async (partner: Partner, mainImageFile: File | null, galleryImageFiles: File[]) => {
    if (partner.id) {
      await updatePartner(partner.id, partner, mainImageFile, galleryImageFiles);
    } else {
      await addPartner(partner, mainImageFile, galleryImageFiles);
    }
    setIsModalOpen(false);
  };

  if (loading && partners.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Partners</h1>
        <Button onClick={handleAdd}>Add Partner</Button>
      </div>
      <PartnerTable partners={partners} onEdit={handleEdit} onDelete={handleDelete} />
      <div ref={loadMoreRef} className="h-4" />
      {loading && <p className="text-center py-2">Chargement...</p>}
      {!hasMore && partners.length > 0 && (
        <p className="text-center py-2 text-muted-foreground">Tous les partenaires sont chargés.</p>
      )}
      <PartnerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} partner={selectedPartner} />
    </div>
  );
};

export default Partners;