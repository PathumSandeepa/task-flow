import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useStore } from '../store/useStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { CircleCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

const loginSchema = z.object({
   username: z.string().min(1, 'Username is required'),
   password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
   const navigate = useNavigate();
   const { login, isAuthenticated, error } = useAuth();
   const { loading, setError } = useStore();
   const [showPassword, setShowPassword] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema as never),
      defaultValues: {
         username: '',
         password: '',
      }
   });

   useEffect(() => {
      if (isAuthenticated) {
         navigate('/', { replace: true });
      }
   }, [isAuthenticated, navigate]);

   const onSubmit = async (data: LoginFormValues) => {
      await login({ username: data.username, password: data.password });
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 px-4">

         <div className="flex flex-col items-center mb-8">
            <div className="bg-zinc-900 p-3 rounded-full mb-4">
               <CircleCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Task Flow</h1>
         </div>

         <Card className="w-full max-w-md border-zinc-200 shadow-sm">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl text-center font-bold tracking-tight text-zinc-900">Welcome back</CardTitle>
               <CardDescription className="text-center text-zinc-500">Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-sm font-medium leading-none text-zinc-700">Username</label>
                     <Input
                        type="text"
                        {...register('username')}
                        onChange={(e) => { register('username').onChange(e); setError(null); }}
                        className={cn(errors.username && 'border-red-500')}
                     />
                     {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium leading-none text-zinc-700">Password</label>
                     <div className="relative">
                        <Input
                           type={showPassword ? 'text' : 'password'}
                           {...register('password')}
                           onChange={(e) => { register('password').onChange(e); setError(null); }}
                           className={cn("pr-10", errors.password && 'border-red-500')}
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 focus:outline-none"
                        >
                           {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                     </div>
                     {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                     {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                     {loading ? 'Signing in...' : 'Sign in'}
                  </Button>

                  {error && (
                     <div className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-md border border-red-100">
                        {error}
                     </div>
                  )}
               </form>
            </CardContent>
            <CardFooter className="flex flex-col border-t border-zinc-100 mt-2 pt-6">

               <div className="relative w-full mb-6">
                  <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-zinc-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                     <span className="px-2 bg-white text-zinc-500">or</span>
                  </div>
               </div>

               <Button variant="outline" className="w-full" asChild>
                  <Link to="/signup">Create an account</Link>
               </Button>
            </CardFooter>
         </Card>
      </div>
   );
}
