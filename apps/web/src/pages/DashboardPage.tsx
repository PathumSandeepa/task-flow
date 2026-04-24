import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { AddTaskForm } from '../components/AddTaskForm';
import { FilterBar } from '../components/FilterBar';
import { TaskList } from '../components/TaskList';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { CheckSquare, LogOut } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from '@task-flow/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

export function DashboardPage() {
  const { token, logout } = useAuth();
  const { tasks, fetchTasks, error } = useTasks();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  let username = 'User';
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded && decoded.username) {
        username = decoded.username;
      }
    } catch {
      // ignore empty block
    }
  }

  const handleLogoutConfirm = () => {
    setShowLogoutDialog(false);
    logout();
  };

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-zinc-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-900">
            <CheckSquare className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-extrabold tracking-tight">Task Flow</h1>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full focus-visible:ring-emerald-500">
                  <Avatar className="h-10 w-10 border border-zinc-200 hover:border-zinc-300 transition-colors">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-zinc-900">{username}</p>
                    <p className="text-xs leading-none text-zinc-500">Logged in via Task Flow</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer" onClick={() => setShowLogoutDialog(true)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <Card className="border-zinc-200 shadow-sm">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-zinc-900">{totalCount}</span>
              <span className="text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1">Total</span>
            </CardContent>
          </Card>
          <Card className="border-zinc-200 shadow-sm">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-emerald-600">{completedCount}</span>
              <span className="text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1">Completed</span>
            </CardContent>
          </Card>
          <Card className="border-zinc-200 shadow-sm">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-zinc-600">{pendingCount}</span>
              <span className="text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1">Pending</span>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col gap-4">
          <AddTaskForm />
          <FilterBar />
        </div>
        
        <TaskList />
      </main>

      <footer className="mt-auto border-t border-zinc-200 bg-white/50 py-6 text-center">
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-zinc-500 font-medium">© {new Date().getFullYear()} Task Flow. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-zinc-400">
            <span className="hover:text-zinc-600 cursor-pointer transition-colors">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-zinc-600 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access and manage your tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogoutConfirm} className="bg-red-600 text-white hover:bg-red-700">
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
