'use client';

import { ReactNode } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import {
  AppHeader,
  AppSidebar,
  TeamSwitcher,
  AppLayout as UIAppLayout,
} from '@kurlclub/ui-components';

import { AppHeaderContent } from '@/components/layout/app-header-content';
import { NavUser } from '@/components/layout/nav-user';
import { navGroups } from '@/constants/nav-items';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname?.startsWith('/auth');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <UIAppLayout
      sidebar={
        <AppSidebar
          navGroups={navGroups}
          currentPath={pathname}
          onNavigate={(url) => router.push(url)}
          header={
            <TeamSwitcher brandLogoVariant="admin" alt="KurlClub Admin Logo" />
          }
          footer={<NavUser />}
        />
      }
      header={
        <AppHeader>
          <AppHeaderContent />
        </AppHeader>
      }
    >
      {children}
    </UIAppLayout>
  );
}
