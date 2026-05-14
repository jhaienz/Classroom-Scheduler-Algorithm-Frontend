'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Classroom } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClassroomAction, updateClassroomAction, deleteClassroomAction } from '@/app/actions';
import { toast } from 'sonner';
import { Edit2, Plus, Trash2 } from 'lucide-react';

interface Props {
  classroom?: Classroom;
}

export function ClassroomDialog({ classroom }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(classroom?.status || 'available');
  const isEditing = !!classroom;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      building: formData.get('building') as string,
      capacity: parseInt(formData.get('capacity') as string),
      status: selectedStatus as any,
    };

    try {
      if (isEditing) {
        await updateClassroomAction(classroom.id, data);
        toast.success('Classroom updated successfully');
      } else {
        await createClassroomAction(data);
        toast.success('Classroom created successfully');
      }
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this classroom?')) return;
    setLoading(true);
    try {
      await deleteClassroomAction(classroom!.id);
      toast.success('Classroom deleted');
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isEditing ? (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(true)}>
          <Edit2 className="h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Classroom
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-xl bg-background/95">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Classroom' : 'Add Classroom'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Make changes to your classroom here.' : 'Add a new classroom to the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="id">ID</Label>
            <Input id="id" name="id" defaultValue={classroom?.id} required readOnly={isEditing} className={isEditing ? "bg-muted" : ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={classroom?.name} required placeholder="e.g. Room 101" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="building">Building</Label>
            <Input id="building" name="building" defaultValue={classroom?.building} required placeholder="e.g. Building A" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input id="capacity" name="capacity" type="number" min="1" defaultValue={classroom?.capacity} required />
          </div>
           <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={(value) => {
                if (value !== null) {
                  setSelectedStatus(value);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
           </div>
          <div className="flex justify-between pt-4">
            {isEditing && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>Save</Button>
            </div>
          </div>
        </form>
      </DialogContent>
      </Dialog>
    </>
  );
}
