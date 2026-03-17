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
  title: {
    template: '%s | KurlClub Admin',
    default: 'KurlClub Admin',
  },
  description: 'Internal CRM for the KurlClub team',
  applicationName: 'KurlClub Admin',
  appleWebApp: {
    title: 'KurlClub',
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: 'KurlClub Admin',
    description: 'Internal CRM for the KurlClub team',
    siteName: 'KurlClub Admin',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'KurlClub Admin',
    description: 'Internal CRM for the KurlClub team',
  },
  icons: {
    icon: ['/favicon.ico', '/icon.svg'],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${figtree.className} ${figtree.variable} bg-secondary-blue-500 antialiased`}
      >
        <AppProviders>
          <AppLayout>{children}</AppLayout>
        </AppProviders>
      </body>
    </html>
  );
}
