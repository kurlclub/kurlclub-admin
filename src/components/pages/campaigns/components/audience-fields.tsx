'use client';

import { useState } from 'react';

import { resolveClientId } from '@/lib/client-utils';
import { useClients } from '@/services/clients';
import { useGyms } from '@/services/gyms';

const inputClass =
  'w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-700 px-3 py-2 text-sm text-white outline-none focus:border-primary-green-500';

type TargetType = 'all' | 'gyms' | 'clients';

/**
 * "Target Specific Gyms/Users" selector. Reuses the real gyms/clients lists for
 * the multi-select options. Self-contained (submit is stubbed in A3).
 */
export function AudienceFields() {
  const [target, setTarget] = useState<TargetType>('all');
  const { data: gyms } = useGyms();
  const { data: clients } = useClients();

  return (
    <div className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-secondary-blue-200">Target Audience</span>
        <select
          className={inputClass}
          value={target}
          onChange={(e) => setTarget(e.target.value as TargetType)}
        >
          <option value="all">All users</option>
          <option value="gyms">Specific gyms</option>
          <option value="clients">Specific clients</option>
        </select>
      </label>

      {target === 'gyms' && (
        <label className="block space-y-1.5">
          <span className="text-sm text-secondary-blue-200">
            Select gyms ({gyms?.length ?? 0})
          </span>
          <select multiple className={`${inputClass} h-32`}>
            {(gyms ?? []).map((g) => (
              <option key={g.id} value={g.id}>
                {g.gymName}
              </option>
            ))}
          </select>
        </label>
      )}

      {target === 'clients' && (
        <label className="block space-y-1.5">
          <span className="text-sm text-secondary-blue-200">
            Select clients ({clients?.length ?? 0})
          </span>
          <select multiple className={`${inputClass} h-32`}>
            {(clients ?? []).map((c) => {
              const id = resolveClientId(c);
              return (
                <option key={id} value={id}>
                  {c.userName}
                </option>
              );
            })}
          </select>
        </label>
      )}
    </div>
  );
}
