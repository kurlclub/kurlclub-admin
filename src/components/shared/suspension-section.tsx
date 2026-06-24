'use client';

import { useState } from 'react';

import { Badge, Button, useAppDialog } from '@kurlclub/ui-components';
import { toast } from 'sonner';

const STUB = 'Will be enabled once the backend is connected';

interface SuspensionSectionProps {
  entityType: 'gym' | 'client';
  entityName: string;
}

/**
 * Status & Suspension panel for gym/client detail pages: suspend, reactivate,
 * and a Suspension History & Audit Logs list. UI shell — the suspended state is
 * local-only and actions are stubbed until the backend lands.
 */
export function SuspensionSection({
  entityType,
  entityName,
}: SuspensionSectionProps) {
  const { showConfirm } = useAppDialog();
  const [suspended, setSuspended] = useState(false);

  const handleSuspend = () =>
    showConfirm({
      title: `Suspend ${entityType}`,
      description: `Suspend ${entityName}? Access will be blocked until reactivated.`,
      variant: 'destructive',
      confirmLabel: 'Suspend',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        setSuspended(true);
        toast.info(STUB);
      },
    });

  const handleReactivate = () =>
    showConfirm({
      title: `Reactivate ${entityType}`,
      description: `Restore access for ${entityName}?`,
      confirmLabel: 'Reactivate',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        setSuspended(false);
        toast.info(STUB);
      },
    });

  return (
    <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
            Status &amp; Suspension
          </h2>
          <Badge variant="info">{suspended ? 'Suspended' : 'Active'}</Badge>
        </div>
        {suspended ? (
          <Button size="sm" onClick={handleReactivate}>
            Reactivate
          </Button>
        ) : (
          <Button size="sm" variant="destructive" onClick={handleSuspend}>
            Suspend
          </Button>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary-blue-300">
          Suspension History &amp; Audit Logs
        </h3>
        <p className="py-6 text-center text-sm text-secondary-blue-300">
          No suspension history yet.
        </p>
      </div>
    </section>
  );
}
