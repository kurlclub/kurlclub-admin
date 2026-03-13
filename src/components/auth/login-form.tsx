'use client';

import { useTransition } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Password } from '@kurlclub/ui-components';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { AuthWrapper } from '@/components/auth/auth-wrapper';
import { useAuth } from '@/providers/auth-provider';
import { loginSchema } from '@/schemas';

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    startTransition(async () => {
      const result = await login(data.email, data.password);

      if (result.success) {
        toast.success('Login successful!');
        router.push('/');
      } else {
        toast.error(result.error || 'Login failed');
      }
    });
  };

  return (
    <AuthWrapper
      header={{
        title: 'Login',
        description: "Welcome back! Let's get started.",
      }}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-1">
            <Input
              id="email"
              label="Email address"
              placeholder=" "
              disabled={isPending}
              isLogin
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-alert-red-400 before:content-['*'] before:mr-px">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Password
              id="password"
              label="Password"
              placeholder=" "
              disabled={isPending}
              isLogin
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-alert-red-400 before:content-['*'] before:mr-px">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="link"
          asChild
          className="px-1 font-normal flex justify-start my-3"
        >
          <Link href="/auth/reset">Forgot password?</Link>
        </Button>
        <Button type="submit" disabled={isPending} className="px-3 py-4 h-11.5">
          {isPending ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </AuthWrapper>
  );
}
