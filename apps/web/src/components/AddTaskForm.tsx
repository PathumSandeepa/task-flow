import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function AddTaskForm() {
  const [title, setTitle] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTask } = useTasks();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!title.trim()) {
      setLocalError('Task title cannot be empty');
      return;
    }
    
    setLocalError('');
    setIsSubmitting(true);
    
    const success = await addTask({ title: title.trim() });
    
    setIsSubmitting(false);
    if (success) {
      setTitle('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (localError) setLocalError('');
            }}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full h-11 text-base transition-colors focus-visible:ring-emerald-500",
              localError && "border-red-500 focus-visible:ring-red-500"
            )}
            disabled={isSubmitting}
          />
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="h-11 px-6 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm sm:w-auto w-full transition-all"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Add
        </Button>
      </form>
      {localError && (
        <p className="text-sm text-red-500 mt-2 font-medium animate-in fade-in slide-in-from-top-1">
          {localError}
        </p>
      )}
    </div>
  );
}
