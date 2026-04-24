import { useTasks } from '../hooks/useTasks';
import { TaskItem } from './TaskItem';
import { Loader2, ClipboardList } from 'lucide-react';
import { Button } from './ui/button';

export function TaskList() {
  const { tasks, filteredTasks, loading, setFilter } = useTasks();

  if (loading && tasks.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-16 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        <p className="text-zinc-500 font-medium">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-zinc-50 border border-dashed border-zinc-200 rounded-xl animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-zinc-100">
          <ClipboardList className="w-8 h-8 text-zinc-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-1">No tasks yet</h3>
        <p className="text-zinc-500 max-w-sm">Add your first task above to get started</p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-zinc-50 rounded-xl border border-zinc-100 animate-in fade-in duration-300">
        <p className="text-zinc-600 font-medium mb-4">No tasks match this filter</p>
        <Button variant="outline" size="sm" onClick={() => setFilter('all')}>
          View all tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {filteredTasks.map((task, index) => (
        <div 
          key={task.id} 
          className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
          style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
        >
          <TaskItem task={task} />
        </div>
      ))}
    </div>
  );
}
