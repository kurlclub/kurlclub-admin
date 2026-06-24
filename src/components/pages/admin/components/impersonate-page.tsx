'use client';

import { useState } from 'react';

import { Button } from '@kurlclub/ui-components';
import { UserSquare } from 'lucide-react';
import { toast } from 'sonner';

import { RoleGuard } from '@/components/auth/role-guard';
import { StudioLayout } from '@/components/shared/layout';
import { resolveClientId } from '@/lib/client-utils';
import { useClients } from '@/services/clients';

const inputClass =
  'w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-700 px-3 py-2 text-sm text-white outline-none focus:border-primary-green-500';

export function ImpersonatePage() {
  const { data: clients } = useClients();
  const [target, setTarget] = useState('');

  return (
    <RoleGuard roles={['super_admin']}>
      <StudioLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Impersonate User</h1>
            <p className="mt-1 text-sm text-secondary-blue-200">
              Sign in as a client to troubleshoot their account (Super Admin
              only)
            </p>
          </div>

          <section className="max-w-xl rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm text-secondary-blue-200">
                  Select a client
                </span>
                <select
                  className={inputClass}
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                >
                  <option value="">Choose a client…</option>
                  {(clients ?? []).map((c) => {
                    const id = resolveClientId(c);
                    return (
                      <option key={id} value={id}>
                        {c.userName} — {c.email}
                      </option>
                    );
                  })}
                </select>
              </label>
              <Button
                className="gap-2"
                disabled={!target}
                onClick={() =>
                  toast.info('Will be enabled once the backend is connected')
                }
              >
                <UserSquare className="h-4 w-4" />
                Start Impersonation
              </Button>
            </div>
          </section>
        </div>
      </StudioLayout>
    </RoleGuard>
  );
}
