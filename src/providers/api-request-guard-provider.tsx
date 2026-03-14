'use client';

import { useEffect } from 'react';

import { useAppDialog } from '@kurlclub/ui-components';

import { setNonGetRequestGuard } from '@/lib/api';
import { isProductionEnvironment } from '@/lib/api-environment';

export function ApiRequestGuardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showConfirm } = useAppDialog();

  useEffect(() => {
    setNonGetRequestGuard(async ({ method, url, environment }) => {
      if (!isProductionEnvironment(environment)) {
        return true;
      }

      return new Promise<boolean>((resolve) => {
        showConfirm({
          title: 'Confirm Action',
          description: `You are about to ${method} ${url} in ${environment}. Proceed?`,
          variant: 'destructive',
          confirmLabel: 'Confirm',
          cancelLabel: 'Cancel',
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });
    });

    return () => setNonGetRequestGuard(null);
  }, [showConfirm]);

  return <>{children}</>;
}
