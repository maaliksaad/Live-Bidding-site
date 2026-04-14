'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useLogin } from '@/hooks/useAuth';
import { loginSchema } from '@/lib/validationSchemas';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoginFormData {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync({
        identifier: data.identifier,
        password: data.password,
      });
    } catch (error: any) {
      // Error is already handled by the mutation with toast
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {loginMutation.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-1">
          <span className="w-1 h-1 rounded-full bg-red-700" />
          {loginMutation.error.response?.data?.message || loginMutation.error.message || 'Login failed'}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Your Email or Username*
        </label>
        <Input
          {...register('identifier')}
          type="text"
          className={`w-full py-6 ${errors.identifier ? 'border-red-500 ring-red-500' : ''}`}
          placeholder="Email or username"
        />
        {errors.identifier && (
          <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password*
        </label>
        <div className="relative">
          <Input
            {...register('password')}
            type={showPassword ? "text" : "password"}
            className={`w-full pr-10 py-6 ${errors.password ? 'border-red-500 ring-red-500' : ''}`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setValue('rememberMe', checked as boolean)}
          />
          <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
            Remember me
          </label>
        </div>
        <a
          href="/forgot-password"
          className="text-sm font-medium text-[#4A5FBF] hover:text-[#3A4FAF] transition-colors"
        >
          Forgot Password?
        </a>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#4A5FBF] hover:bg-[#3A4FAF] text-white py-6 text-lg font-semibold rounded-lg shadow-md transition-all active:scale-[0.98]"
        disabled={isSubmitting || loginMutation.isPending}
      >
        {isSubmitting || loginMutation.isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Logging in...
          </span>
        ) : "Log In"}
      </Button>

      {/* Demo Credentials Section */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-indigo-50 rounded-lg">
            <Eye className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-sm font-semibold text-gray-800">Demo Seller Accounts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {[
            { id: 1, email: 'seller1@example.com', label: 'John Seller', password: 'password123' },
            { id: 2, email: 'seller2@example.com', label: 'Jane Dealer', password: 'password123' },
            { id: 3, email: 'seller4@example.com', label: 'Alice Trader', password: 'Password123' }
          ].map((seller) => (
            <button
              key={seller.id}
              type="button"
              onClick={() => {
                setValue('identifier', seller.email, { shouldValidate: true });
                setValue('password', seller.password, { shouldValidate: true });
              }}
              className="flex items-center justify-between p-3.5 bg-gray-50/50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 rounded-xl transition-all group"
            >
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700 transition-colors">
                  {seller.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
          <p className="text-[11px] text-blue-600/80 leading-relaxed italic">
            * Password for all demo accounts is <span className="font-bold underline">password123</span>. These are pre-seeded accounts for testing purposes.
          </p>
        </div>
      </div>
    </form>
  );
}