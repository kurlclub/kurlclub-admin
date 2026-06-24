import {
  Activity,
  Bell,
  Building2,
  CreditCard,
  Home,
  Image as ImageIcon,
  LifeBuoy,
  Mail,
  Megaphone,
  MessageCircle,
  Newspaper,
  RefreshCw,
  ScrollText,
  Sparkles,
  TicketPercent,
  TrendingUp,
  UserCog,
  UserRound,
  Users,
} from 'lucide-react';

import type { UserRole } from '@/types/user';

type NavItem = {
  title: string;
  url: string;
  icon: typeof Home;
  roles?: UserRole[];
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
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
        title: 'Subscriptions',
        url: '/subscriptions',
        icon: RefreshCw,
      },
      {
        title: 'Subscription Plans',
        url: '/subscription-plans',
        icon: CreditCard,
      },
    ],
  },
  {
    label: 'GROWTH',
    items: [
      {
        title: 'Analytics',
        url: '/analytics',
        icon: TrendingUp,
      },
    ],
  },
  {
    label: 'ENGAGEMENT',
    items: [
      {
        title: 'Push Notifications',
        url: '/notifications',
        icon: Bell,
      },
      {
        title: 'Campaigns',
        url: '/campaigns',
        icon: Megaphone,
      },
    ],
  },
  {
    label: 'ACCESS',
    items: [
      {
        title: 'Users',
        url: '/users',
        icon: UserCog,
        roles: ['admin', 'super_admin'],
      },
    ],
  },
  {
    label: 'MONITORING',
    items: [
      {
        title: 'System Health',
        url: '/health',
        icon: Activity,
      },
      {
        title: 'Audit Logs',
        url: '/audit',
        icon: ScrollText,
      },
    ],
  },
  {
    label: 'SUPPORT',
    items: [
      {
        title: 'Support Tickets',
        url: '/support-tickets',
        icon: LifeBuoy,
        roles: ['admin', 'super_admin'],
      },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      {
        title: 'Blogs',
        url: '/social/blogs',
        icon: Newspaper,
      },
      {
        title: 'Feature',
        url: '/social/features',
        icon: Megaphone,
      },
      {
        title: 'Banners',
        url: '/content/banners',
        icon: ImageIcon,
      },
      {
        title: 'Offers & Coupons',
        url: '/content/coupons',
        icon: TicketPercent,
      },
      {
        title: 'Announcements',
        url: '/announcements',
        icon: Sparkles,
      },
      {
        title: 'Email Campaigns',
        url: '/content/email-campaigns',
        icon: Mail,
      },
      {
        title: 'WhatsApp Campaigns',
        url: '/content/whatsapp-campaigns',
        icon: MessageCircle,
      },
    ],
  },
];
