import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Zap, Users, BookOpen, Calendar, Clock, Activity, AlertCircle, TrendingUp } from 'lucide-react';

export default async function DashboardPage() {
  let dashboardStats = null;
  let classrooms = [];
  let courses = [];
  let schedules = [];

  try {
    [dashboardStats, classrooms, courses, schedules] = await Promise.all([
      api.getDashboardStatistics(),
      api.getClassrooms(),
      api.getCourses(),
      api.getSchedules()
    ]);
  } catch (e) {
    // Backend might be down, fallback
    console.error('Failed to fetch dashboard data:', e);
  }

  // Parse execution statistics
  const parseExecutionTime = (timeStr: string) => {
    if (!timeStr) return 0;
    return parseFloat(timeStr.replace('ms', ''));
  };

  const avgExecTime = dashboardStats?.algorithm?.avgExecutionTime 
    ? parseExecutionTime(dashboardStats.algorithm.avgExecutionTime)
    : 0;

  const successRate = dashboardStats?.algorithm?.successRate
    ? parseFloat(dashboardStats.algorithm.successRate)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of the Greedy Scheduler system status and algorithm performance.
        </p>
      </div>

      {/* Database Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-200/50 dark:border-blue-900/50 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classrooms</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.database?.totalClassrooms || classrooms?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-200/50 dark:border-green-900/50 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.database?.totalCourses || courses?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-200/50 dark:border-purple-900/50 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schedules</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.database?.totalSchedules || schedules?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-200/50 dark:border-orange-900/50 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Algorithm Executions</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.algorithm?.totalExecutions || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Algorithm Performance Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-1 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Execution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgExecTime > 0 ? `${avgExecTime.toFixed(2)}ms` : '0ms'}</div>
          </CardContent>
        </Card>
        <Card className="col-span-1 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{successRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card className="col-span-1 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Schedules</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{dashboardStats?.scheduling?.successfulSchedules || 0}</div>
          </CardContent>
        </Card>
        <Card className="col-span-1 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{dashboardStats?.scheduling?.failedAttempts || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      {dashboardStats?.performance && (
        <div className="grid gap-4 md:grid-cols-1">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Classes Per Schedule</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.performance.averageClassesPerSchedule.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
