# Frontend Integration Guide

**Backend URL:** `http://localhost:3000`  
**Database:** MongoDB (greedy-scheduler)  
**Framework:** NestJS v11 + Mongoose  
**Last Updated:** May 14, 2026

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication & Setup](#authentication--setup)
3. [Core Data Models](#core-data-models)
4. [API Endpoints](#api-endpoints)
5. [Data Flow Examples](#data-flow-examples)
6. [Error Handling](#error-handling)
7. [Time Representation](#time-representation)
8. [Implementation Patterns](#implementation-patterns)

---

## Architecture Overview

### High-Level System Design

```
┌─────────────────┐
│   Frontend      │
│  (React/Vue)    │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────────────┐
│  NestJS API Server      │
│  (localhost:3000)       │
├─────────────────────────┤
│ - ClassroomController   │
│ - CourseController      │
│ - ScheduleController    │
│ - ActivitySelection     │
└────────┬────────────────┘
         │
         │ Mongoose ODM
         │
┌────────▼────────────────┐
│  MongoDB Database       │
│  (greedy-scheduler)     │
├─────────────────────────┤
│ Collections:            │
│ - classrooms            │
│ - courses               │
│ - schedules             │
└─────────────────────────┘
```

### Request/Response Flow

```
Frontend Request
    ↓
[Validation] → 400 Bad Request (if invalid)
    ↓
[Processing] → MongoDB Operation
    ↓
[Response] → 200/201 OK with data
             OR
             404 Not Found / 500 Error
```

---

## Authentication & Setup

### CORS Configuration
The backend is configured to accept requests from `localhost:3000`. If your frontend runs on a different port, contact the backend team to update CORS settings.

### Headers Required
All POST/PUT requests must include:
```json
{
  "Content-Type": "application/json"
}
```

### Server Status
```bash
# Check if server is running
curl http://localhost:3000/

# Expected response
"Hello World!"
```

---

## Core Data Models

### 1. Classroom

**MongoDB Collection:** `classrooms`

**Data Schema:**
```typescript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  id: string,                       // Custom unique identifier
  name: string,                     // e.g., "Room 101"
  building: string,                 // e.g., "Building A"
  capacity: number,                 // e.g., 30
  status: "available" | "maintenance" | "unavailable",
  createdAt: ISO8601DateTime,       // Auto-generated
  updatedAt: ISO8601DateTime,       // Auto-updated
  __v: number                       // Mongoose version number
}
```

**Example Document:**
```json
{
  "_id": "6a0549818b871975375b42d6",
  "id": "room-101",
  "name": "Room 101",
  "building": "Building A",
  "capacity": 30,
  "status": "available",
  "createdAt": "2026-05-14T04:03:13.988Z",
  "updatedAt": "2026-05-14T04:03:13.988Z",
  "__v": 0
}
```

---

### 2. Course

**MongoDB Collection:** `courses`

**Data Schema:**
```typescript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  id: string,                       // Custom unique identifier
  classroomId: ObjectId,            // Reference to Classroom._id
  classCode: string,                // e.g., "CS101"
  subjectName: string,              // e.g., "Intro to CS"
  instructor: string,               // e.g., "Dr. Smith"
  startTime: number,                // Minutes from midnight (0-1439)
  endTime: number,                  // Minutes from midnight
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
  createdAt: ISO8601DateTime,       // Auto-generated
  updatedAt: ISO8601DateTime,       // Auto-updated
  __v: number                       // Mongoose version number
}
```

**Example Document:**
```json
{
  "_id": "6a0549818b871975375b42d7",
  "id": "cs101",
  "classroomId": "6a0549818b871975375b42d6",
  "classCode": "CS101",
  "subjectName": "Intro to Computer Science",
  "instructor": "Dr. Sarah Smith",
  "startTime": 540,
  "endTime": 630,
  "dayOfWeek": "Monday",
  "createdAt": "2026-05-14T04:03:13.988Z",
  "updatedAt": "2026-05-14T04:03:13.988Z",
  "__v": 0
}
```

---

### 3. Schedule

**MongoDB Collection:** `schedules`

**Data Schema:**
```typescript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  id: string,                       // Custom unique identifier
  courseId: string,                 // Reference to Course.id
  classroomId: string,              // Reference to Classroom.id
  dayOfWeek: string,                // e.g., "Monday"
  startTime: number,                // Minutes from midnight (0-1439)
  endTime: number,                  // Minutes from midnight
  createdAt: ISO8601DateTime,       // Auto-generated
  updatedAt: ISO8601DateTime,       // Auto-updated
  __v: number                       // Mongoose version number
}
```

**Example Document:**
```json
{
  "_id": "6a0549818b871975375b42d8",
  "id": "schedule-001",
  "courseId": "cs101",
  "classroomId": "room-101",
  "dayOfWeek": "Monday",
  "startTime": 540,
  "endTime": 630,
  "createdAt": "2026-05-14T04:03:13.988Z",
  "updatedAt": "2026-05-14T04:03:13.988Z",
  "__v": 0
}
```

---

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Classroom Endpoints

#### 1. Create Classroom
```http
POST /classrooms
Content-Type: application/json

{
  "id": "room-101",
  "name": "Room 101",
  "building": "Building A",
  "capacity": 30,
  "status": "available"
}
```

**Response (201 Created):**
```json
{
  "_id": "6a0549818b871975375b42d6",
  "id": "room-101",
  "name": "Room 101",
  "building": "Building A",
  "capacity": 30,
  "status": "available",
  "createdAt": "2026-05-14T04:03:13.988Z",
  "updatedAt": "2026-05-14T04:03:13.988Z",
  "__v": 0
}
```

#### 2. Get All Classrooms
```http
GET /classrooms
```

**Response (200 OK):**
```json
[
  {
    "_id": "6a0549818b871975375b42d6",
    "id": "room-101",
    "name": "Room 101",
    "building": "Building A",
    "capacity": 30,
    "status": "available",
    "createdAt": "2026-05-14T04:03:13.988Z",
    "updatedAt": "2026-05-14T04:03:13.988Z",
    "__v": 0
  },
  {
    "_id": "6a0549818b871975375b42d7",
    "id": "room-102",
    "name": "Room 102",
    "building": "Building A",
    "capacity": 40,
    "status": "available",
    "createdAt": "2026-05-14T04:03:14.988Z",
    "updatedAt": "2026-05-14T04:03:14.988Z",
    "__v": 0
  }
]
```

#### 3. Get Specific Classroom
```http
GET /classrooms/:id
```

**Example:**
```http
GET /classrooms/room-101
```

**Response (200 OK):**
```json
{
  "_id": "6a0549818b871975375b42d6",
  "id": "room-101",
  "name": "Room 101",
  "building": "Building A",
  "capacity": 30,
  "status": "available",
  "createdAt": "2026-05-14T04:03:13.988Z",
  "updatedAt": "2026-05-14T04:03:13.988Z",
  "__v": 0
}
```

#### 4. Update Classroom
```http
PUT /classrooms/:id
Content-Type: application/json

{
  "name": "Room 101 (Updated)",
  "capacity": 35
}
```

**Example:**
```http
PUT /classrooms/room-101
```

**Response (200 OK):**
```json
{
  "_id": "6a0549818b871975375b42d6",
  "id": "room-101",
  "name": "Room 101 (Updated)",
  "building": "Building A",
  "capacity": 35,
  "status": "available",
  "createdAt": "2026-05-14T04:03:13.988Z",
  "updatedAt": "2026-05-14T04:05:00.000Z",
  "__v": 0
}
```

#### 5. Delete Classroom
```http
DELETE /classrooms/:id
```

**Example:**
```http
DELETE /classrooms/room-101
```

**Response (200 OK):**
```json
{
  "_id": "6a0549818b871975375b42d6",
  "id": "room-101",
  "name": "Room 101",
  "building": "Building A",
  "capacity": 30,
  "status": "available",
  "createdAt": "2026-05-14T04:03:13.988Z",
  "updatedAt": "2026-05-14T04:03:13.988Z",
  "__v": 0
}
```

---

### Course Endpoints

#### 1. Create Course
```http
POST /courses
Content-Type: application/json

{
  "id": "cs101",
  "classroomId": "6a0549818b871975375b42d6",
  "classCode": "CS101",
  "subjectName": "Intro to Computer Science",
  "instructor": "Dr. Sarah Smith",
  "startTime": 540,
  "endTime": 630,
  "dayOfWeek": "Monday"
}
```

**Response (201 Created):**
```json
{
  "_id": "6a0549818b871975375b42d7",
  "id": "cs101",
  "classroomId": "6a0549818b871975375b42d6",
  "classCode": "CS101",
  "subjectName": "Intro to Computer Science",
  "instructor": "Dr. Sarah Smith",
  "startTime": 540,
  "endTime": 630,
  "dayOfWeek": "Monday",
  "createdAt": "2026-05-14T04:03:13.988Z",
  "updatedAt": "2026-05-14T04:03:13.988Z",
  "__v": 0
}
```

#### 2. Get All Courses
```http
GET /courses
```

**Response (200 OK):**
```json
[
  {
    "_id": "6a0549818b871975375b42d7",
    "id": "cs101",
    "classroomId": "6a0549818b871975375b42d6",
    "classCode": "CS101",
    "subjectName": "Intro to Computer Science",
    "instructor": "Dr. Sarah Smith",
    "startTime": 540,
    "endTime": 630,
    "dayOfWeek": "Monday",
    "createdAt": "2026-05-14T04:03:13.988Z",
    "updatedAt": "2026-05-14T04:03:13.988Z",
    "__v": 0
  }
]
```

#### 3. Get Specific Course
```http
GET /courses/:id
```

**Example:**
```http
GET /courses/cs101
```

**Response (200 OK):**
```json
{
  "_id": "6a0549818b871975375b42d7",
  "id": "cs101",
  "classroomId": "6a0549818b871975375b42d6",
  "classCode": "CS101",
  "subjectName": "Intro to Computer Science",
  "instructor": "Dr. Sarah Smith",
  "startTime": 540,
  "endTime": 630,
  "dayOfWeek": "Monday",
  "createdAt": "2026-05-14T04:03:13.988Z",
  "updatedAt": "2026-05-14T04:03:13.988Z",
  "__v": 0
}
```

#### 4. Update Course
```http
PUT /courses/:id
Content-Type: application/json

{
  "subjectName": "Advanced Computer Science",
  "instructor": "Dr. John Smith"
}
```

**Example:**
```http
PUT /courses/cs101
```

**Response (200 OK):**
```json
{
  "_id": "6a0549818b871975375b42d7",
  "id": "cs101",
  "classroomId": "6a0549818b871975375b42d6",
  "classCode": "CS101",
  "subjectName": "Advanced Computer Science",
  "instructor": "Dr. John Smith",
  "startTime": 540,
  "endTime": 630,
  "dayOfWeek": "Monday",
  "createdAt": "2026-05-14T04:03:13.988Z",
  "updatedAt": "2026-05-14T04:05:00.000Z",
  "__v": 0
}
```

#### 5. Delete Course
```http
DELETE /courses/:id
```

**Example:**
```http
DELETE /courses/cs101
```

**Response (200 OK):** Returns deleted course object

---

### Schedule Endpoints

#### 1. Create Schedule
```http
POST /schedules
Content-Type: application/json

{
  "id": "schedule-001",
  "courseId": "cs101",
  "classroomId": "room-101",
  "dayOfWeek": "Monday",
  "startTime": 540,
  "endTime": 630
}
```

**Response (201 Created):**
```json
{
  "_id": "6a0549818b871975375b42d8",
  "id": "schedule-001",
  "courseId": "cs101",
  "classroomId": "room-101",
  "dayOfWeek": "Monday",
  "startTime": 540,
  "endTime": 630,
  "createdAt": "2026-05-14T04:03:13.988Z",
  "updatedAt": "2026-05-14T04:03:13.988Z",
  "__v": 0
}
```

#### 2. Get All Schedules
```http
GET /schedules
```

**Response (200 OK):**
```json
[
  {
    "_id": "6a0549818b871975375b42d8",
    "id": "schedule-001",
    "courseId": "cs101",
    "classroomId": "room-101",
    "dayOfWeek": "Monday",
    "startTime": 540,
    "endTime": 630,
    "createdAt": "2026-05-14T04:03:13.988Z",
    "updatedAt": "2026-05-14T04:03:13.988Z",
    "__v": 0
  }
]
```

#### 3. Get Specific Schedule
```http
GET /schedules/:id
```

**Example:**
```http
GET /schedules/schedule-001
```

**Response (200 OK):**
```json
{
  "_id": "6a0549818b871975375b42d8",
  "id": "schedule-001",
  "courseId": "cs101",
  "classroomId": "room-101",
  "dayOfWeek": "Monday",
  "startTime": 540,
  "endTime": 630,
  "createdAt": "2026-05-14T04:03:13.988Z",
  "updatedAt": "2026-05-14T04:03:13.988Z",
  "__v": 0
}
```

#### 4. Update Schedule
```http
PUT /schedules/:id
Content-Type: application/json

{
  "dayOfWeek": "Tuesday",
  "startTime": 550,
  "endTime": 640
}
```

**Example:**
```http
PUT /schedules/schedule-001
```

**Response (200 OK):** Returns updated schedule object

#### 5. Delete Schedule
```http
DELETE /schedules/:id
```

**Example:**
```http
DELETE /schedules/schedule-001
```

**Response (200 OK):** Returns deleted schedule object

---

### Activity Selection Endpoints

#### 1. Select Non-Overlapping Classes (Greedy Algorithm)
```http
POST /activity-selection/select-classes
Content-Type: application/json

{
  "classroomId": "room-101",
  "dayOfWeek": "Monday"
}
```

**Response (200 OK):**
```json
{
  "schedules": [
    {
      "_id": "6a0549818b871975375b42d8",
      "id": "schedule-001",
      "courseId": "cs101",
      "classroomId": "room-101",
      "dayOfWeek": "Monday",
      "startTime": 540,
      "endTime": 630,
      "createdAt": "2026-05-14T04:03:13.988Z",
      "updatedAt": "2026-05-14T04:03:13.988Z",
      "__v": 0
    },
    {
      "_id": "6a0549818b871975375b42d9",
      "id": "schedule-002",
      "courseId": "cs102",
      "classroomId": "room-101",
      "dayOfWeek": "Monday",
      "startTime": 660,
      "endTime": 750,
      "createdAt": "2026-05-14T04:03:14.988Z",
      "updatedAt": "2026-05-14T04:03:14.988Z",
      "__v": 0
    }
  ],
  "totalSchedules": 2,
  "conflicts": []
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Courses list cannot be empty",
  "error": "Bad Request",
  "statusCode": 400
}
```

#### 2. Get Algorithm Statistics
```http
GET /activity-selection/statistics
```

**Response (200 OK):**
```json
{
  "totalExecutions": 5,
  "averageExecutionTime": 12.5,
  "successfulSchedules": 3,
  "failedAttempts": 2
}
```

---

## Data Flow Examples

### Example 1: Create Classroom + Course + Schedule

**Step 1: Create Classroom**
```
Frontend → POST /classrooms
         → Backend creates classroom
         → Response: Classroom with _id
```

**Step 2: Create Course (using Classroom ID)**
```
Frontend → POST /courses
         → classroomId: "6a0549818b871975375b42d6" (from Step 1)
         → Backend creates course
         → Response: Course with _id
```

**Step 3: Create Schedule (using Course ID and Classroom ID)**
```
Frontend → POST /schedules
         → courseId: "cs101"
         → classroomId: "room-101"
         → Backend creates schedule
         → Response: Schedule with _id
```

---

### Example 2: Activity Selection Flow

**Step 1: Fetch All Schedules for a Classroom**
```
Frontend → GET /schedules
         → Response: Array of all schedules
```

**Step 2: Filter by Classroom and Day**
```
Frontend → Filter results for specific classroom and day
         → Find overlapping courses
```

**Step 3: Execute Greedy Algorithm**
```
Frontend → POST /activity-selection/select-classes
         → Body: { classroomId, dayOfWeek }
         → Backend executes greedy algorithm
         → Response: Non-overlapping schedules
```

---

### Example 3: Update & Delete Flow

**Step 1: Get Current Data**
```
Frontend → GET /classrooms/room-101
         → Response: Current classroom data
```

**Step 2: Update Data**
```
Frontend → PUT /classrooms/room-101
         → Body: Updated fields only
         → Response: Updated classroom
```

**Step 3: Delete if needed**
```
Frontend → DELETE /classrooms/room-101
         → Response: Deleted classroom (confirm)
```

---

## Error Handling

### HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK | GET/PUT/DELETE successful |
| 201 | Created | POST successful |
| 400 | Bad Request | Invalid data, missing required fields |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database or server error |

### Error Response Format

**400 Bad Request:**
```json
{
  "message": "Validation failed: 'name' is required",
  "error": "Bad Request",
  "statusCode": 400
}
```

**404 Not Found:**
```json
{
  "message": "Classroom with id 'room-999' not found",
  "error": "Not Found",
  "statusCode": 404
}
```

**500 Internal Server Error:**
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

### Common Validation Errors

| Field | Requirement | Error |
|-------|-------------|-------|
| `id` (all models) | Must be unique string | "Duplicate id" |
| `capacity` (Classroom) | Must be positive number | "Capacity must be > 0" |
| `startTime` | Must be 0-1439 | "Start time out of range" |
| `endTime` | Must be > startTime | "End time must be > start time" |
| `dayOfWeek` | Must match enum | "Invalid day of week" |

---

## Time Representation

### Minutes from Midnight Format

All times are stored as **minutes from midnight (0-1439)**.

**Conversion Examples:**

| Time | Minutes | Formula |
|------|---------|---------|
| 00:00 (midnight) | 0 | 0 * 60 + 0 |
| 09:00 AM | 540 | 9 * 60 + 0 |
| 12:00 PM (noon) | 720 | 12 * 60 + 0 |
| 14:30 (2:30 PM) | 870 | 14 * 60 + 30 |
| 23:59 | 1439 | 23 * 60 + 59 |

**Frontend Helper Functions:**

```javascript
// Convert HH:MM to minutes from midnight
function timeToMinutes(hours, minutes) {
  return hours * 60 + minutes;
}

// Convert minutes from midnight to HH:MM
function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// Example usage
timeToMinutes(9, 0);      // 540
minutesToTime(540);        // "09:00"
minutesToTime(870);        // "14:30"
```

### Time Validation

- **Valid range:** 0 ≤ startTime < endTime ≤ 1439
- **Overlapping:** `start1 < end2 && start2 < end1`

---

## Implementation Patterns

### Pattern 1: Fetch and Display List

```javascript
async function loadClassrooms() {
  try {
    const response = await fetch('http://localhost:3000/classrooms');
    const classrooms = await response.json();
    displayClassrooms(classrooms);
  } catch (error) {
    console.error('Error loading classrooms:', error);
  }
}

function displayClassrooms(classrooms) {
  classrooms.forEach(classroom => {
    console.log(`${classroom.name} (${classroom.building}) - Capacity: ${classroom.capacity}`);
  });
}
```

### Pattern 2: Create Resource

```javascript
async function createClassroom(formData) {
  try {
    const response = await fetch('http://localhost:3000/classrooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: formData.id,
        name: formData.name,
        building: formData.building,
        capacity: parseInt(formData.capacity),
        status: 'available'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const created = await response.json();
    console.log('Classroom created:', created);
    return created;
  } catch (error) {
    console.error('Error creating classroom:', error);
  }
}
```

### Pattern 3: Update Resource

```javascript
async function updateClassroom(classroomId, updates) {
  try {
    const response = await fetch(`http://localhost:3000/classrooms/${classroomId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updated = await response.json();
    console.log('Classroom updated:', updated);
    return updated;
  } catch (error) {
    console.error('Error updating classroom:', error);
  }
}
```

### Pattern 4: Delete Resource

```javascript
async function deleteClassroom(classroomId) {
  try {
    const response = await fetch(`http://localhost:3000/classrooms/${classroomId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const deleted = await response.json();
    console.log('Classroom deleted:', deleted);
    return deleted;
  } catch (error) {
    console.error('Error deleting classroom:', error);
  }
}
```

### Pattern 5: Run Activity Selection Algorithm

```javascript
async function optimizeSchedule(classroomId, dayOfWeek) {
  try {
    const response = await fetch('http://localhost:3000/activity-selection/select-classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classroomId: classroomId,
        dayOfWeek: dayOfWeek
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Optimized schedules:', result.schedules);
    console.log('Total scheduled:', result.totalSchedules);
    console.log('Conflicts:', result.conflicts);
    return result;
  } catch (error) {
    console.error('Error optimizing schedule:', error);
  }
}
```

---

## Complete Integration Example

### Frontend Component (React/Vue)

```javascript
// Component State
const [classrooms, setClassrooms] = useState([]);
const [courses, setCourses] = useState([]);
const [schedules, setSchedules] = useState([]);
const [loading, setLoading] = useState(false);

// Load all data
async function loadAllData() {
  setLoading(true);
  try {
    const [classroomsRes, coursesRes, schedulesRes] = await Promise.all([
      fetch('http://localhost:3000/classrooms'),
      fetch('http://localhost:3000/courses'),
      fetch('http://localhost:3000/schedules')
    ]);

    setClassrooms(await classroomsRes.json());
    setCourses(await coursesRes.json());
    setSchedules(await schedulesRes.json());
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    setLoading(false);
  }
}

// Optimize schedule for a classroom
async function optimizeClassroomSchedule(classroomId, dayOfWeek) {
  try {
    const response = await fetch('http://localhost:3000/activity-selection/select-classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classroomId, dayOfWeek })
    });

    if (!response.ok) throw new Error('Failed to optimize');

    const optimized = await response.json();
    console.log('Optimized schedules:', optimized);
    return optimized;
  } catch (error) {
    console.error('Error:', error);
  }
}

// On component mount
useEffect(() => {
  loadAllData();
}, []);
```

---

## Summary for Frontend Development

### Must Know

1. **Base URL:** `http://localhost:3000`
2. **All requests use JSON** with `Content-Type: application/json` header
3. **Time format:** Minutes from midnight (0-1439), not ISO strings
4. **ID fields:** Always use custom `id` string, not MongoDB `_id`
5. **Relationships:**
   - Course → references Classroom via `classroomId`
   - Schedule → references Course via `courseId` and Classroom via `classroomId`

### Key Endpoints

```
// Classroom CRUD
POST   /classrooms           (create)
GET    /classrooms           (list all)
GET    /classrooms/:id       (get one)
PUT    /classrooms/:id       (update)
DELETE /classrooms/:id       (delete)

// Course CRUD
POST   /courses              (create)
GET    /courses              (list all)
GET    /courses/:id          (get one)
PUT    /courses/:id          (update)
DELETE /courses/:id          (delete)

// Schedule CRUD
POST   /schedules            (create)
GET    /schedules            (list all)
GET    /schedules/:id        (get one)
PUT    /schedules/:id        (update)
DELETE /schedules/:id        (delete)

// Algorithm
POST   /activity-selection/select-classes  (optimize)
GET    /activity-selection/statistics      (stats)
```

### Frontend Responsibilities

- ✅ Collect form input from users
- ✅ Convert times to minutes format before sending
- ✅ Validate required fields
- ✅ Handle HTTP errors gracefully
- ✅ Display loading states
- ✅ Convert minutes back to HH:MM format for display
- ✅ Manage CRUD operations (Create, Read, Update, Delete)
- ✅ Call algorithm endpoint and display optimized results

### Backend Responsibilities

- ✅ Data validation (MongoDB schemas)
- ✅ Database persistence
- ✅ Greedy algorithm execution
- ✅ Error responses
- ✅ CRUD operations
- ✅ Data relationships/references

---

## Quick Reference

### Classroom Creation
```json
{
  "id": "room-101",
  "name": "Room 101",
  "building": "Building A",
  "capacity": 30,
  "status": "available"
}
```

### Course Creation
```json
{
  "id": "cs101",
  "classroomId": "<ObjectId>",
  "classCode": "CS101",
  "subjectName": "Intro to CS",
  "instructor": "Dr. Smith",
  "startTime": 540,
  "endTime": 630,
  "dayOfWeek": "Monday"
}
```

### Schedule Creation
```json
{
  "id": "schedule-001",
  "courseId": "cs101",
  "classroomId": "room-101",
  "dayOfWeek": "Monday",
  "startTime": 540,
  "endTime": 630
}
```

### Algorithm Request
```json
{
  "classroomId": "room-101",
  "dayOfWeek": "Monday"
}
```

---

## Testing the API

### Using cURL

```bash
# Test server
curl http://localhost:3000/

# Create classroom
curl -X POST http://localhost:3000/classrooms \
  -H "Content-Type: application/json" \
  -d '{"id":"room-101","name":"Room 101","building":"Building A","capacity":30}'

# Get all classrooms
curl http://localhost:3000/classrooms

# Get specific classroom
curl http://localhost:3000/classrooms/room-101

# Update classroom
curl -X PUT http://localhost:3000/classrooms/room-101 \
  -H "Content-Type: application/json" \
  -d '{"capacity":35}'

# Delete classroom
curl -X DELETE http://localhost:3000/classrooms/room-101
```

### Using Postman

1. Import the API collection (if available)
2. Set variables: `baseUrl = http://localhost:3000`
3. Test each endpoint with provided examples
4. Save responses for documentation

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Cannot connect to backend | Verify `npm run start:dev` is running on localhost:3000 |
| 404 Not Found | Check that resource `id` exists in database |
| 400 Bad Request | Verify all required fields are present and valid |
| MongoDB errors | Ensure `docker-compose up -d` is running |
| CORS errors | Contact backend team to add frontend domain to CORS |
| Duplicate ID error | Each resource must have a unique `id` string |

---

## Next Steps for Frontend

1. ✅ Set up API client (axios, fetch, SWR, etc.)
2. ✅ Create CRUD pages for Classrooms, Courses, Schedules
3. ✅ Implement time picker with minutes conversion
4. ✅ Build schedule visualization/calendar
5. ✅ Integrate activity selection algorithm
6. ✅ Add loading states and error handling
7. ✅ Create forms with validation
8. ✅ Implement data tables with sorting/filtering

---

**Last Updated:** May 14, 2026  
**Backend Version:** 0.0.1  
**Status:** Production Ready ✅
