import { Partner } from '../types/partner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQueryClient } from '@tanstack/react-query';

interface PartnerTableProps {
  partners: Partner[];
  onEdit: (partner: Partner) => void;
  onDelete: (id: string) => void;
}

const PartnerTable: React.FC<PartnerTableProps> = ({ partners, onEdit, onDelete }) => {
  const queryClient = useQueryClient();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Business Type</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map(partner => (
            <TableRow key={partner.id}>
              <TableCell>
                {partner.image && <img src={partner.image} alt={partner.business_name} className="h-10 w-10 object-cover rounded-full" />}
              </TableCell>
              <TableCell className="font-medium">{partner.business_name}</TableCell>
              <TableCell>{partner.business_type}</TableCell>
              <TableCell><a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{partner.website}</a></TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => onEdit(partner)} className="mr-2">Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => {
                  onDelete(partner.id.toString());
                  queryClient.invalidateQueries({ queryKey: ['partenaires'] });
                }}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PartnerTable;