import { useState, useEffect } from 'react';
import { Partner } from '../types/partner';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Partner, mainImageFile, galleryImageFiles);
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Current Image URL
            </Label>
            <Input id="image" name="image" value={formData.image || ''} onChange={handleChange} className="col-span-3" placeholder="Existing image URL" />
            {formData.image && <img src={formData.image} alt="Current" className="mt-2 h-20 w-20 object-cover col-start-2 col-span-3" />}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageFile" className="text-right">
              Upload New Image
            </Label>
            <Input id="imageFile" name="imageFile" type="file" onChange={handleChange} className="col-span-3" accept="image/*" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gallery_images" className="text-right">
              Current Gallery Images (comma-separated URLs)
            </Label>
            <Textarea id="gallery_images" name="gallery_images" value={formData.gallery_images?.join(',') || ''} onChange={handleChange} className="col-span-3" placeholder="Existing gallery image URLs"></Textarea>
            <div className="col-start-2 col-span-3 flex flex-wrap mt-2">
              {formData.gallery_images?.map((url, index) => (
                <img key={index} src={url} alt={`Gallery ${index}`} className="h-16 w-16 object-cover mr-2 mb-2" />
              ))}
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