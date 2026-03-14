import { CreditCard, Home, Users } from 'lucide-react';

export const navGroups = [
  {
    label: 'GENERAL',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: Home,
      },
      {
        title: 'Client Onboarding',
        url: '/client-onboarding',
        icon: Users,
      },
    ],
  },
  {
    label: 'PRODUCT',
    items: [
      {
        title: 'Subscription Plans',
        url: '/subscription-plans',
        icon: CreditCard,
      },
    ],
  },
];
