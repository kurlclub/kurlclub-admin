import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import {
  forgotPassword,
  resetPassword,
  verifyResetOtp,
} from '@/services/auth/auth';

interface ApiError {
  message?: string;
  status?: string;
}

export const usePasswordReset = () => {
  const sendOtpMutation = useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message ||
        'Failed to send OTP. Please try again.';
      console.error('Send OTP error:', message);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyResetOtp(email, otp),
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message || 'Invalid OTP. Please try again.';
      console.error('Verify OTP error:', message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({
      email,
      otp,
      newPassword,
    }: {
      email: string;
      otp: string;
      newPassword: string;
    }) => resetPassword(email, otp, newPassword),
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message ||
        'Failed to reset password. Please try again.';
      console.error('Reset password error:', message);
    },
  });

  return {
    sendOtpMutation,
    verifyOtpMutation,
    resetPasswordMutation,
  };
};
