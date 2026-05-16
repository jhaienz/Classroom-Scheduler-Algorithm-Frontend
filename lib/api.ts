import { 
  Classroom, 
  Course, 
  CourseInput,
  Schedule, 
  ScheduleInput,
  ActivitySelectionRequest,
  ActivitySelectionResponse,
  ActivitySelectionStats,
  AlgorithmHealth,
  DashboardStatistics,
  ExecutionStatistics,
  DatabaseStats,
  StatisticsHealth,
  AlgorithmStatistics, 
  OptimizedResult 
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
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

  // if DELETE or no content
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // ===== CLASSROOMS =====
  getClassrooms: () => 
    fetcher<Classroom[]>('/classrooms'),
  
  getClassroom: (id: string) => 
    fetcher<Classroom>(`/classrooms/${id}`),
  
  createClassroom: (data: Partial<Classroom>) => 
    fetcher<Classroom>('/classrooms', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  
  updateClassroom: (id: string, data: Partial<Classroom>) => 
    fetcher<Classroom>(`/classrooms/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  
  deleteClassroom: (id: string) => 
    fetcher<Classroom>(`/classrooms/${id}`, { 
      method: 'DELETE' 
    }),

  // ===== COURSES =====
  getCourses: () => 
    fetcher<Course[]>('/courses'),
  
  getCourse: (id: string) => 
    fetcher<Course>(`/courses/${id}`),
  
  getCoursesByClassroom: (classroomId: string) => 
    fetcher<Course[]>(`/courses/classroom/${classroomId}`),
  
  createCourse: (data: CourseInput | Partial<Course>) => 
    fetcher<Course>('/courses', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  
  updateCourse: (id: string, data: Partial<Course>) => 
    fetcher<Course>(`/courses/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  
  deleteCourse: (id: string) => 
    fetcher<Course>(`/courses/${id}`, { 
      method: 'DELETE' 
    }),

  // ===== SCHEDULES =====
  getSchedules: () => 
    fetcher<Schedule[]>('/schedules'),
  
  getSchedule: (id: string) => 
    fetcher<Schedule>(`/schedules/${id}`),
  
  getSchedulesByCourse: (courseId: string) => 
    fetcher<Schedule[]>(`/schedules/course/${courseId}`),
  
  getSchedulesByDate: (date: string) => 
    fetcher<Schedule[]>(`/schedules/date/${date}`),
  
  createSchedule: (data: ScheduleInput | Partial<Schedule>) => 
    fetcher<Schedule>('/schedules', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  
  updateSchedule: (id: string, data: Partial<Schedule>) => 
    fetcher<Schedule>(`/schedules/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  
  deleteSchedule: (id: string) => 
    fetcher<Schedule>(`/schedules/${id}`, { 
      method: 'DELETE' 
    }),

  // ===== ACTIVITY SELECTION / OPTIMIZATION =====
  selectNonOverlappingClasses: (data: ActivitySelectionRequest) => 
    fetcher<ActivitySelectionResponse>('/activity-selection/select-classes', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  
  getActivitySelectionStats: () => 
    fetcher<ActivitySelectionStats>('/activity-selection/statistics'),
  
  getActivitySelectionHealth: () => 
    fetcher<AlgorithmHealth>('/activity-selection/health'),

  // Legacy alias for compatibility
  optimizeSchedule: (classroomId: string) => 
    fetcher<ActivitySelectionResponse>('/activity-selection/select-classes', { 
      method: 'POST', 
      body: JSON.stringify({ classroomId, courses: [] }) 
    }),

  // ===== STATISTICS =====
  getDashboardStatistics: () => 
    fetcher<DashboardStatistics>('/statistics/dashboard'),
  
  getExecutionStatistics: () => 
    fetcher<ExecutionStatistics>('/statistics/executions'),
  
  getDatabaseCounts: () => 
    fetcher<DatabaseStats>('/statistics/counts'),
  
  getStatisticsHealth: () => 
    fetcher<StatisticsHealth>('/statistics/health'),

  // Legacy methods for backward compatibility
  getStatistics: () => 
    fetcher<DashboardStatistics>('/statistics/dashboard').then(data => ({
      totalExecutions: parseInt(data.algorithm.totalExecutions?.toString() || '0'),
      averageExecutionTime: parseFloat(data.algorithm.avgExecutionTime?.toString() || '0'),
      successfulSchedules: data.scheduling.successfulSchedules,
      failedAttempts: data.scheduling.failedAttempts,
    } as AlgorithmStatistics)),

  // ===== HEALTH CHECKS =====
  getAppHealth: () => 
    fetcher<{ message: string }>('/'),
};
