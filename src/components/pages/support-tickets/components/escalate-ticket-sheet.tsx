'use client';

import { type FormEvent, useState } from 'react';

import { Button, Input, Sheet, Textarea } from '@kurlclub/ui-components';

import {
  DEV_TEAM_MEMBERS,
  PRIORITY_OPTIONS,
} from '@/components/pages/support-tickets/data';
import type { Ticket, TicketPriority } from '@/types/ticket';

import { useSupportTickets } from '../support-tickets-provider';

interface EscalateTicketSheetProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

interface EscalateFormState {
  assignedDev: string;
  devNotes: string;
  estimatedHours: string;
  branch: string;
  priority: TicketPriority;
}

const DEFAULT_FORM: EscalateFormState = {
  assignedDev: '',
  devNotes: '',
  estimatedHours: '',
  branch: '',
  priority: 'Medium',
};

export function EscalateTicketSheet({
  ticket,
  isOpen,
  onClose,
}: EscalateTicketSheetProps) {
  const { escalateTicket } = useSupportTickets();
  const [form, setForm] = useState<EscalateFormState>(() => ({
    assignedDev: ticket?.assignedDev ?? '',
    devNotes: ticket?.devNotes ?? '',
    estimatedHours:
      typeof ticket?.estimatedHours === 'number'
        ? String(ticket?.estimatedHours)
        : '',
    branch: ticket?.branch ?? '',
    priority: ticket?.priority ?? DEFAULT_FORM.priority,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.assignedDev.trim()) {
      nextErrors.assignedDev = 'Developer is required';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ticket) return;
    if (!validate()) return;
    const estimatedHours = form.estimatedHours
      ? Number(form.estimatedHours)
      : null;

    escalateTicket(ticket.id, {
      assignedDev: form.assignedDev || null,
      devNotes: form.devNotes || null,
      branch: form.branch || null,
      estimatedHours: Number.isFinite(estimatedHours) ? estimatedHours : null,
      priority: form.priority,
    });

    onClose();
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Escalate to Developer"
      width="lg"
      footer={
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="escalate-ticket-form">
            Escalate
          </Button>
        </div>
      }
    >
      {!ticket ? (
        <div className="text-center py-10 text-secondary-blue-300">
          Select a ticket to escalate.
        </div>
      ) : (
        <form
          id="escalate-ticket-form"
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wider">
              Developer
            </label>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
              value={form.assignedDev}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  assignedDev: event.target.value,
                }))
              }
            >
              <option value="" className="text-black">
                Select developer
              </option>
              {DEV_TEAM_MEMBERS.map((member) => (
                <option key={member} value={member} className="text-black">
                  {member}
                </option>
              ))}
            </select>
            {errors.assignedDev && (
              <p className="mt-1 text-xs text-alert-red-400">
                {errors.assignedDev}
              </p>
            )}
          </div>

          <Textarea
            label="Dev Notes"
            value={form.devNotes}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, devNotes: event.target.value }))
            }
            placeholder="What the developer needs to know..."
          />

          <Input
            label="Estimated Hours"
            type="number"
            value={form.estimatedHours}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                estimatedHours: event.target.value,
              }))
            }
            placeholder="8"
          />

          <Input
            label="Git Branch"
            value={form.branch}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, branch: event.target.value }))
            }
            placeholder="feature/payment-fix"
          />

          <div>
            <label className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wider">
              Priority
            </label>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
              value={form.priority}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  priority: event.target.value as TicketPriority,
                }))
              }
            >
              {PRIORITY_OPTIONS.map((priority) => (
                <option key={priority} value={priority} className="text-black">
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </form>
      )}
    </Sheet>
  );
}
