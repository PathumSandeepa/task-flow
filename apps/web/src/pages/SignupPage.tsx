import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useStore } from '../store/useStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

const signupSchema = z.object({
   username: z.string().min(3, 'Username must be at least 3 characters'),
   password: z.string().min(6, 'Password must be at least 6 characters'),
   confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
   message: "Passwords don't match",
   path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupPage() {
   const navigate = useNavigate();
   const { signup, isAuthenticated, error } = useAuth();
   const { loading, setError } = useStore();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<SignupFormValues>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
         username: '',
         password: '',
         confirmPassword: '',
      }
   });

   useEffect(() => {
      if (isAuthenticated) {
         navigate('/', { replace: true });
      }
   }, [isAuthenticated, navigate]);

   const onSubmit = async (data: SignupFormValues) => {
      await signup({ username: data.username, password: data.password });
   };

   return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 px-4">
         <Card className="w-full max-w-md border-zinc-200 shadow-sm">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl text-center font-bold tracking-tight text-zinc-900">Create Account</CardTitle>
               <CardDescription className="text-center text-zinc-500">Sign up to start managing your tasks</CardDescription>
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
                     <Input
                        type="password"
                        {...register('password')}
                        onChange={(e) => { register('password').onChange(e); setError(null); }}
                        className={cn(errors.password && 'border-red-500')}
                     />
                     {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium leading-none text-zinc-700">Confirm Password</label>
                     <Input
                        type="password"
                        {...register('confirmPassword')}
                        onChange={(e) => { register('confirmPassword').onChange(e); setError(null); }}
                        className={cn(errors.confirmPassword && 'border-red-500')}
                     />
                     {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                  </div>

                  {error && <div className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-md border border-red-100">{error}</div>}

                  <Button type="submit" className="w-full" disabled={loading}>
                     {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                     {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
               </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-zinc-100 mt-2 pt-6">
               <p className="text-sm text-center text-zinc-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-zinc-900 hover:underline font-medium">
                     Sign in
                  </Link>
               </p>
            </CardFooter>
         </Card>
      </div>
   );
}
