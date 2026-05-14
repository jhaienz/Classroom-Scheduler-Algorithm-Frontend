import { api } from '@/lib/api';
import { Course, Classroom } from '@/lib/types';
import { CourseDialog } from './course-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { minutesToTime } from '@/lib/utils';

export default async function CoursesPage() {
  let courses: Course[] = [];
  let classrooms: Classroom[] = [];
  try {
    [courses, classrooms] = await Promise.all([
      api.getCourses(),
      api.getClassrooms()
    ]);
  } catch (e) {
    // Handle error
  }

  // Helper to find classroom name
  const getClassroomName = (id: string) => {
    const cr = classrooms.find(c => c.id === id || c._id === id);
    return cr ? cr.name : id;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground mt-1">Manage scheduled classes and their timings.</p>
        </div>
        <CourseDialog classrooms={classrooms} />
      </div>

      <div className="rounded-md border bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Classroom</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No courses found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.classCode}</TableCell>
                  <TableCell>{course.subjectName}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{getClassroomName(course.classroomId)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.dayOfWeek}</Badge>
                  </TableCell>
                  <TableCell>
                    {minutesToTime(course.startTime)} - {minutesToTime(course.endTime)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <CourseDialog course={course} classrooms={classrooms} />
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
