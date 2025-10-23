import { useState, useEffect } from 'react';
import { Partner } from '../types/partner';
import { useUsers } from '../hooks/useUsers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from '@tanstack/react-query';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: Partner, mainImageFile: File | null, galleryImageFiles: File[]) => void;
  partner: Partner | null;
}

const PartnerModal: React.FC<PartnerModalProps> = ({ isOpen, onClose, onSave, partner }) => {
  const [formData, setFormData] = useState<Partial<Partner>>(partner || {});
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const { users, loading: usersLoading } = useUsers();
  const queryClient = useQueryClient();

  useEffect(() => {
    setFormData(partner || {});
    setMainImageFile(null);
    setGalleryImageFiles([]);
  }, [partner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, files } = target;
    if (files) {
      if (name === 'imageFile') {
        setMainImageFile(files[0]);
      } else if (name === 'galleryImageFiles') {
        setGalleryImageFiles(Array.from(files));
      }
    } else if (name === 'gallery_images') {
      setFormData({ ...formData, [name]: value.split(',').map(url => url.trim()).filter(url => url !== '') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUserChange = (value: string) => {
    setFormData({ ...formData, user_id: value });
    setOpen(false);
  };

  const getSelectedUserLabel = () => {
    if (!formData.user_id) return "Sélectionner un utilisateur";
    const selectedUser = users.find(user => user.id === formData.user_id);
    if (!selectedUser) return "Utilisateur introuvable";
    return selectedUser.first_name && selectedUser.last_name 
      ? `${selectedUser.first_name} ${selectedUser.last_name} (${selectedUser.email})`
      : selectedUser.email;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Partner, mainImageFile, galleryImageFiles);
    queryClient.invalidateQueries({ queryKey: ['partenaires'] });
  };

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, image: url });
      setMainImageFile(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const urls = files.map(file => URL.createObjectURL(file));
    const currentGallery = formData.gallery_images || [];
    // Limite à 6 images
    const newGallery = currentGallery.concat(urls).slice(0, 6);
    setFormData({ ...formData, gallery_images: newGallery });
    setGalleryImageFiles(galleryImageFiles.concat(files).slice(0, 6));
  };

  const handleRemoveMainImage = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    // Si la galerie a des images, la première devient la principale
    if (formData.gallery_images && formData.gallery_images.length > 0) {
      const [first, ...rest] = formData.gallery_images;
      setFormData({ ...formData, image: first, gallery_images: rest });
      setMainImageFile(null);
      setGalleryImageFiles(galleryImageFiles.slice(1));
    } else {
      setFormData({ ...formData, image: '' });
      setMainImageFile(null);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    if (!formData.gallery_images) return;
    const newGallery = formData.gallery_images.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery_images: newGallery });
    setGalleryImageFiles(galleryImageFiles.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{partner ? 'Edit Partner' : 'Add Partner'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="business_name" className="text-right">
              Business Name
            </Label>
            <Input id="business_name" name="business_name" value={formData.business_name || ''} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="business_type" className="text-right">
              Business Type
            </Label>
            <Input id="business_type" name="business_type" value={formData.business_type || ''} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user_id" className="text-right">
              Utilisateur
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="col-span-3 justify-between"
                  disabled={usersLoading}
                >
                  {usersLoading ? "Chargement..." : getSelectedUserLabel()}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="col-span-3 p-0">
                <Command>
                  <CommandInput placeholder="Rechercher un utilisateur..." />
                  <CommandEmpty>Aucun utilisateur trouvé.</CommandEmpty>
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={`${user.first_name || ''} ${user.last_name || ''} ${user.email}`.toLowerCase()}
                        onSelect={() => handleUserChange(user.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.user_id === user.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name} (${user.email})`
                          : user.email
                        }
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input id="address" name="address" value={formData.address || ''} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input id="phone" name="phone" value={formData.phone || ''} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website" className="text-right">
              Website
            </Label>
            <Input id="website" name="website" value={formData.website || ''} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="mb-4">
            <Label>Photo principale</Label>
            {formData.image ? (
              <div className="relative inline-block mr-4">
                <img src={formData.image} alt="Photo principale" className="h-24 w-24 object-cover rounded" />
                <button type="button" onClick={handleRemoveMainImage} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">✕</button>
              </div>
            ) : (
              <div className="h-24 w-24 bg-gray-200 flex items-center justify-center rounded">Aucune image</div>
            )}
            <Input type="file" accept="image/*" onChange={handleMainImageUpload} className="mt-2" />
          </div>
          <div className="mb-4">
            <Label>Galerie d'images</Label>
            <div className="flex flex-wrap gap-4">
              {formData.gallery_images && formData.gallery_images.map((url, idx) => (
                <div key={url} className="relative">
                  <img src={url} alt={`Galerie ${idx}`} className="h-24 w-24 object-cover rounded" />
                  {idx === 0 && <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br">Photo principale</span>}
                  <button type="button" onClick={() => handleRemoveGalleryImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">✕</button>
                </div>
              ))}
              {(!formData.gallery_images || formData.gallery_images.length < 6) && (
                <label className="h-24 w-24 flex items-center justify-center border-2 border-dashed rounded cursor-pointer">
                  <span className="text-2xl">+</span>
                  <Input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                </label>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              • La première image sera utilisée comme photo principale<br />
              • Vous pouvez ajouter jusqu'à 6 images
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="galleryImageFiles" className="text-right">
              Upload New Gallery Images
            </Label>
            <Input id="galleryImageFiles" name="galleryImageFiles" type="file" onChange={handleChange} className="col-span-3" accept="image/*" multiple />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerModal;