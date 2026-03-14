'use client';

import { DialogProvider } from '@kurlclub/ui-components';
import { Toaster } from 'sonner';

import { ApiEnvironmentProvider } from '@/providers/api-environment-provider';
import { ApiMetaProvider } from '@/providers/api-meta-provider';
import { ApiRequestGuardProvider } from '@/providers/api-request-guard-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ApiEnvironmentProvider>
        <ApiMetaProvider>
          <AuthProvider>
            <DialogProvider>
              <ApiRequestGuardProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                >
                  <Toaster richColors position="top-right" />
                  {children}
                </ThemeProvider>
              </ApiRequestGuardProvider>
            </DialogProvider>
          </AuthProvider>
        </ApiMetaProvider>
      </ApiEnvironmentProvider>
    </QueryProvider>
  );
}
