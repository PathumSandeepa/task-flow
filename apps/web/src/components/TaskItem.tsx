import React, { useState, useRef, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '@task-flow/types';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Check, Pencil, Trash2, X } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, editTask, deleteTask } = useTasks();
  const [isToggling, setIsToggling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = async () => {
    if (isToggling || isEditing) return;
    setIsToggling(true);
    await toggleTask(task.id);
    setIsToggling(false);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || editTitle.trim() === task.title) {
      setIsEditing(false);
      setEditTitle(task.title);
      return;
    }
    
    setIsSaving(true);
    await editTask(task.id, editTitle.trim());
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return void handleSaveEdit();
    }
    
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
    }
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteDialog(false);
    setIsDeleting(true);
    await deleteTask(task.id);
  };

  if (isDeleting) {
    return (
      <div className="flex items-center justify-center px-4 py-6 bg-white border border-red-100 rounded-lg animate-pulse">
        <Loader2 className="w-5 h-5 text-red-400 animate-spin mr-2" />
        <span className="text-sm font-medium text-red-500">Deleting...</span>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "group flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 bg-white border border-zinc-200 rounded-lg transition-all duration-200 hover:shadow-sm gap-3 sm:gap-4",
          task.completed && !isEditing && "opacity-80 bg-zinc-50 border-zinc-100",
          isToggling && "pointer-events-none opacity-60"
        )}
      >
        <div className="flex items-center gap-4 flex-1 overflow-hidden w-full">
          <button
            type="button"
            onClick={() => { void handleToggle(); }}
            disabled={isToggling || isEditing}
            className={cn(
              "flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
              task.completed
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-zinc-300 bg-white hover:border-zinc-400 text-transparent",
              isEditing && "opacity-50 cursor-not-allowed"
            )}
          >
            {isToggling ? (
              <Loader2 className="w-3 h-3 animate-spin text-current" />
            ) : (
              <Check className={cn("w-3.5 h-3.5 text-current")} strokeWidth={3} />
            )}
          </button>

          <div className="flex flex-col min-w-0 flex-1 w-full">
            {isEditing ? (
              <div className="flex items-center gap-2 w-full">
                <Input
                  ref={inputRef}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSaving}
                  className="h-8 py-1 px-2 text-sm focus-visible:ring-emerald-500"
                />
                <Button 
                  size="sm" 
                  onClick={() => { void handleSaveEdit(); }} 
                  disabled={isSaving}
                  className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditTitle(task.title);
                  }}
                  disabled={isSaving}
                  className="h-8 w-8 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <h3
                  className={cn(
                    "text-base font-medium truncate transition-colors duration-200",
                    task.completed ? "line-through text-zinc-400" : "text-zinc-800"
                  )}
                >
                  {task.title}
                </h3>
                <p className="text-xs text-zinc-400 truncate">
                  Added {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                </p>
              </>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0 sm:pl-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="sm:ml-4 ml-auto">
              {task.completed ? (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 font-medium">
                  Done
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200 font-medium">
                  Pending
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              "{task.title}" will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { void handleDeleteConfirm(); }} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
