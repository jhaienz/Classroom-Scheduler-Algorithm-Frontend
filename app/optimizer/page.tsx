import { api } from '@/lib/api';
import { Classroom } from '@/lib/types';
import { OptimizerView } from './optimizer-view';

export default async function OptimizerPage() {
  let classrooms: Classroom[] = [];
  try {
    classrooms = await api.getClassrooms();
  } catch (e) {
    // Handle error
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Optimizer</h1>
        <p className="text-muted-foreground mt-1">Run the Greedy Algorithm to maximize classroom utilization.</p>
      </div>

      <OptimizerView classrooms={classrooms} />
    </div>
  );
}
