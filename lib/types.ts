export type ClassroomStatus = "available" | "maintenance" | "unavailable";

export interface Classroom {
  _id?: string;
  id: string;
  name: string;
  building: string;
  capacity: number;
  status: ClassroomStatus;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface Course {
  _id?: string;
  id: string;
  classroomId: string;
  classCode: string;
  subjectName: string;
  instructor: string;
  startTime: number;
  endTime: number;
  dayOfWeek: DayOfWeek;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Schedule {
  _id?: string;
  id: string;
  courseId: string;
  classroomId: string;
  dayOfWeek: DayOfWeek;
  startTime: number;
  endTime: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface AlgorithmStatistics {
  totalExecutions: number;
  averageExecutionTime: number;
  successfulSchedules: number;
  failedAttempts: number;
}

export interface OptimizedResult {
  schedules: Schedule[];
  totalSchedules: number;
  conflicts: any[];
}
