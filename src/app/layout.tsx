import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { AppLayout } from '@/components/layout/app-layout';
import { AppProviders } from '@/providers';

import './globals.css';

const figtree = localFont({
  src: [{ path: './fonts/Figtree-VariableFont_wght.ttf', weight: '100 900' }],
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  title: 'Kurl Club Admin',
  description: 'Admin dashboard for Kurl Club',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${figtree.variable} bg-secondary-blue-500 antialiased`}>
        <AppProviders>
          <AppLayout>{children}</AppLayout>
        </AppProviders>
      </body>
    </html>
  );
}
