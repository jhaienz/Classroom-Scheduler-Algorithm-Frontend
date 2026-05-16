# Quick Start Guide

## Prerequisites
- Node.js and npm/pnpm installed
- Backend running on http://localhost:3000
- Frontend cloned and dependencies installed

## 1️⃣ Configure Backend URL

Edit or create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 2️⃣ Start Frontend
```bash
npm run dev
```

Frontend runs on http://localhost:3001

## 3️⃣ Start Backend
```bash
# In backend directory
npm run dev
```

Backend runs on http://localhost:3000

## 4️⃣ Test the Connection

### Check Dashboard
1. Open http://localhost:3001
2. Should display statistics from backend
3. If backend is down, gracefully falls back to 0 values

### Create a Classroom
1. Go to Classrooms page
2. Click "Add Classroom"
3. Fill in details (ID, Name, Building, Capacity)
4. Submit
5. Should appear in table immediately

### Create a Course
1. Go to Courses page
2. Click "Add Course"
3. Select classroom
4. Enter course details
5. Set day and times
6. Submit

### Run Optimizer
1. Go to Activity Optimizer
2. Select classroom and day
3. Click "Run Optimizer"
4. View results with non-overlapping classes

### View Statistics
1. Dashboard shows:
   - Total classrooms, courses, schedules
   - Algorithm execution count
   - Success rate and performance metrics

## API Verification

Test endpoints directly:

```bash
# Health check
curl http://localhost:3000/

# Get all classrooms
curl http://localhost:3000/classrooms

# Get dashboard stats
curl http://localhost:3000/statistics/dashboard

# Create classroom
curl -X POST http://localhost:3000/classrooms \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TEST01",
    "name": "Test Room",
    "building": "Building A",
    "capacity": 30,
    "status": "available"
  }'
```

## Files to Review

- `lib/api.ts` - All API calls
- `lib/types.ts` - Type definitions
- `app/page.tsx` - Dashboard
- `INTEGRATION_GUIDE.md` - Full integration docs
- `API.md` - Backend API reference

## Common Issues

| Issue | Solution |
|-------|----------|
| "Failed to fetch" | Backend not running on port 3000 |
| Empty dashboard | Check `.env.local` API URL |
| Type errors | Run `npm run typecheck` |
| Build errors | Run `npm install` |

## Useful Commands

```bash
npm run dev          # Start development
npm run build        # Build for production
npm run typecheck    # Check types
npm run lint         # Check code quality
npm run format       # Format code
```

## Next Steps

1. ✅ Backend running
2. ✅ Frontend running
3. ✅ Create test data (classrooms, courses)
4. ✅ Test optimizer
5. ✅ Review statistics
6. 📖 Read INTEGRATION_GUIDE.md for advanced usage
