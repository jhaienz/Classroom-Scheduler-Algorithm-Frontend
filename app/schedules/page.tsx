import { api } from '@/lib/api';
import { Schedule, Course, Classroom } from '@/lib/types';
import { ScheduleDialog } from './schedule-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { minutesToTime } from '@/lib/utils';

export default async function SchedulesPage() {
  let schedules: Schedule[] = [];
  let courses: Course[] = [];
  let classrooms: Classroom[] = [];
  try {
    [schedules, courses, classrooms] = await Promise.all([
      api.getSchedules(),
      api.getCourses(),
      api.getClassrooms()
    ]);
  } catch (e) {
    // Handle error
  }

  // Helper finders
  const getCourseName = (id: string) => {
    const c = courses.find(c => c.id === id || c._id === id);
    return c ? `${c.classCode} - ${c.subjectName}` : id;
  };
  
  const getClassroomName = (id: string) => {
    const cr = classrooms.find(c => c.id === id || c._id === id);
    return cr ? `${cr.name} (${cr.building})` : id;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedules</h1>
          <p className="text-muted-foreground mt-1">View and manage finalized class schedules.</p>
        </div>
        <ScheduleDialog courses={courses} classrooms={classrooms} />
      </div>

      <div className="rounded-md border bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Schedule ID</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Classroom</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No schedules found. You can add one manually or use the Optimizer.
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium text-xs text-muted-foreground">{schedule.id}</TableCell>
                  <TableCell>{getCourseName(schedule.courseId)}</TableCell>
                  <TableCell>{getClassroomName(schedule.classroomId)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{schedule.dayOfWeek}</Badge>
                  </TableCell>
                  <TableCell>
                    {minutesToTime(schedule.startTime)} - {minutesToTime(schedule.endTime)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ScheduleDialog schedule={schedule} courses={courses} classrooms={classrooms} />
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
