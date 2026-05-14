'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api';
import { Classroom, Course, Schedule } from '@/lib/types';

// Classrooms
export async function createClassroomAction(data: Partial<Classroom>) {
  const result = await api.createClassroom(data);
  revalidatePath('/');
  revalidatePath('/classrooms');
  revalidatePath('/courses');
  revalidatePath('/schedules');
  return result;
}

export async function updateClassroomAction(id: string, data: Partial<Classroom>) {
  const result = await api.updateClassroom(id, data);
  revalidatePath('/');
  revalidatePath('/classrooms');
  revalidatePath('/courses');
  revalidatePath('/schedules');
  return result;
}

export async function deleteClassroomAction(id: string) {
  const result = await api.deleteClassroom(id);
  revalidatePath('/');
  revalidatePath('/classrooms');
  revalidatePath('/courses');
  revalidatePath('/schedules');
  return result;
}

// Courses
export async function createCourseAction(data: Partial<Course>) {
  const result = await api.createCourse(data);
  revalidatePath('/');
  revalidatePath('/courses');
  revalidatePath('/schedules');
  return result;
}

export async function updateCourseAction(id: string, data: Partial<Course>) {
  const result = await api.updateCourse(id, data);
  revalidatePath('/');
  revalidatePath('/courses');
  revalidatePath('/schedules');
  return result;
}

export async function deleteCourseAction(id: string) {
  const result = await api.deleteCourse(id);
  revalidatePath('/');
  revalidatePath('/courses');
  revalidatePath('/schedules');
  return result;
}

// Schedules
export async function createScheduleAction(data: Partial<Schedule>) {
  const result = await api.createSchedule(data);
  revalidatePath('/');
  revalidatePath('/schedules');
  return result;
}

export async function updateScheduleAction(id: string, data: Partial<Schedule>) {
  const result = await api.updateSchedule(id, data);
  revalidatePath('/');
  revalidatePath('/schedules');
  return result;
}

export async function deleteScheduleAction(id: string) {
  const result = await api.deleteSchedule(id);
  revalidatePath('/');
  revalidatePath('/schedules');
  return result;
}
