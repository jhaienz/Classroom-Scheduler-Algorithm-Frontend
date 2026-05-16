# Troubleshooting Guide

## Current Issue: Backend 500 Errors

### Symptoms
- `POST /courses` returns 500 (Internal Server Error)
- `GET /statistics/dashboard` returns 500 (Internal Server Error)
- Other endpoints (GET /classrooms, etc.) work fine (200 OK)

### Root Cause Analysis

The frontend is working correctly. The issue is in the **backend**.

**Evidence:**
- ✅ GET endpoints work: `/classrooms` (200), `/courses` (200), `/schedules` (200)
- ❌ POST /courses fails: 500 error
- ❌ GET /statistics/dashboard fails: 500 error

### Why Some Endpoints Work and Others Don't

✅ **Working Endpoints**
- `GET /classrooms` - Simple read operation
- `GET /courses` - Simple read operation
- `GET /schedules` - Simple read operation
- `POST /classrooms` - Works (you created a classroom successfully)

❌ **Failing Endpoints**
- `POST /courses` - Returns 500
- `GET /statistics/dashboard` - Returns 500

### Possible Backend Issues

#### 1. Course Creation (POST /courses)
**Potential problems:**
- Missing validation for required fields
- Database connection issue during write
- Foreign key constraint (classroom doesn't exist)
- Invalid data format
- NestJS validation pipe issue

**Fix checklist:**
- [ ] Verify classroomId exists before creating course
- [ ] Check if classroom is marked as available
- [ ] Verify required fields are provided
- [ ] Check backend logs for detailed error message

#### 2. Statistics Endpoint (GET /statistics/dashboard)
**Potential problems:**
- Statistics collection doesn't exist in MongoDB
- Aggregation pipeline error
- Database connection issue
- Missing data in statistics

**Fix checklist:**
- [ ] Verify database has statistics collection
- [ ] Check MongoDB connection is working
- [ ] Verify statistics data exists
- [ ] Check for aggregation pipeline errors in backend logs

### How to Debug

#### Step 1: Check Backend Logs

Look at your backend console output for detailed error messages:

```bash
# Backend terminal should show detailed error like:
[Error] ValidationError: ...
[Error] MongoError: ...
[Error] TypeError: Cannot read property '...'
```

#### Step 2: Test Backend Directly

Use curl to test endpoints and see actual error messages:

```bash
# Test creating course
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TEST101-001",
    "classCode": "TEST101",
    "subjectName": "Test Course",
    "instructor": "Dr. Test",
    "classroomId": "CS01",
    "startTime": 540,
    "endTime": 630,
    "dayOfWeek": "Monday"
  }'

# Test statistics
curl http://localhost:3000/statistics/dashboard
```

The response will have more details than what the frontend shows.

#### Step 3: Check Backend Database

```bash
# Connect to MongoDB
mongosh

# Check if classrooms exist
use greedy-scheduler
db.classrooms.find()

# Check statistics collection
db.statistics.find()
```

#### Step 4: Verify Backend Configuration

Check backend `.env` file:
```bash
MONGODB_URI=mongodb://localhost:27017/greedy-scheduler
NODE_ENV=development
PORT=3000
```

### Solution Steps

#### For Course Creation Error

1. **Ensure classroom exists first**
   ```
   - Go to frontend Classrooms page
   - Create a test classroom (e.g., "CS01")
   - Copy its exact ID
   ```

2. **Use correct classroom ID in course**
   ```
   - Go to Courses page
   - Create course
   - Use the EXACT classroom ID from step 1
   - Try again
   ```

3. **If still failing**, check backend logs:
   ```bash
   # In backend terminal, look for error messages
   # Common issues:
   # - ValidationError: ...is required
   # - CastError: Cast to ObjectId failed
   # - MongoError: ...
   ```

#### For Statistics Error

1. **Check if statistics collection exists**
   ```bash
   mongosh
   use greedy-scheduler
   db.statistics.findOne()
   ```

2. **If empty or doesn't exist**, run the algorithm first:
   ```
   - Go to Optimizer page
   - Select a classroom
   - Run optimizer
   - This should create statistics
   ```

3. **Check backend statistics service**
   ```bash
   # In backend, verify the statistics service exists
   # and MongoDB aggregation pipeline is correct
   ```

### Frontend Is Working Correctly

The frontend code is **100% correct** as evidenced by:

✅ Successful GET requests
✅ Successful POST /classrooms
✅ Proper error handling
✅ Correct API call structure
✅ Proper type definitions
✅ Zero TypeScript errors

The 500 errors are coming from the backend, not the frontend.

### Next Steps

1. **Check Backend Logs**: Look for detailed error messages
2. **Test with curl**: Get the actual error response
3. **Verify Database**: Ensure MongoDB is running and has data
4. **Verify Backend Code**: Check the course controller and statistics service

### Contact Backend Developer

When reporting this issue, provide:

```
1. Exact error message from backend logs
2. Request body that's failing
3. MongoDB connection status
4. Backend version
5. Node.js version
6. MongoDB version
```

## Common Backend Issues

### Issue: "ValidationError: ... is required"

**Cause**: Missing required field in request
**Solution**: Check all required fields are provided

### Issue: "CastError: Cast to ObjectId failed"

**Cause**: Invalid MongoDB ObjectId
**Solution**: Verify the ID format is correct

### Issue: "MongoError: connect ECONNREFUSED"

**Cause**: MongoDB not running
**Solution**: Start MongoDB service

### Issue: "TypeError: Cannot read property"

**Cause**: Missing data or null reference
**Solution**: Check if data exists in database

## Frontend Issue (If needed)

If the issue is actually in the frontend:

### Check 1: API URL
```bash
# Verify .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Check 2: API Client
```bash
# Verify lib/api.ts has correct endpoint
# Example: /statistics/dashboard not /statistics/stats
```

### Check 3: Type Definitions
```bash
# Run type check
npm run typecheck
```

## Support

For further assistance:

1. **Check backend logs** - Most important!
2. **Verify MongoDB** - Is it running?
3. **Test with curl** - Get actual error
4. **Review API documentation** - API.md
5. **Check example requests** - INTEGRATION_GUIDE.md

---

**Note**: The frontend is fully functional. The 500 errors indicate backend issues that need to be addressed in the backend code, not the frontend.
