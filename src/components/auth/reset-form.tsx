'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@kurlclub/ui-components';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { AuthWrapper } from '@/components/auth/auth-wrapper';
import { usePasswordReset } from '@/hooks/use-password-reset';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from '@/schemas';

type EmailFormData = z.infer<typeof forgotPasswordSchema>;
type OtpFormData = z.infer<typeof verifyOtpSchema>;
type PasswordFormData = z.infer<typeof resetPasswordSchema>;

type Step = 'email' | 'otp' | 'password';

export function ResetForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [savedEmail, setSavedEmail] = useState('');
  const [savedOtp, setSavedOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: '' },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const { sendOtpMutation, verifyOtpMutation, resetPasswordMutation } =
    usePasswordReset();

  const onEmailSubmit = (data: EmailFormData) => {
    setSavedEmail(data.email);
    sendOtpMutation.mutate(data.email, {
      onSuccess: () => {
        toast.success('OTP sent to your email!');
        setStep('otp');
        setSecondsLeft(60);
      },
    });
  };

  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) return;

    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s === null) return null;
        if (s <= 1) {
          clearInterval(id);
          return null;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [secondsLeft]);

  const onOtpSubmit = (data: OtpFormData) => {
    if (!savedEmail) {
      toast.error('Email not found. Please start over.');
      setStep('email');
      return;
    }
    setSavedOtp(data.otp);
    verifyOtpMutation.mutate(
      { email: savedEmail, otp: data.otp },
      {
        onSuccess: () => {
          toast.success('OTP verified!');
          setStep('password');
        },
      },
    );
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    if (!savedEmail || !savedOtp) {
      toast.error('Session expired. Please start over.');
      setStep('email');
      return;
    }
    resetPasswordMutation.mutate(
      { email: savedEmail, otp: savedOtp, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success('Password reset successfully!');
          router.push('/auth/login');
        },
      },
    );
  };

  if (step === 'otp') {
    return (
      <AuthWrapper
        header={{
          title: 'Enter OTP',
          description: savedEmail
            ? `Enter the 6-digit code sent to ${savedEmail}`
            : 'Enter the 6-digit code sent to your work email',
        }}
      >
        <form
          onSubmit={otpForm.handleSubmit(onOtpSubmit)}
          className="flex flex-col"
        >
          <div className="flex flex-col gap-4">
            <div className="relative flex flex-col gap-1">
              <label htmlFor="otp" className="text-sm text-primary-blue-100">
                OTP Code
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                className="k-input bg-secondary-blue-500 h-[52px] px-4 text-center text-2xl tracking-widest"
                placeholder="000000"
                disabled={verifyOtpMutation.isPending}
                {...otpForm.register('otp')}
              />
              {otpForm.formState.errors.otp && (
                <p className="text-sm text-alert-red-400">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={verifyOtpMutation.isPending}
            className="px-3 py-4 h-[46px] mt-6"
          >
            {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify'}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Didn&apos;t receive the code?{' '}
            <Button
              type="button"
              variant="link"
              onClick={() => {
                if (savedEmail) {
                  sendOtpMutation.mutate(savedEmail, {
                    onSuccess: () => {
                      toast.success('OTP resent!');
                      setSecondsLeft(60);
                    },
                  });
                }
              }}
              disabled={
                sendOtpMutation.isPending ||
                (secondsLeft !== null && secondsLeft > 0)
              }
              className="p-0 h-auto font-normal text-primary-green-100 disabled:opacity-50"
            >
              {sendOtpMutation.isPending
                ? 'Sending...'
                : secondsLeft !== null && secondsLeft > 0
                  ? `Wait ${secondsLeft}s`
                  : 'Resend'}
            </Button>
          </p>
        </form>
      </AuthWrapper>
    );
  }

  if (step === 'password') {
    return (
      <AuthWrapper
        header={{
          title: 'Set New Password',
          description: 'Create a new password for your CRM access',
        }}
        footer={{
          linkUrl: '/auth/login',
          linkText: 'Back to Login',
        }}
      >
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="flex flex-col"
        >
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="relative flex flex-col gap-1">
              <label
                htmlFor="newPassword"
                className="text-sm text-primary-blue-100"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className="k-input bg-secondary-blue-500 h-[52px] px-4"
                placeholder=" "
                disabled={resetPasswordMutation.isPending}
                {...passwordForm.register('newPassword')}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-sm text-alert-red-400">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="relative flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-sm text-primary-blue-100"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="k-input bg-secondary-blue-500 h-[52px] px-4"
                placeholder=" "
                disabled={resetPasswordMutation.isPending}
                {...passwordForm.register('confirmPassword')}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-sm text-alert-red-400">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="px-3 py-4 h-[46px] mt-6"
          >
            {resetPasswordMutation.isPending
              ? 'Resetting...'
              : 'Reset Password'}
          </Button>
        </form>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper
      header={{
        title: 'Reset Password',
        description: 'Enter your work email to receive a reset code',
      }}
      footer={{
        linkUrl: '/auth/login',
        linkText: 'Back to Login',
      }}
    >
      <form
        onSubmit={emailForm.handleSubmit(onEmailSubmit)}
        className="flex flex-col"
      >
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="relative flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-primary-blue-100">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="k-input bg-secondary-blue-500 h-[52px] px-4"
              placeholder=" "
              disabled={sendOtpMutation.isPending}
              {...emailForm.register('email')}
            />
            {emailForm.formState.errors.email && (
              <p className="text-sm text-alert-red-400">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>
        </div>
        <Button
          type="submit"
          disabled={sendOtpMutation.isPending}
          className="px-3 py-4 h-[46px] mt-6"
        >
          {sendOtpMutation.isPending ? 'Sending...' : 'Send Reset OTP'}
        </Button>
      </form>
    </AuthWrapper>
  );
}
