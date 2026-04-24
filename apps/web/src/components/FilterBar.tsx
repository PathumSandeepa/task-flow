import { useTasks } from '../hooks/useTasks';
import { Button } from './ui/button';
import type { FilterStatus } from '@task-flow/types';
import { cn } from '../lib/utils';

export function FilterBar() {
  const { tasks, filter, setFilter } = useTasks();

  const handleFilter = (newFilter: FilterStatus) => {
    setFilter(newFilter);
  };

  const allCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const incompleteCount = allCount - completedCount;

  return (
    <div className="flex flex-wrap gap-2 w-full">
      <Button
        variant={filter === 'all' ? 'default' : 'ghost'}
        onClick={() => handleFilter('all')}
        size="sm"
        className={cn(
          "flex items-center gap-2 rounded-full px-4 h-9",
          filter === 'all' ? "bg-zinc-900 text-white hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        )}
      >
        All
        <span className={cn(
          "inline-flex items-center justify-center text-xs font-semibold rounded-full min-w-5 h-5 px-1.5",
          filter === 'all' ? "bg-zinc-700 text-white" : "bg-zinc-200 text-zinc-700"
        )}>
          {allCount}
        </span>
      </Button>
      <Button
        variant={filter === 'completed' ? 'default' : 'ghost'}
        onClick={() => handleFilter('completed')}
        size="sm"
        className={cn(
          "flex items-center gap-2 rounded-full px-4 h-9",
          filter === 'completed' ? "bg-emerald-600 text-white hover:bg-emerald-700" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        )}
      >
        Completed
        <span className={cn(
          "inline-flex items-center justify-center text-xs font-semibold rounded-full min-w-5 h-5 px-1.5",
          filter === 'completed' ? "bg-emerald-700 text-white" : "bg-zinc-200 text-zinc-700"
        )}>
          {completedCount}
        </span>
      </Button>
      <Button
        variant={filter === 'incomplete' ? 'default' : 'ghost'}
        onClick={() => handleFilter('incomplete')}
        size="sm"
        className={cn(
          "flex items-center gap-2 rounded-full px-4 h-9",
          filter === 'incomplete' ? "bg-zinc-900 text-white hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        )}
      >
        Incomplete
        <span className={cn(
          "inline-flex items-center justify-center text-xs font-semibold rounded-full min-w-5 h-5 px-1.5",
          filter === 'incomplete' ? "bg-zinc-700 text-white" : "bg-zinc-200 text-zinc-700"
        )}>
          {incompleteCount}
        </span>
      </Button>
    </div>
  );
}
