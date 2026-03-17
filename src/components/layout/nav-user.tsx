'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  getAvatarColor,
  getInitials,
  getProfilePictureSrc,
  useAppDialog,
  useSidebar,
} from '@kurlclub/ui-components';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/providers/auth-provider';

export function NavUser() {
  const { state } = useSidebar();
  const { showConfirm } = useAppDialog();
  const { user, logout } = useAuth();
  const router = useRouter();

  const userName = user?.userName || 'Team Member';
  const userEmail = user?.userEmail || 'team@kurlclub.com';
  const avatarStyle = getAvatarColor(userName);
  const profileSrc = getProfilePictureSrc(
    null,
    user?.photoPath?.trim() || null,
  );

  const handleLogout = () => {
    showConfirm({
      title: 'Confirm Logout',
      description: 'Are you sure you want to log out?',
      variant: 'destructive',
      confirmLabel: 'Logout',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        logout();
        toast.success('Logged out successfully!');
      },
    });
  };

  if (state === 'collapsed') {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="cursor-pointer hover:bg-primary-green-500/10 transition-all duration-300 group relative justify-center rounded-md border border-white/5 hover:border-primary-green-500/30"
          >
            <div className="relative">
              {profileSrc ? (
                <Image
                  src={profileSrc}
                  alt={userName}
                  width={36}
                  height={36}
                  sizes="36px"
                  className="h-9 w-9 rounded-md object-cover"
                />
              ) : (
                <div
                  className="h-9 w-9 rounded-md flex items-center justify-center font-bold text-sm"
                  style={avatarStyle}
                >
                  {getInitials(userName)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neutral-green-400 rounded-full border-2 border-secondary-blue-500 shadow-md" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-secondary-blue-200/10 via-secondary-blue-600/20 to-secondary-blue-600/5 border border-secondary-blue-200/20 backdrop-blur-sm shadow-md">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {profileSrc ? (
                  <Image
                    src={profileSrc}
                    alt={userName}
                    width={48}
                    height={48}
                    sizes="48px"
                    className="h-12 w-12 rounded-md object-cover"
                  />
                ) : (
                  <div
                    className="h-12 w-12 rounded-md flex items-center justify-center font-bold text-sm"
                    style={avatarStyle}
                  >
                    {getInitials(userName)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neutral-green-400 rounded-full border-2 border-secondary-blue-500 shadow-md" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate font-bold text-sm text-white mb-1">
                  {userName}
                </div>
                <div className="truncate text-xs text-primary-green-200 font-medium">
                  {userEmail}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => router.push('/profile')}
                className="flex-1 h-9 text-xs bg-white/5 border border-white/10 text-white hover:bg-primary-green-500 hover:border-primary-green-500 hover:text-black transition-all duration-200 rounded-md flex items-center justify-center"
              >
                <User className="h-3 w-3 mr-1" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 h-9 text-xs bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30 hover:text-red-100 transition-all duration-200 rounded-md flex items-center justify-center"
              >
                <LogOut className="h-3 w-3 mr-1" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="absolute inset-0 bg-linear-to-t from-primary-green-500/5 via-transparent to-primary-green-400/5 pointer-events-none opacity-50" />
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary-blue-200/50 to-transparent" />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
