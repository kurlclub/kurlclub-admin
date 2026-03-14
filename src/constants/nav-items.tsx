import { Building2, CreditCard, Home, UserRound, Users } from 'lucide-react';

export const navGroups = [
  {
    label: 'GENERAL',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: Home,
      },
    ],
  },
  {
    label: 'CLIENT MANAGEMENT',
    items: [
      {
        title: 'Client Onboarding',
        url: '/client-onboarding',
        icon: Users,
      },
      {
        title: 'Clients',
        url: '/clients',
        icon: Users,
      },
      {
        title: 'Gyms',
        url: '/gyms',
        icon: Building2,
      },
      {
        title: 'Members',
        url: '/members',
        icon: UserRound,
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
