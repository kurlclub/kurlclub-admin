import type { AppUser, UserRole } from '@/types/user';

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
};

export const normalizeRole = (role?: string | null): UserRole | null => {
  if (role === 'super_admin' || role === 'admin') return role;
  return null;
};

export const isRoleAllowed = (
  role: string | null | undefined,
  allowedRoles?: UserRole[] | null,
) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  const normalized = normalizeRole(role);
  if (!normalized) return false;
  return allowedRoles.includes(normalized);
};

type NavItemLike = {
  url: string;
  roles?: UserRole[];
};

type NavGroupLike = {
  label: string;
  items: NavItemLike[];
};

export const filterNavGroupsByRole = <T extends NavGroupLike>(
  groups: T[],
  role: string | null | undefined,
) =>
  groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => isRoleAllowed(role, item.roles)),
    }))
    .filter((group) => group.items.length > 0);

export const getRequiredRolesForPath = (
  pathname: string,
  groups: NavGroupLike[],
) => {
  let bestMatch: NavItemLike | null = null;
  for (const group of groups) {
    for (const item of group.items) {
      const isExact = pathname === item.url;
      const isNested =
        pathname.startsWith(item.url + '/') || pathname.startsWith(item.url);
      if (!isExact && !isNested) continue;
      if (!bestMatch || item.url.length > bestMatch.url.length) {
        bestMatch = item;
      }
    }
  }
  return bestMatch?.roles ?? null;
};

export const getUserRole = (user: AppUser | null) =>
  normalizeRole(user?.userRole ?? null);
