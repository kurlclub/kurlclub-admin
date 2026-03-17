'use client';

import type { ReactNode } from 'react';

import { isRoleAllowed } from '@/lib/authz';
import { useAuth } from '@/providers/auth-provider';
import type { UserRole } from '@/types/user';

import { AccessDenied } from './access-denied';

interface RoleGuardProps {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ roles, children, fallback }: RoleGuardProps) {
  const { user, isReady } = useAuth();

  if (!isReady) return null;
  if (!isRoleAllowed(user?.userRole, roles)) {
    return <>{fallback ?? <AccessDenied />}</>;
  }

  return <>{children}</>;
}
