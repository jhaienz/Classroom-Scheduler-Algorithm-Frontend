import { Classroom, Course, Schedule, AlgorithmStatistics, OptimizedResult } from './types';

const BASE_URL = 'http://localhost:3000';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    // Adding no-store to avoid Next.js caching issues for this simple CRUD app
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // ignore JSON parse error
    }
    throw new Error(errorMessage);
  }

  // if DELETE without response body
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Classrooms
  getClassrooms: () => fetcher<Classroom[]>('/classrooms'),
  getClassroom: (id: string) => fetcher<Classroom>(`/classrooms/${id}`),
  createClassroom: (data: Partial<Classroom>) => fetcher<Classroom>('/classrooms', { method: 'POST', body: JSON.stringify(data) }),
  updateClassroom: (id: string, data: Partial<Classroom>) => fetcher<Classroom>(`/classrooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClassroom: (id: string) => fetcher<Classroom>(`/classrooms/${id}`, { method: 'DELETE' }),

  // Courses
  getCourses: () => fetcher<Course[]>('/courses'),
  getCourse: (id: string) => fetcher<Course>(`/courses/${id}`),
  createCourse: (data: Partial<Course>) => fetcher<Course>('/courses', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id: string, data: Partial<Course>) => fetcher<Course>(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id: string) => fetcher<Course>(`/courses/${id}`, { method: 'DELETE' }),

  // Schedules
  getSchedules: () => fetcher<Schedule[]>('/schedules'),
  getSchedule: (id: string) => fetcher<Schedule>(`/schedules/${id}`),
  createSchedule: (data: Partial<Schedule>) => fetcher<Schedule>('/schedules', { method: 'POST', body: JSON.stringify(data) }),
  updateSchedule: (id: string, data: Partial<Schedule>) => fetcher<Schedule>(`/schedules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSchedule: (id: string) => fetcher<Schedule>(`/schedules/${id}`, { method: 'DELETE' }),

  // Algorithm
  getStatistics: () => fetcher<AlgorithmStatistics>('/activity-selection/statistics'),
  optimizeSchedule: (classroomId: string, dayOfWeek: string) => 
    fetcher<OptimizedResult>('/activity-selection/select-classes', { 
      method: 'POST', 
      body: JSON.stringify({ classroomId, dayOfWeek }) 
    }),
};
