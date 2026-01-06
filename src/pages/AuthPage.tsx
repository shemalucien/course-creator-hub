import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookOpen, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const handleToggleForm = () => {
    setIsLogin((v) => !v);
    setShowPassword(false);
    loginForm.reset();
    signupForm.reset();
  };

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.message === 'Invalid login credentials' 
          ? 'Invalid email or password. Please try again.'
          : error.message,
      });
    } else {
      toast({ title: 'Welcome back!' });
      navigate('/');
    }
  };

  const onSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setIsLoading(false);

    if (error) {
      let message = error.message;
      if (message.includes('already registered')) {
        message = 'This email is already registered. Please sign in instead.';
      }
      toast({
        variant: 'destructive',
        title: 'Signup failed',
        description: message,
      });
    } else {
      toast({ title: 'Account created!', description: 'Welcome to CoursePortal!' });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95">
        <div className="container flex h-14 items-center px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">
              Course<span className="text-primary">Portal</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Auth Form */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? 'Sign in to access your courses and track progress'
                  : 'Sign up to enroll in courses and start learning'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLogin ? (
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4" noValidate>
                  <div className="space-y-2 text-left">
                    <label htmlFor="login-email" className="text-sm font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        inputMode="email"
                        className="pl-10"
                        {...loginForm.register('email')}
                      />
                    </div>
                    {loginForm.formState.errors.email?.message ? (
                      <p className="text-sm font-medium text-destructive">
                        {loginForm.formState.errors.email.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2 text-left">
                    <label htmlFor="login-password" className="text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="pl-10 pr-10"
                        {...loginForm.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password?.message ? (
                      <p className="text-sm font-medium text-destructive">
                        {loginForm.formState.errors.password.message}
                      </p>
                    ) : null}
                  </div>

                  <Button type="submit" className="w-full bg-gradient-primary" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4" noValidate>
                  <div className="space-y-2 text-left">
                    <label htmlFor="signup-full-name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-full-name"
                        placeholder="John Doe"
                        autoComplete="name"
                        className="pl-10"
                        {...signupForm.register('fullName')}
                      />
                    </div>
                    {signupForm.formState.errors.fullName?.message ? (
                      <p className="text-sm font-medium text-destructive">
                        {signupForm.formState.errors.fullName.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2 text-left">
                    <label htmlFor="signup-email" className="text-sm font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        inputMode="email"
                        className="pl-10"
                        {...signupForm.register('email')}
                      />
                    </div>
                    {signupForm.formState.errors.email?.message ? (
                      <p className="text-sm font-medium text-destructive">
                        {signupForm.formState.errors.email.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2 text-left">
                    <label htmlFor="signup-password" className="text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="pl-10 pr-10"
                        {...signupForm.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {signupForm.formState.errors.password?.message ? (
                      <p className="text-sm font-medium text-destructive">
                        {signupForm.formState.errors.password.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2 text-left">
                    <label htmlFor="signup-confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="pl-10"
                        {...signupForm.register('confirmPassword')}
                      />
                    </div>
                    {signupForm.formState.errors.confirmPassword?.message ? (
                      <p className="text-sm font-medium text-destructive">
                        {signupForm.formState.errors.confirmPassword.message}
                      </p>
                    ) : null}
                  </div>

                  <Button type="submit" className="w-full bg-gradient-primary" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                </span>
                <button type="button" onClick={handleToggleForm} className="text-primary hover:underline font-medium">
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
