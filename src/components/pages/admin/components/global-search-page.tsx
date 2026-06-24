'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Building2, Search, Users } from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';
import { resolveClientId } from '@/lib/client-utils';
import { useClients } from '@/services/clients';
import { useGyms } from '@/services/gyms';

const inputClass =
  'w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-700 px-3 py-2 pl-9 text-sm text-white outline-none focus:border-primary-green-500';

export function GlobalSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { data: clients } = useClients();
  const { data: gyms } = useGyms();

  const term = query.trim().toLowerCase();

  const clientResults = useMemo(() => {
    if (!term) return [];
    return (clients ?? [])
      .filter((c) =>
        `${c.userName} ${c.email}`.toLowerCase().includes(term),
      )
      .slice(0, 10);
  }, [clients, term]);

  const gymResults = useMemo(() => {
    if (!term) return [];
    return (gyms ?? [])
      .filter((g) => `${g.gymName} ${g.location}`.toLowerCase().includes(term))
      .slice(0, 10);
  }, [gyms, term]);

  const hasResults = clientResults.length > 0 || gymResults.length > 0;

  return (
    <StudioLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Global Search</h1>
          <p className="mt-1 text-sm text-secondary-blue-200">
            Search across clients and gyms
          </p>
        </div>

        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-blue-300" />
          <input
            className={inputClass}
            placeholder="Search clients, gyms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {!term ? (
          <p className="py-12 text-center text-sm text-secondary-blue-300">
            Start typing to search across clients and gyms.
          </p>
        ) : !hasResults ? (
          <p className="py-12 text-center text-sm text-secondary-blue-300">
            No matches for “{query}”.
          </p>
        ) : (
          <div className="space-y-6">
            {clientResults.length > 0 && (
              <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-4">
                <div className="mb-2 flex items-center gap-2 px-2">
                  <Users className="h-4 w-4 text-secondary-blue-300" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-secondary-blue-200">
                    Clients
                  </h2>
                </div>
                <ul className="divide-y divide-secondary-blue-400/60">
                  {clientResults.map((c) => {
                    const id = resolveClientId(c);
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => router.push(`/clients/${id}`)}
                          className="flex w-full flex-col items-start rounded-lg px-2 py-2 text-left hover:bg-secondary-blue-700"
                        >
                          <span className="text-sm text-white">
                            {c.userName}
                          </span>
                          <span className="text-xs text-secondary-blue-300">
                            {c.email}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {gymResults.length > 0 && (
              <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-4">
                <div className="mb-2 flex items-center gap-2 px-2">
                  <Building2 className="h-4 w-4 text-secondary-blue-300" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-secondary-blue-200">
                    Gyms
                  </h2>
                </div>
                <ul className="divide-y divide-secondary-blue-400/60">
                  {gymResults.map((g) => (
                    <li key={g.id}>
                      <button
                        type="button"
                        onClick={() => router.push(`/gyms/${g.id}`)}
                        className="flex w-full flex-col items-start rounded-lg px-2 py-2 text-left hover:bg-secondary-blue-700"
                      >
                        <span className="text-sm text-white">{g.gymName}</span>
                        <span className="text-xs text-secondary-blue-300">
                          {g.location}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
