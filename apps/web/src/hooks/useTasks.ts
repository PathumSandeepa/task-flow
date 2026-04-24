import { useStore } from '../store/useStore';
import { api } from '../lib/api';
import { isAxiosError } from 'axios';
import type { Task, CreateTaskDto } from '@task-flow/types';
import { useCallback } from 'react';

export function useTasks() {
  const { tasks, loading, error, filter, setTasks, addTask, updateTask, updateTaskTitle, deleteTask: removeTask, setLoading, setError, setFilter } = useStore();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<Task[]>('/tasks');
      setTasks(data);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
        return;
      }
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setTasks]);

  const handleAddTask = async (dto: CreateTaskDto) => {
    try {
      const { data } = await api.post<Task>('/tasks', dto);
      addTask(data);
      return true;
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
        return false;
      }
      setError('Failed to add task');
      return false;
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const { data } = await api.patch<Task>(`/tasks/${id}/toggle`);
      updateTask(data);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
        return;
      }
      setError('Failed to toggle task');
    }
  };

  const editTask = async (id: number, title: string) => {
    try {
      await api.patch<Task>(`/tasks/${id}`, { title });
      updateTaskTitle(id, title);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
        return;
      }
      setError('Failed to edit task');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      removeTask(id);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
        return;
      }
      setError('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  return {
    tasks,
    filteredTasks,
    loading,
    error,
    filter,
    setFilter,
    fetchTasks,
    addTask: handleAddTask,
    toggleTask,
    editTask,
    deleteTask,
  };
}
