'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Schedule, Course, Classroom, DayOfWeek, ScheduleStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createScheduleAction, updateScheduleAction, deleteScheduleAction } from '@/app/actions';
import { timeStringToMinutes, minutesToTime } from '@/lib/utils';
import { toast } from 'sonner';
import { Edit2, Plus, Trash2 } from 'lucide-react';

interface Props {
  schedule?: Schedule;
  courses: Course[];
  classrooms: Classroom[];
}

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function ScheduleDialog({ schedule, courses, classrooms }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Extract course ID (could be string or Course object)
  const getCourseId = (courseId: string | Course | undefined): string => {
    if (!courseId) return courses[0]?.id || '';
    if (typeof courseId === 'string') return courseId;
    return courseId.id;
  };
  
  const [selectedCourse, setSelectedCourse] = useState<string>(
    schedule ? getCourseId(schedule.courseId) : (courses[0]?.id || '')
  );
  const [selectedDay, setSelectedDay] = useState<string>(schedule?.dayOfWeek || 'Monday');
  const [scheduledDate, setScheduledDate] = useState<string>(
    schedule ? new Date(schedule.scheduledDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const isEditing = !!schedule;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      id: formData.get('id') as string,
      courseId: selectedCourse,
      status: (formData.get('status') as string || 'pending') as ScheduleStatus,
      dayOfWeek: selectedDay as DayOfWeek,
      scheduledDate: new Date(scheduledDate).toISOString(),
    };

    if (!selectedCourse) {
      toast.error('Please select a course');
      setLoading(false);
      return;
    }

    if (!selectedDay) {
      toast.error('Please select a day of week');
      setLoading(false);
      return;
    }

    if (!scheduledDate) {
      toast.error('Please select a scheduled date');
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await updateScheduleAction(schedule.id, data);
        toast.success('Schedule updated successfully');
      } else {
        await createScheduleAction(data);
        toast.success('Schedule created successfully');
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
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    setLoading(true);
    try {
      await deleteScheduleAction(schedule!.id);
      toast.success('Schedule deleted');
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
          <Plus className="mr-2 h-4 w-4" /> Add Schedule
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-background/95">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Make changes to the finalized schedule.' : 'Manually add a schedule to the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="id">Schedule ID</Label>
            <Input id="id" name="id" defaultValue={schedule?.id} required readOnly={isEditing} className={isEditing ? "bg-muted" : ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseId">Course</Label>
            <Select value={selectedCourse} onValueChange={(value) => {
              if (value !== null) {
                setSelectedCourse(value);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(c => (
                  <SelectItem key={c.id} value={c.id || c._id!}>{c.classCode} - {c.subjectName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div className="space-y-2">
            <Label htmlFor="scheduledDate">Scheduled Date</Label>
            <Input 
              id="scheduledDate" 
              name="scheduledDate" 
              type="date" 
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue={schedule?.status || 'pending'} name="status">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
