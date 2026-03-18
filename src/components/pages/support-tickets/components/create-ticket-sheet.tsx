'use client';

import { type FormEvent, useState } from 'react';

import { Button, Input, Sheet, Textarea } from '@kurlclub/ui-components';

import {
  CATEGORY_OPTIONS,
  CLIENT_OPTIONS,
  PRIORITY_OPTIONS,
  SUPPORT_TEAM_MEMBERS,
} from '@/components/pages/support-tickets/data';
import type { TicketCategory, TicketPriority } from '@/types/ticket';

import { useSupportTickets } from '../support-tickets-provider';

interface CreateTicketSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateTicketFormState {
  subject: string;
  client: string;
  clientEmail: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  assignedTo: string;
}

const DEFAULT_FORM: CreateTicketFormState = {
  subject: '',
  client: '',
  clientEmail: '',
  category: 'General',
  priority: 'Medium',
  description: '',
  assignedTo: '',
};

export function CreateTicketSheet({ isOpen, onClose }: CreateTicketSheetProps) {
  const { createTicket } = useSupportTickets();
  const [form, setForm] = useState<CreateTicketFormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = <K extends keyof CreateTicketFormState>(
    key: K,
    value: CreateTicketFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleClientChange = (value: string) => {
    const selected = CLIENT_OPTIONS.find((client) => client.name === value);
    setForm((prev) => ({
      ...prev,
      client: value,
      clientEmail: selected?.email ?? '',
    }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.subject.trim()) nextErrors.subject = 'Subject is required';
    if (!form.client.trim()) nextErrors.client = 'Client is required';
    if (!form.description.trim())
      nextErrors.description = 'Description is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    createTicket({
      subject: form.subject,
      description: form.description,
      client: form.client,
      clientEmail: form.clientEmail,
      category: form.category,
      priority: form.priority,
      assignedTo: form.assignedTo || null,
    });
    onClose();
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Create Ticket"
      width="xl"
      footer={
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="create-ticket-form">
            Create Ticket
          </Button>
        </div>
      }
    >
      <form
        id="create-ticket-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Input
          label="Subject"
          value={form.subject}
          onChange={(event) => handleChange('subject', event.target.value)}
          placeholder="Brief ticket summary"
        />
        {errors.subject && (
          <p className="text-xs text-alert-red-400">{errors.subject}</p>
        )}

        <div>
          <label className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wider">
            Client
          </label>
          <select
            className="mt-2 h-11 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
            value={form.client}
            onChange={(event) => handleClientChange(event.target.value)}
          >
            <option value="" className="text-black">
              Select gym client
            </option>
            {CLIENT_OPTIONS.map((client) => (
              <option
                key={client.name}
                value={client.name}
                className="text-black"
              >
                {client.name}
              </option>
            ))}
          </select>
          {errors.client && (
            <p className="mt-1 text-xs text-alert-red-400">{errors.client}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wider">
              Category
            </label>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
              value={form.category}
              onChange={(event) =>
                handleChange('category', event.target.value as TicketCategory)
              }
            >
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category} className="text-black">
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wider">
              Priority
            </label>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
              value={form.priority}
              onChange={(event) =>
                handleChange('priority', event.target.value as TicketPriority)
              }
            >
              {PRIORITY_OPTIONS.map((priority) => (
                <option key={priority} value={priority} className="text-black">
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Textarea
          label="Description"
          value={form.description}
          onChange={(event) => handleChange('description', event.target.value)}
          placeholder="Detailed description..."
        />
        {errors.description && (
          <p className="text-xs text-alert-red-400">{errors.description}</p>
        )}

        <div>
          <label className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wider">
            Assigned To (optional)
          </label>
          <select
            className="mt-2 h-11 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
            value={form.assignedTo}
            onChange={(event) => handleChange('assignedTo', event.target.value)}
          >
            <option value="" className="text-black">
              Team member
            </option>
            {SUPPORT_TEAM_MEMBERS.map((member) => (
              <option key={member} value={member} className="text-black">
                {member}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-semantic-blue-500/30 bg-semantic-blue-500/10 px-4 py-3 text-sm text-semantic-blue-200">
          The ticket will be created as Open status. Technical tickets will be
          marked as requiring developer support.
        </div>
      </form>
    </Sheet>
  );
}
