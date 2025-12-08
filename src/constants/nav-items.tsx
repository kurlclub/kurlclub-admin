import type { NavItem } from '@kurlclub/ui-components';
import { Home, Users } from 'lucide-react';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'Client Onboarding',
    url: '/client-onboarding',
    icon: Users,
  },
];
