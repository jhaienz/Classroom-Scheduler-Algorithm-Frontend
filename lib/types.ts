// ===== Enums =====
export type ClassroomStatus = "available" | "maintenance" | "unavailable";
export type ScheduleStatus = "scheduled" | "completed" | "cancelled" | "pending";
export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

// ===== Classroom =====
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

// ===== Course =====
export interface Course {
  _id?: string;
  id: string;
  classCode: string;
  subjectName: string;
  instructor: string;
  classroomId: string | Classroom; // Can be populated or just ID
  startTime: number;
  endTime: number;
  dayOfWeek: DayOfWeek;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CourseInput extends Omit<Course, 'classroomId'> {
  classroomId: string; // For input, always string
}

// ===== Schedule =====
export interface Schedule {
  _id?: string;
  id: string;
  courseId: string | Course; // Can be populated or just ID
  status: ScheduleStatus;
  dayOfWeek: DayOfWeek;
  scheduledDate: string; // ISO 8601 date
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ScheduleInput extends Omit<Schedule, 'courseId'> {
  courseId: string; // For input, always string
}

// ===== Activity Selection / Algorithm =====
export interface ActivityCourse {
  id: string;
  classCode?: string;
  section?: string;
  startTime: number;
  endTime: number;
  instructor?: string;
}

export interface ConflictingClass extends ActivityCourse {
  conflictsWith: string[];
}

export interface ActivitySelectionRequest {
  classroomId: string;
  courses: ActivityCourse[];
}

export interface ActivitySelectionResponse {
  classroomId: string;
  selectedClasses: ActivityCourse[];
  totalSelected: number;
  totalConsidered: number;
  utilizationRate: number;
  conflictingClasses: ConflictingClass[];
}

export interface ActivitySelectionStats {
  message: string;
  example: ActivitySelectionRequest;
}

export interface AlgorithmHealth {
  status: "active" | "inactive";
  algorithm: string;
  complexity: {
    time: string;
    space: string;
  };
}

// ===== Statistics =====
export interface DatabaseStats {
  totalClassrooms: number;
  totalCourses: number;
  totalSchedules: number;
}

export interface AlgorithmExecutionStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  successRate: string;
  avgExecutionTime: string;
  totalExecutionTime: string;
}

export interface SchedulingStats {
  successfulSchedules: number;
  failedAttempts: number;
}

export interface PerformanceStats {
  averageClassesPerSchedule: number;
}

export interface DashboardStatistics {
  timestamp: string;
  database: DatabaseStats;
  algorithm: AlgorithmExecutionStats;
  scheduling: SchedulingStats;
  performance: PerformanceStats;
}

export interface ExecutionStatistics extends AlgorithmExecutionStats, SchedulingStats {}

export interface StatisticsHealth {
  status: "active" | "inactive";
  service: string;
  version: string;
}

// ===== Legacy / Compatibility =====
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
