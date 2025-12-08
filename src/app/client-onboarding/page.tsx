import type { Metadata } from 'next';

import ClientOnboardingMain from '@/components/pages/client-onboarding';

export const metadata: Metadata = {
  title: 'Client Onboarding - KurlClub Admin',
  description:
    'Manage client onboarding processes in the KurlClub Admin dashboard.',
};

const ClientOnboardingPage = () => {
  return <ClientOnboardingMain />;
};

export default ClientOnboardingPage;
