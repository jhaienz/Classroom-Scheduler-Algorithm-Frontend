# Greedy Backend API Documentation

## Overview
The Greedy Backend is a NestJS application that implements a greedy algorithm for scheduling non-overlapping classes in classrooms. It provides RESTful endpoints for managing classrooms, courses, schedules, and viewing scheduling statistics.

**Base URL:** `http://localhost:3000`

---

## Table of Contents
1. [Classrooms](#classrooms)
2. [Courses](#courses)
3. [Schedules](#schedules)
4. [Activity Selection (Algorithm)](#activity-selection)
5. [Statistics](#statistics)
6. [Health Checks](#health-checks)

---

## Classrooms

### Create Classroom
Creates a new classroom.

**Endpoint:** `POST /classrooms`

**Request Body:**
```json
{
  "id": "CS01",
  "name": "Computer Science Lab",
  "building": "Building A",
  "capacity": 30,
  "status": "available"
}
```

**Parameters:**
- `id` (string, required) - Unique identifier for the classroom (e.g., "CS01", "MATH101")
- `name` (string, required) - Name/description of the classroom
- `building` (string, required) - Building location
- `capacity` (number, required) - Maximum student capacity
- `status` (string, optional) - Status of the classroom. Enum: `available`, `maintenance`, `unavailable`. Default: `available`

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "CS01",
  "name": "Computer Science Lab",
  "building": "Building A",
  "capacity": 30,
  "status": "available",
  "createdAt": "2026-05-15T12:00:00.000Z",
  "updatedAt": "2026-05-15T12:00:00.000Z",
  "__v": 0
}
```

---

### Get All Classrooms
Retrieves all classrooms.

**Endpoint:** `GET /classrooms`

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "id": "CS01",
    "name": "Computer Science Lab",
    "building": "Building A",
    "capacity": 30,
    "status": "available",
    "createdAt": "2026-05-15T12:00:00.000Z",
    "updatedAt": "2026-05-15T12:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "id": "MATH101",
    "name": "Mathematics Room",
    "building": "Building B",
    "capacity": 40,
    "status": "available",
    "createdAt": "2026-05-15T12:05:00.000Z",
    "updatedAt": "2026-05-15T12:05:00.000Z"
  }
]
```

---

### Get Classroom by ID
Retrieves a specific classroom by its custom ID.

**Endpoint:** `GET /classrooms/:id`

**Parameters:**
- `id` (string, path) - Custom classroom ID (e.g., "CS01")

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "CS01",
  "name": "Computer Science Lab",
  "building": "Building A",
  "capacity": 30,
  "status": "available",
  "createdAt": "2026-05-15T12:00:00.000Z",
  "updatedAt": "2026-05-15T12:00:00.000Z"
}
```

**Response (404 Not Found):** If classroom doesn't exist

---

### Update Classroom
Updates a classroom by ID.

**Endpoint:** `PUT /classrooms/:id`

**Parameters:**
- `id` (string, path) - Custom classroom ID

**Request Body (all fields optional):**
```json
{
  "name": "Updated Lab Name",
  "building": "Building C",
  "capacity": 35,
  "status": "maintenance"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "CS01",
  "name": "Updated Lab Name",
  "building": "Building C",
  "capacity": 35,
  "status": "maintenance",
  "createdAt": "2026-05-15T12:00:00.000Z",
  "updatedAt": "2026-05-15T12:30:00.000Z"
}
```

---

### Delete Classroom
Deletes a classroom by ID.

**Endpoint:** `DELETE /classrooms/:id`

**Parameters:**
- `id` (string, path) - Custom classroom ID

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "CS01",
  "name": "Computer Science Lab",
  "building": "Building A",
  "capacity": 30,
  "status": "available"
}
```

---

## Courses

### Create Course
Creates a new course.

**Endpoint:** `POST /courses`

**Request Body:**
```json
{
  "id": "CS101-001",
  "classCode": "CS101",
  "subjectName": "Introduction to Computer Science",
  "instructor": "Dr. Smith",
  "classroomId": "CS01",
  "startTime": 540,
  "endTime": 630,
  "dayOfWeek": "Monday"
}
```

**Parameters:**
- `id` (string, required) - Unique identifier for the course section (e.g., "CS101-001")
- `classCode` (string, required) - Course code (e.g., "CS101")
- `subjectName` (string, required) - Full course name
- `instructor` (string, required) - Instructor name
- `classroomId` (string, required) - Reference to classroom ID
- `startTime` (number, required) - Start time in minutes from midnight (0-1439). Example: 540 = 9:00 AM
- `endTime` (number, required) - End time in minutes from midnight (0-1439). Example: 630 = 10:30 AM
- `dayOfWeek` (string, required) - Day of week. Enum: `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "id": "CS101-001",
  "classCode": "CS101",
  "subjectName": "Introduction to Computer Science",
  "instructor": "Dr. Smith",
  "classroomId": "CS01",
  "startTime": 540,
  "endTime": 630,
  "dayOfWeek": "Monday",
  "createdAt": "2026-05-15T12:00:00.000Z",
  "updatedAt": "2026-05-15T12:00:00.000Z"
}
```

---

### Get All Courses
Retrieves all courses with classroom details populated.

**Endpoint:** `GET /courses`

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439021",
    "id": "CS101-001",
    "classCode": "CS101",
    "subjectName": "Introduction to Computer Science",
    "instructor": "Dr. Smith",
    "classroomId": {
      "_id": "507f1f77bcf86cd799439011",
      "id": "CS01",
      "name": "Computer Science Lab",
      "building": "Building A",
      "capacity": 30,
      "status": "available"
    },
    "startTime": 540,
    "endTime": 630,
    "dayOfWeek": "Monday",
    "createdAt": "2026-05-15T12:00:00.000Z",
    "updatedAt": "2026-05-15T12:00:00.000Z"
  }
]
```

---

### Get Course by ID
Retrieves a specific course by its custom ID.

**Endpoint:** `GET /courses/:id`

**Parameters:**
- `id` (string, path) - Custom course ID (e.g., "CS101-001")

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "id": "CS101-001",
  "classCode": "CS101",
  "subjectName": "Introduction to Computer Science",
  "instructor": "Dr. Smith",
  "classroomId": {
    "_id": "507f1f77bcf86cd799439011",
    "id": "CS01",
    "name": "Computer Science Lab",
    "building": "Building A",
    "capacity": 30,
    "status": "available"
  },
  "startTime": 540,
  "endTime": 630,
  "dayOfWeek": "Monday",
  "createdAt": "2026-05-15T12:00:00.000Z"
}
```

---

### Get Courses by Classroom
Retrieves all courses assigned to a specific classroom.

**Endpoint:** `GET /courses/classroom/:classroomId`

**Parameters:**
- `classroomId` (string, path) - Classroom ID (e.g., "CS01")

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439021",
    "id": "CS101-001",
    "classCode": "CS101",
    "subjectName": "Introduction to Computer Science",
    "instructor": "Dr. Smith",
    "classroomId": "CS01",
    "startTime": 540,
    "endTime": 630,
    "dayOfWeek": "Monday"
  }
]
```

---

### Update Course
Updates a course by ID.

**Endpoint:** `PUT /courses/:id`

**Parameters:**
- `id` (string, path) - Custom course ID

**Request Body (all fields optional):**
```json
{
  "instructor": "Dr. Johnson",
  "startTime": 550,
  "endTime": 640
}
```

**Response (200 OK):** Updated course object

---

### Delete Course
Deletes a course by ID.

**Endpoint:** `DELETE /courses/:id`

**Parameters:**
- `id` (string, path) - Custom course ID

**Response (200 OK):** Deleted course object

---

## Schedules

### Create Schedule
Creates a new schedule.

**Endpoint:** `POST /schedules`

**Request Body:**
```json
{
  "id": "SCHED001",
  "courseId": "CS101-001",
  "status": "scheduled",
  "dayOfWeek": "Monday",
  "scheduledDate": "2026-05-20T00:00:00.000Z"
}
```

**Parameters:**
- `id` (string, required) - Unique identifier for the schedule
- `courseId` (string, required) - Reference to course ID
- `status` (string, optional) - Schedule status. Enum: `scheduled`, `completed`, `cancelled`, `pending`. Default: `pending`
- `dayOfWeek` (string, required) - Day of week. Enum: `Monday` through `Sunday`
- `scheduledDate` (ISO 8601 date, required) - Date when the course is scheduled

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439031",
  "id": "SCHED001",
  "courseId": "CS101-001",
  "status": "scheduled",
  "dayOfWeek": "Monday",
  "scheduledDate": "2026-05-20T00:00:00.000Z",
  "createdAt": "2026-05-15T12:00:00.000Z",
  "updatedAt": "2026-05-15T12:00:00.000Z"
}
```

---

### Get All Schedules
Retrieves all schedules with course details populated.

**Endpoint:** `GET /schedules`

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439031",
    "id": "SCHED001",
    "courseId": {
      "_id": "507f1f77bcf86cd799439021",
      "id": "CS101-001",
      "classCode": "CS101",
      "subjectName": "Introduction to Computer Science",
      "instructor": "Dr. Smith"
    },
    "status": "scheduled",
    "dayOfWeek": "Monday",
    "scheduledDate": "2026-05-20T00:00:00.000Z",
    "createdAt": "2026-05-15T12:00:00.000Z"
  }
]
```

---

### Get Schedule by ID
Retrieves a specific schedule by its custom ID.

**Endpoint:** `GET /schedules/:id`

**Parameters:**
- `id` (string, path) - Custom schedule ID (e.g., "SCHED001")

**Response (200 OK):** Schedule object with populated course details

---

### Get Schedules by Course
Retrieves all schedules for a specific course.

**Endpoint:** `GET /schedules/course/:courseId`

**Parameters:**
- `courseId` (string, path) - Course ID (e.g., "CS101-001")

**Response (200 OK):** Array of schedule objects

---

### Get Schedules by Date
Retrieves all schedules for a specific date.

**Endpoint:** `GET /schedules/date/:date`

**Parameters:**
- `date` (ISO 8601 date string, path) - Schedule date (e.g., "2026-05-20")

**Response (200 OK):** Array of schedule objects for the specified date

---

### Update Schedule
Updates a schedule by ID.

**Endpoint:** `PUT /schedules/:id`

**Parameters:**
- `id` (string, path) - Custom schedule ID

**Request Body (all fields optional):**
```json
{
  "status": "completed",
  "dayOfWeek": "Tuesday"
}
```

**Response (200 OK):** Updated schedule object

---

### Delete Schedule
Deletes a schedule by ID.

**Endpoint:** `DELETE /schedules/:id`

**Parameters:**
- `id` (string, path) - Custom schedule ID

**Response (200 OK):** Deleted schedule object

---

## Activity Selection

The Activity Selection module implements a **Greedy Algorithm** to solve the maximum non-overlapping classes problem for a given classroom.

**Algorithm Complexity:**
- **Time:** O(n log n) - due to sorting
- **Space:** O(n) - for storing results

---

### Select Non-Overlapping Classes
Solves the activity selection problem to find the maximum number of non-overlapping classes that can be scheduled in a classroom.

**Endpoint:** `POST /activity-selection/select-classes`

**Request Body:**
```json
{
  "classroomId": "CS01",
  "courses": [
    {
      "id": "CS101-001",
      "classCode": "CS101",
      "section": "001",
      "startTime": 540,
      "endTime": 630,
      "instructor": "Dr. Smith"
    },
    {
      "id": "CS101-002",
      "classCode": "CS101",
      "section": "002",
      "startTime": 600,
      "endTime": 690,
      "instructor": "Dr. Jones"
    },
    {
      "id": "CS101-003",
      "classCode": "CS101",
      "section": "003",
      "startTime": 630,
      "endTime": 720,
      "instructor": "Dr. Brown"
    }
  ]
}
```

**Parameters:**
- `classroomId` (string, required) - Target classroom ID
- `courses` (array, required) - Array of course objects to schedule
  - `id` (string, required) - Course identifier
  - `classCode` (string, optional) - Course code
  - `section` (string, optional) - Course section
  - `startTime` (number, required) - Start time in minutes from midnight (0-1439)
  - `endTime` (number, required) - End time in minutes from midnight (0-1439)
  - `instructor` (string, optional) - Instructor name

**Response (200 OK):**
```json
{
  "classroomId": "CS01",
  "selectedClasses": [
    {
      "id": "CS101-001",
      "classCode": "CS101",
      "section": "001",
      "startTime": 540,
      "endTime": 630,
      "instructor": "Dr. Smith"
    },
    {
      "id": "CS101-003",
      "classCode": "CS101",
      "section": "003",
      "startTime": 630,
      "endTime": 720,
      "instructor": "Dr. Brown"
    }
  ],
  "totalSelected": 2,
  "totalConsidered": 3,
  "utilizationRate": 66.67,
  "conflictingClasses": [
    {
      "id": "CS101-002",
      "classCode": "CS101",
      "section": "002",
      "startTime": 600,
      "endTime": 690,
      "instructor": "Dr. Jones",
      "conflictsWith": ["CS101-001"]
    }
  ]
}
```

**Response Fields:**
- `classroomId` - Target classroom ID
- `selectedClasses` - Array of non-overlapping classes that can be scheduled
- `totalSelected` - Number of classes selected
- `totalConsidered` - Total number of input classes
- `utilizationRate` - Percentage of classes that could be scheduled (0-100)
- `conflictingClasses` - Array of classes that couldn't be scheduled due to time conflicts
  - `conflictsWith` - Array of class IDs this class conflicts with

---

### Get Algorithm Statistics Example
Returns documentation and example request format.

**Endpoint:** `GET /activity-selection/statistics`

**Response (200 OK):**
```json
{
  "message": "Call POST /activity-selection/select-classes with courses data to get detailed statistics",
  "example": {
    "classroomId": "A101",
    "courses": [
      {
        "id": "CS101-001",
        "classCode": "CS101",
        "section": "001",
        "startTime": 540,
        "endTime": 630,
        "instructor": "Dr. Smith"
      },
      {
        "id": "CS101-002",
        "classCode": "CS101",
        "section": "002",
        "startTime": 600,
        "endTime": 690,
        "instructor": "Dr. Jones"
      },
      {
        "id": "CS101-003",
        "classCode": "CS101",
        "section": "003",
        "startTime": 630,
        "endTime": 720,
        "instructor": "Dr. Brown"
      }
    ]
  }
}
```

---

### Algorithm Health Check
Returns health status of the activity selection service.

**Endpoint:** `GET /activity-selection/health`

**Response (200 OK):**
```json
{
  "status": "active",
  "algorithm": "Activity Selection (Greedy Algorithm)",
  "complexity": {
    "time": "O(n log n)",
    "space": "O(n)"
  }
}
```

---

## Statistics

The Statistics module tracks algorithm execution metrics and provides comprehensive dashboard data.

---

### Get Dashboard Statistics
Returns comprehensive statistics for the dashboard including database counts, algorithm metrics, and scheduling performance.

**Endpoint:** `GET /statistics/dashboard`

**Response (200 OK):**
```json
{
  "timestamp": "2026-05-15T12:30:00.000Z",
  "database": {
    "totalClassrooms": 10,
    "totalCourses": 45,
    "totalSchedules": 200
  },
  "algorithm": {
    "totalExecutions": 150,
    "successfulExecutions": 142,
    "failedExecutions": 8,
    "successRate": "94.67%",
    "avgExecutionTime": "45.23ms",
    "totalExecutionTime": "6784ms"
  },
  "scheduling": {
    "successfulSchedules": 285,
    "failedAttempts": 15
  },
  "performance": {
    "averageClassesPerSchedule": 2.01
  }
}
```

**Response Fields:**
- `timestamp` - When the statistics were generated
- `database.totalClassrooms` - Total number of classrooms in the system
- `database.totalCourses` - Total number of courses in the system
- `database.totalSchedules` - Total number of schedules in the system
- `algorithm.totalExecutions` - Total times the algorithm has been executed
- `algorithm.successfulExecutions` - Number of successful algorithm runs
- `algorithm.failedExecutions` - Number of failed algorithm runs
- `algorithm.successRate` - Percentage of successful executions
- `algorithm.avgExecutionTime` - Average execution time per run in milliseconds
- `algorithm.totalExecutionTime` - Total cumulative execution time in milliseconds
- `scheduling.successfulSchedules` - Total successfully scheduled classes across all executions
- `scheduling.failedAttempts` - Total failed scheduling attempts
- `performance.averageClassesPerSchedule` - Average number of classes per successful schedule

---

### Get Execution Statistics
Returns only algorithm execution statistics without database counts.

**Endpoint:** `GET /statistics/executions`

**Response (200 OK):**
```json
{
  "totalExecutions": 150,
  "successfulExecutions": 142,
  "failedExecutions": 8,
  "successRate": "94.67%",
  "avgExecutionTime": "45.23ms",
  "totalExecutionTime": "6784ms",
  "successfulSchedules": 285,
  "failedAttempts": 15
}
```

---

### Get Database Counts
Returns only the database entity counts.

**Endpoint:** `GET /statistics/counts`

**Response (200 OK):**
```json
{
  "totalClassrooms": 10,
  "totalCourses": 45,
  "totalSchedules": 200
}
```

---

### Statistics Health Check
Returns health status of the statistics service.

**Endpoint:** `GET /statistics/health`

**Response (200 OK):**
```json
{
  "status": "active",
  "service": "Statistics Dashboard",
  "version": "1.0.0"
}
```

---

## Health Checks

### Application Health Check
Returns health status of the main application.

**Endpoint:** `GET /`

**Response (200 OK):**
```json
{
  "message": "Welcome to Greedy Backend API"
}
```

---

## Error Handling

The API returns appropriate HTTP status codes and error messages:

### Common Error Responses

**400 Bad Request - Validation Error:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

**500 Internal Server Error:**
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Time Format Reference

All times in the API are represented in **minutes from midnight (24-hour format)**:

| Time | Minutes |
|------|---------|
| 12:00 AM (Midnight) | 0 |
| 9:00 AM | 540 |
| 12:00 PM (Noon) | 720 |
| 3:30 PM | 930 |
| 11:59 PM | 1439 |

**Formula:** `minutes = (hours * 60) + minutes`

---

## Database

**Database:** MongoDB  
**Collections:**
- `classrooms` - Classroom entities
- `courses` - Course entities
- `schedules` - Schedule entities
- `statistics` - Algorithm execution statistics

**Connection:** Reads `MONGODB_URI` from `.env`  
**Default Local:** `mongodb://localhost:27017/greedy-scheduler`

---

## Examples

### Complete Workflow Example

1. **Create a Classroom:**
```bash
curl -X POST http://localhost:3000/classrooms \
  -H "Content-Type: application/json" \
  -d '{
    "id": "CS01",
    "name": "Computer Science Lab",
    "building": "Building A",
    "capacity": 30,
    "status": "available"
  }'
```

2. **Create Courses:**
```bash
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{
    "id": "CS101-001",
    "classCode": "CS101",
    "subjectName": "Introduction to Computer Science",
    "instructor": "Dr. Smith",
    "classroomId": "CS01",
    "startTime": 540,
    "endTime": 630,
    "dayOfWeek": "Monday"
  }'
```

3. **Get Dashboard Statistics:**
```bash
curl http://localhost:3000/statistics/dashboard
```

4. **Run Activity Selection Algorithm:**
```bash
curl -X POST http://localhost:3000/activity-selection/select-classes \
  -H "Content-Type: application/json" \
  -d '{
    "classroomId": "CS01",
    "courses": [
      {
        "id": "CS101-001",
        "classCode": "CS101",
        "section": "001",
        "startTime": 540,
        "endTime": 630,
        "instructor": "Dr. Smith"
      },
      {
        "id": "CS101-002",
        "classCode": "CS101",
        "section": "002",
        "startTime": 630,
        "endTime": 720,
        "instructor": "Dr. Jones"
      }
    ]
  }'
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-05-15 | Initial API release with CRUD operations for classrooms, courses, and schedules. Added Activity Selection algorithm and Statistics tracking. |

---

## Support & Feedback

For issues, feature requests, or feedback, please visit:
https://github.com/anomalyco/opencode
