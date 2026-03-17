import type { Metadata } from 'next';

import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to the KurlClub internal CRM',
};

export default function LoginPage() {
  return <LoginForm />;
}
