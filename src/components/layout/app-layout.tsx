'use client';

import { ReactNode } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import {
  AppHeader,
  AppSidebar,
  Spinner,
  TeamSwitcher,
  AppLayout as UIAppLayout,
} from '@kurlclub/ui-components';

import { AccessDenied } from '@/components/auth/access-denied';
import { AppHeaderContent } from '@/components/layout/app-header-content';
import { NavUser } from '@/components/layout/nav-user';
import { navGroups } from '@/constants/nav-items';
import {
  filterNavGroupsByRole,
  getRequiredRolesForPath,
  isRoleAllowed,
} from '@/lib/authz';
import { useAuth } from '@/providers/auth-provider';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isReady } = useAuth();

  const isAuthPage = pathname?.startsWith('/auth');

  if (isAuthPage) {
    return <>{children}</>;
  }

  const visibleNavGroups = filterNavGroupsByRole(navGroups, user?.userRole);
  const requiredRoles = getRequiredRolesForPath(pathname ?? '/', navGroups);
  const hasAccess = isRoleAllowed(user?.userRole, requiredRoles);
  const sidebarNavGroups = isReady ? visibleNavGroups : [];

  return (
    <UIAppLayout
      sidebar={
        <AppSidebar
          navGroups={sidebarNavGroups}
          currentPath={pathname}
          onNavigate={(url) => router.push(url)}
          header={
            <TeamSwitcher
              brandLogoVariant="admin"
              alt="KurlClub Admin Logo"
              collapsedLogo="/assets/png/logo-icon.png"
            />
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
      {!isReady ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : hasAccess ? (
        children
      ) : (
        <AccessDenied />
      )}
    </UIAppLayout>
  );
}
