'use client';

import { useTransition } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Form,
  KFormField,
  KFormFieldType,
} from '@kurlclub/ui-components';
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
        router.push('/dashboard');
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex flex-col gap-4 sm:gap-6">
            <KFormField
              fieldType={KFormFieldType.INPUT}
              control={form.control}
              disabled={isPending}
              name="email"
              label="Email address"
              isLogin
            />
            <KFormField
              fieldType={KFormFieldType.PASSWORD}
              control={form.control}
              disabled={isPending}
              name="password"
              label="Password"
              isLogin
            />
          </div>
          <Button
            size="sm"
            variant="link"
            asChild
            className="px-1 font-normal flex justify-start my-3"
          >
            <Link href="/auth/reset">Forgot password?</Link>
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="px-3 py-4 h-[46px]"
          >
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
}
