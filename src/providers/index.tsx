'use client';

import { DialogProvider } from '@kurlclub/ui-components';
import { Toaster } from 'sonner';

import { ApiMetaProvider } from '@/providers/api-meta-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ApiMetaProvider>
        <AuthProvider>
          <DialogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster richColors position="top-right" />
              {children}
            </ThemeProvider>
          </DialogProvider>
        </AuthProvider>
      </ApiMetaProvider>
    </QueryProvider>
  );
}
