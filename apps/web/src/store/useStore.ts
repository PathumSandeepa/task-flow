import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Task, FilterStatus, SignupDto, AuthResponse } from '@task-flow/types';
import axios, { isAxiosError } from 'axios';

interface StoreState {
  token: string | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: FilterStatus;
}

interface StoreActions {
  login: (token: string) => void;
  signup: (dto: SignupDto) => Promise<void>;
  logout: () => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  updateTaskTitle: (id: number, title: string) => void;
  deleteTask: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (filter: FilterStatus) => void;
}

export const useStore = create<StoreState & StoreActions>()(
  persist(
    immer((set) => ({
      token: null,
      tasks: [],
      loading: false,
      error: null,
      filter: 'all',

      login: (token) => set({ token }),
      signup: async (dto: SignupDto) => {
        try {
          set({ loading: true, error: null });
          const { data } = await axios.post<AuthResponse>(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/signup`, 
            dto
          );
          set({ token: data.access_token });
        } catch (err: unknown) {
          if (isAxiosError(err) && err.response?.data?.message) {
            set({ error: err.response.data.message });
            return;
          }
          set({ error: 'Signup failed' });
        } finally {
          set({ loading: false });
        }
      },
      logout: () => set({ token: null, tasks: [], error: null, filter: 'all' }),
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) =>
        set((state) => {
          state.tasks.push(task);
        }),
      updateTask: (updatedTask) =>
        set((state) => {
          const index = state.tasks.findIndex((t) => t.id === updatedTask.id);
          if (index !== -1) {
            state.tasks[index] = updatedTask;
          }
        }),
      updateTaskTitle: (id, title) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (task) {
            task.title = title;
          }
        }),
      deleteTask: (id) =>
        set((state) => {
          state.tasks = state.tasks.filter((t) => t.id !== id);
        }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFilter: (filter) => set({ filter }),
    })),
    {
      name: 'tf-token',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
