'use client';

import { useState } from 'react';
import { Classroom, DayOfWeek, Course, ActivitySelectionResponse } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { minutesToTime } from '@/lib/utils';
import { toast } from 'sonner';
import { Zap, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  classrooms: Classroom[];
}

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function OptimizerView({ classrooms }: Props) {
  const [classroomId, setClassroomId] = useState(classrooms[0]?.id || '');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('Monday');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActivitySelectionResponse | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  const handleOptimize = async () => {
    if (!classroomId) {
      toast.error('Please select a classroom');
      return;
    }
    
    setLoading(true);
    try {
      // Fetch courses for this classroom
      const classroomCourses = await api.getCoursesByClassroom(classroomId);
      
      // Filter courses by day of week
      const filteredCourses = classroomCourses.filter(
        (course) => course.dayOfWeek === dayOfWeek
      );

      if (filteredCourses.length === 0) {
        toast.error(`No courses found for ${classroomId} on ${dayOfWeek}`);
        setResult(null);
        return;
      }

      // Prepare courses data for algorithm
      const coursesData = filteredCourses.map((course) => ({
        id: course.id,
        classCode: course.classCode,
        section: course.id.split('-')[1] || '001',
        startTime: course.startTime,
        endTime: course.endTime,
        instructor: course.instructor,
      }));

      // Call the activity selection algorithm
      const optimized = await api.selectNonOverlappingClasses({
        classroomId,
        courses: coursesData,
      });

      setResult(optimized);
      setCourses(classroomCourses);
      toast.success(
        `Optimization complete! ${optimized.totalSelected} out of ${optimized.totalConsidered} courses scheduled.`
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to run optimizer');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-12 flex-1">
      <Card className="md:col-span-4 h-fit border-primary/20 shadow-lg bg-gradient-to-b from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Configuration
          </CardTitle>
          <CardDescription>Select parameters for the greedy activity selection.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Classroom</label>
            <Select value={classroomId} onValueChange={(val) => setClassroomId(val || '')}>
              <SelectTrigger>
                <SelectValue placeholder="Select classroom" />
              </SelectTrigger>
              <SelectContent>
                {classrooms.map(c => (
                  <SelectItem key={c.id} value={c.id || c._id!}>{c.name} ({c.building})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Day of Week</label>
            <Select value={dayOfWeek} onValueChange={(val) => setDayOfWeek(val as DayOfWeek)}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full mt-4" 
            onClick={handleOptimize} 
            disabled={loading || !classroomId}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Optimizing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" /> Run Optimizer
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="md:col-span-8 space-y-6">
        {!result ? (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-card/20">
            <Zap className="h-12 w-12 mb-4 text-muted-foreground/50" />
            <p>Run the optimizer to see the results here.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-green-500/10 border-green-500/20">
                <CardHeader className="py-4">
                  <CardTitle className="text-lg flex items-center justify-between">
                    Selected
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {result.totalSelected}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-500/10 border-orange-500/20">
                <CardHeader className="py-4">
                  <CardTitle className="text-lg flex items-center justify-between">
                    Conflicts
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {result.conflictingClasses?.length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-500/10 border-blue-500/20">
                <CardHeader className="py-4">
                  <CardTitle className="text-lg flex items-center justify-between">
                    Utilization
                    <Zap className="h-5 w-5 text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {result.utilizationRate.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Selected Non-Overlapping Classes</CardTitle>
                <CardDescription>Activities sorted by finish time.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-primary/30 pl-6 space-y-6 py-2 ml-4">
                  {result.selectedClasses.length === 0 ? (
                    <p className="text-muted-foreground italic">No classes could be scheduled.</p>
                  ) : (
                    result.selectedClasses.map((course) => (
                      <div key={course.id} className="relative">
                        <span className="absolute -left-[35px] flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 ring-4 ring-background">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        </span>
                        <div className="flex flex-col gap-1 p-4 rounded-lg bg-card border shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                              <span className="font-semibold text-primary">{course.classCode} - {course.section}</span>
                              <span className="text-sm text-muted-foreground">{course.instructor}</span>
                            </div>
                            <Badge variant="outline" className="font-mono bg-background">
                              {minutesToTime(course.startTime)} - {minutesToTime(course.endTime)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {result.conflictingClasses && result.conflictingClasses.length > 0 && (
              <Card className="border-orange-500/20 bg-orange-500/5">
                <CardHeader>
                  <CardTitle className="text-orange-600 dark:text-orange-400">Conflicting Classes</CardTitle>
                  <CardDescription>These classes were skipped because they overlap with the selected schedule.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.conflictingClasses.map((c, i) => (
                      <div key={i} className="p-3 rounded-lg bg-background/50 border border-orange-500/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium text-foreground">{c.classCode} - {c.section}</span>
                            <p className="text-sm text-muted-foreground mt-1">{c.instructor}</p>
                            {c.conflictsWith && c.conflictsWith.length > 0 && (
                              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                Conflicts with: {c.conflictsWith.join(', ')}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="font-mono bg-background">
                            {minutesToTime(c.startTime)} - {minutesToTime(c.endTime)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
