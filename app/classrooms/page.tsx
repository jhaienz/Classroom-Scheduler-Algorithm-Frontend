import { api } from '@/lib/api';
import { Classroom } from '@/lib/types';
import { ClassroomDialog } from './classroom-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default async function ClassroomsPage() {
  let classrooms: Classroom[] = [];
  try {
    classrooms = await api.getClassrooms();
  } catch (e) {
    // Handle error
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classrooms</h1>
          <p className="text-muted-foreground mt-1">Manage campus classrooms and their capacities.</p>
        </div>
        <ClassroomDialog />
      </div>

      <div className="rounded-md border bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Building</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classrooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No classrooms found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              classrooms.map((classroom) => (
                <TableRow key={classroom.id}>
                  <TableCell className="font-medium">{classroom.id}</TableCell>
                  <TableCell>{classroom.name}</TableCell>
                  <TableCell>{classroom.building}</TableCell>
                  <TableCell>{classroom.capacity}</TableCell>
                  <TableCell>
                    <Badge variant={classroom.status === 'available' ? 'default' : 'secondary'}>
                      {classroom.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ClassroomDialog classroom={classroom} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
