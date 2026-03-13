import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard overview',
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-5 md:p-8 bg-background-dark">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold text-white">
          Kurl Club Admin Dashboard
        </h1>
        <p className="text-lg text-primary-green-500">
          Welcome to the admin panel. Start building your features.
        </p>
      </main>
    </div>
  );
}
