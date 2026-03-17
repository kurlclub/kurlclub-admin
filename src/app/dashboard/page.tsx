import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Internal CRM overview for the KurlClub team',
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-5 md:p-8 bg-background-dark">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold text-white">KurlClub Internal CRM</h1>
        <p className="text-lg text-primary-green-500">
          Manage client accounts, onboarding, and operations in one place.
        </p>
      </main>
    </div>
  );
}
