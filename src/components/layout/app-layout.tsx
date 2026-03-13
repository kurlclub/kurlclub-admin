'use client';

import { ReactNode } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import {
  AppHeader,
  AppSidebar,
  TeamSwitcher,
  AppLayout as UIAppLayout,
} from '@kurlclub/ui-components';

import { AuthWrapper } from '@/components/auth/auth-wrapper';
import { NavUser } from '@/components/layout/nav-user';
import { navItems } from '@/constants/nav-items';

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
    <AuthWrapper>
      <UIAppLayout
        sidebar={
          <AppSidebar
            navItems={navItems}
            currentPath={pathname}
            onNavigate={(url) => router.push(url)}
            header={
              <TeamSwitcher
                collapsedLogo="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%203-1bUu3foSGcahraLSyANoyl4dlcVN2Z.png"
                expandedLogo="/assets/svg/logo-light.svg"
                alt="Kurl Club"
              />
            }
            footer={<NavUser />}
          />
        }
        header={<AppHeader />}
      >
        {children}
      </UIAppLayout>
    </AuthWrapper>
  );
}
