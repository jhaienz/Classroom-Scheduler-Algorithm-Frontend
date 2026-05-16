'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Course, Classroom, DayOfWeek } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createCourseAction, updateCourseAction, deleteCourseAction } from '@/app/actions';
import { timeStringToMinutes, minutesToTime } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Edit2, Plus, Trash2 } from 'lucide-react';

interface Props {
  course?: Course;
  classrooms: Classroom[];
}

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function CourseDialog({ course, classrooms: initialClassrooms }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>(initialClassrooms);
  
  // Extract classroom ID (could be string or Classroom object)
  const getClassroomId = (classroomId: string | Classroom | undefined): string => {
    if (!classroomId) return initialClassrooms[0]?.id || '';
    if (typeof classroomId === 'string') return classroomId;
    return classroomId.id;
  };
  
  const [selectedClassroom, setSelectedClassroom] = useState<string>(
    course ? getClassroomId(course.classroomId) : (initialClassrooms[0]?.id || '')
  );
  const [selectedDay, setSelectedDay] = useState<string>(course?.dayOfWeek || 'Monday');
  const isEditing = !!course;

  // Fetch classrooms when dialog opens
  useEffect(() => {
    if (open) {
      const fetchClassrooms = async () => {
        try {
          const data = await api.getClassrooms();
          setClassrooms(data);
          // Set first classroom if none selected
          if (!selectedClassroom && data.length > 0) {
            setSelectedClassroom(data[0].id || data[0]._id || '');
          }
        } catch (error) {
          console.error('Failed to fetch classrooms:', error);
          // Fallback to initial classrooms
          setClassrooms(initialClassrooms);
        }
      };
      fetchClassrooms();
    }
  }, [open, selectedClassroom, initialClassrooms]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const startStr = formData.get('startTime') as string;
    const endStr = formData.get('endTime') as string;

    if (!selectedClassroom || selectedClassroom === '') {
      toast.error('Please select a classroom');
      setLoading(false);
      return;
    }

    if (!selectedDay || selectedDay === '') {
      toast.error('Please select a day of week');
      setLoading(false);
      return;
    }

    const data = {
      id: formData.get('id') as string,
      classCode: formData.get('classCode') as string,
      subjectName: formData.get('subjectName') as string,
      instructor: formData.get('instructor') as string,
      classroomId: selectedClassroom,
      dayOfWeek: selectedDay as DayOfWeek,
      startTime: timeStringToMinutes(startStr),
      endTime: timeStringToMinutes(endStr),
    };

    if (data.startTime >= data.endTime) {
      toast.error('End time must be after start time');
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await updateCourseAction(course.id, data);
        toast.success('Course updated successfully');
      } else {
        await createCourseAction(data);
        toast.success('Course created successfully');
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
    if (!confirm('Are you sure you want to delete this course?')) return;
    setLoading(true);
    try {
      await deleteCourseAction(course!.id);
      toast.success('Course deleted');
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
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-background/95">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Course' : 'Add Course'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Make changes to your course here.' : 'Schedule a new course in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">Course ID</Label>
              <Input id="id" name="id" defaultValue={course?.id} required readOnly={isEditing} className={isEditing ? "bg-muted" : ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classCode">Class Code</Label>
              <Input id="classCode" name="classCode" defaultValue={course?.classCode} required placeholder="e.g. CS101" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subjectName">Subject Name</Label>
            <Input id="subjectName" name="subjectName" defaultValue={course?.subjectName} required placeholder="e.g. Intro to CS" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Input id="instructor" name="instructor" defaultValue={course?.instructor} required placeholder="e.g. Dr. Smith" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="classroomId">Classroom</Label>
            {classrooms.length === 0 ? (
              <div className="text-sm text-muted-foreground p-2 border border-dashed rounded">
                No classrooms available. Please create a classroom first.
              </div>
            ) : (
              <Select value={selectedClassroom} onValueChange={(value) => {
                if (value !== null) {
                  setSelectedClassroom(value);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select classroom" />
                </SelectTrigger>
                <SelectContent>
                  {classrooms.map(c => (
                    <SelectItem key={c.id || c._id} value={c.id || c._id!}>{c.name} ({c.building})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dayOfWeek">Day of Week</Label>
            <Select value={selectedDay} onValueChange={(value) => {
              if (value !== null) {
                setSelectedDay(value);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" name="startTime" type="time" defaultValue={course ? minutesToTime(course.startTime) : "09:00"} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" name="endTime" type="time" defaultValue={course ? minutesToTime(course.endTime) : "10:30"} required />
            </div>
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
