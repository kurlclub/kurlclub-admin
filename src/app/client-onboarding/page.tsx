import type { Metadata } from 'next';

import { OnboardingModule } from '@/components/pages/client-onboarding';

export const metadata: Metadata = {
  title: 'Client Onboarding - KurlClub Admin',
  description:
    'Manage client onboarding workflows in the KurlClub internal CRM.',
};

const ClientOnboardingPage = () => {
  return <OnboardingModule />;
};

export default ClientOnboardingPage;
