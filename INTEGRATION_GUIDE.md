# Frontend-Backend API Integration Guide

## Overview

The frontend has been fully connected to the Greedy Backend API. All endpoints from the API documentation have been integrated and are ready to use.

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production, update this URL to your deployed backend server.

## File Structure

### Core API Integration Files

- **`lib/api.ts`** - API client with all endpoints
  - Classrooms (CRUD operations)
  - Courses (CRUD + query by classroom)
  - Schedules (CRUD + query by course/date)
  - Activity Selection (optimization algorithm)
  - Statistics (dashboard, execution, health)

- **`lib/types.ts`** - Complete TypeScript type definitions
  - All request/response types from API documentation
  - Full type safety for all operations

- **`app/actions.ts`** - Server actions for mutations
  - All CRUD operations wrapped as server actions
  - Automatic cache revalidation after mutations

### Page Structure

- **`app/page.tsx`** - Dashboard with statistics
- **`app/classrooms/page.tsx`** - Classroom management
- **`app/courses/page.tsx`** - Course management
- **`app/schedules/page.tsx`** - Schedule management
- **`app/optimizer/page.tsx`** - Activity selection/optimization

## Getting Started

### 1. Start the Backend

```bash
# In your backend directory
npm run start
# or for development
npm run dev
```

The backend should be running on `http://localhost:3000`

### 2. Update Environment Configuration

Edit `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Start the Frontend

```bash
# In your frontend directory
npm run dev
```

The frontend runs on `http://localhost:3001`

## API Endpoints Used

### Classrooms
- `GET /classrooms` - Get all classrooms
- `GET /classrooms/:id` - Get specific classroom
- `POST /classrooms` - Create classroom
- `PUT /classrooms/:id` - Update classroom
- `DELETE /classrooms/:id` - Delete classroom

### Courses
- `GET /courses` - Get all courses
- `GET /courses/:id` - Get specific course
- `GET /courses/classroom/:classroomId` - Get courses for classroom
- `POST /courses` - Create course
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course

### Schedules
- `GET /schedules` - Get all schedules
- `GET /schedules/:id` - Get specific schedule
- `GET /schedules/course/:courseId` - Get schedules for course
- `GET /schedules/date/:date` - Get schedules for date
- `POST /schedules` - Create schedule
- `PUT /schedules/:id` - Update schedule
- `DELETE /schedules/:id` - Delete schedule

### Activity Selection (Optimizer)
- `POST /activity-selection/select-classes` - Run optimization algorithm
- `GET /activity-selection/statistics` - Get algorithm stats documentation
- `GET /activity-selection/health` - Health check

### Statistics
- `GET /statistics/dashboard` - Complete dashboard statistics
- `GET /statistics/executions` - Execution statistics only
- `GET /statistics/counts` - Database counts only
- `GET /statistics/health` - Statistics service health

### Health
- `GET /` - App health check

## Using the API Client

### Example: Create a Classroom

```typescript
import { api } from '@/lib/api';

const classroom = await api.createClassroom({
  id: 'CS01',
  name: 'Computer Science Lab',
  building: 'Building A',
  capacity: 30,
  status: 'available'
});
```

### Example: Get Courses for a Classroom

```typescript
import { api } from '@/lib/api';

const courses = await api.getCoursesByClassroom('CS01');
```

### Example: Run Activity Selection

```typescript
import { api } from '@/lib/api';

const result = await api.selectNonOverlappingClasses({
  classroomId: 'CS01',
  courses: [
    {
      id: 'CS101-001',
      classCode: 'CS101',
      section: '001',
      startTime: 540,  // 9:00 AM
      endTime: 630,    // 10:30 AM
      instructor: 'Dr. Smith'
    },
    {
      id: 'CS101-002',
      classCode: 'CS101',
      section: '002',
      startTime: 600,  // 10:00 AM
      endTime: 690,    // 11:30 AM
      instructor: 'Dr. Jones'
    }
  ]
});

console.log(result.selectedClasses); // Non-overlapping classes
console.log(result.conflictingClasses); // Classes with conflicts
```

### Example: Get Dashboard Statistics

```typescript
import { api } from '@/lib/api';

const stats = await api.getDashboardStatistics();

console.log(stats.database.totalClassrooms);
console.log(stats.algorithm.successRate);
console.log(stats.scheduling.successfulSchedules);
```

## Time Format

All times in the API are represented as **minutes from midnight (0-1439)**:

- 12:00 AM (Midnight) = 0
- 9:00 AM = 540
- 12:00 PM (Noon) = 720
- 3:30 PM = 930
- 11:59 PM = 1439

Formula: `minutes = (hours * 60) + minutes`

**Utility function available:**
```typescript
import { minutesToTime } from '@/lib/utils';

minutesToTime(540); // Returns "9:00 AM"
minutesToTime(930); // Returns "3:30 PM"
```

## Error Handling

All API calls include error handling. Errors are thrown with descriptive messages:

```typescript
try {
  const result = await api.createClassroom(data);
} catch (error: any) {
  console.error(error.message); // HTTP error message from backend
  // Handle error appropriately
}
```

## Server Actions

Server actions are Next.js functions that handle mutations and automatically revalidate cache:

```typescript
'use client';

import { createClassroomAction } from '@/app/actions';
import { useTransition } from 'react';

export function MyComponent() {
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      await createClassroomAction({
        id: 'NEW01',
        name: 'New Classroom',
        building: 'Building A',
        capacity: 30,
        status: 'available'
      });
    });
  };

  return <button onClick={handleCreate}>Create Classroom</button>;
}
```

## Testing Checklist

- [ ] Backend running on `http://localhost:3000`
- [ ] Frontend running on `http://localhost:3001`
- [ ] `.env.local` configured with `NEXT_PUBLIC_API_URL`
- [ ] Dashboard loads and shows statistics
- [ ] Can create a classroom
- [ ] Can create a course
- [ ] Can create a schedule
- [ ] Optimizer runs successfully
- [ ] Statistics update after operations

## Common Issues

### Backend Connection Failed

**Issue:** "Failed to fetch" error
**Solution:**
1. Verify backend is running on port 3000
2. Check `NEXT_PUBLIC_API_URL` is correct
3. Verify CORS is enabled on backend (if needed)

### Type Errors

**Issue:** TypeScript errors related to API responses
**Solution:**
- All types are defined in `lib/types.ts`
- Make sure backend response matches documented API format
- Check if API documentation has changed

### Cache Issues

**Issue:** Data not updating after mutations
**Solution:**
- Server actions automatically revalidate cache
- Try manual page refresh if needed
- Check browser developer tools for network errors

## Next Steps

1. **Add Validation** - Implement form validation for user inputs
2. **Add Loading States** - Improve UX with loading indicators
3. **Add Error Boundaries** - Handle errors gracefully
4. **Add Search/Filter** - Enhance data discovery in tables
5. **Add Pagination** - For large datasets
6. **Add Export** - Export data to CSV/PDF

## Documentation

- Backend API: See `API.md` in project root
- NestJS Backend: https://docs.nestjs.com
- Next.js: https://nextjs.org/docs
- React: https://react.dev

## Support

For issues or questions:
1. Check the API documentation (`API.md`)
2. Review the type definitions (`lib/types.ts`)
3. Check the API client (`lib/api.ts`)
4. Review example pages in `app/` directory
