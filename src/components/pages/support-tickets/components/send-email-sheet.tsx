'use client';

import { type FormEvent, useState } from 'react';

import { Button, Input, Sheet, Textarea } from '@kurlclub/ui-components';
import { toast } from 'sonner';

import type { Ticket } from '@/types/ticket';

import { useSupportTickets } from '../support-tickets-provider';

interface SendEmailSheetProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

interface EmailFormState {
  to: string;
  subject: string;
  message: string;
}

export function SendEmailSheet({
  ticket,
  isOpen,
  onClose,
}: SendEmailSheetProps) {
  const { sendEmail } = useSupportTickets();
  const [form, setForm] = useState<EmailFormState>(() => ({
    to: ticket?.clientEmail ?? '',
    subject: ticket ? `Re: ${ticket.subject}` : '',
    message: '',
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.to.trim()) nextErrors.to = 'Recipient is required';
    if (!form.subject.trim()) nextErrors.subject = 'Subject is required';
    if (!form.message.trim()) nextErrors.message = 'Message is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ticket) return;
    if (!validate()) return;
    sendEmail(ticket.id, {
      to: form.to,
      subject: form.subject,
      message: form.message,
    });
    toast.success(`Email sent to ${form.to}`);
    onClose();
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Send Email Update"
      width="lg"
      footer={
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="send-email-form">
            Send Email
          </Button>
        </div>
      }
    >
      {!ticket ? (
        <div className="text-center py-10 text-secondary-blue-300">
          Select a ticket to send an email update.
        </div>
      ) : (
        <form
          id="send-email-form"
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Input
            label="To"
            value={form.to}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, to: event.target.value }))
            }
            placeholder="client@example.com"
          />
          {errors.to && (
            <p className="text-xs text-alert-red-400">{errors.to}</p>
          )}

          <Input
            label="Subject"
            value={form.subject}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, subject: event.target.value }))
            }
          />
          {errors.subject && (
            <p className="text-xs text-alert-red-400">{errors.subject}</p>
          )}

          <Textarea
            label="Message"
            value={form.message}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, message: event.target.value }))
            }
            placeholder="Write your message here..."
          />
          {errors.message && (
            <p className="text-xs text-alert-red-400">{errors.message}</p>
          )}

          <div className="rounded-2xl border border-secondary-yellow-500/30 bg-secondary-yellow-500/10 px-4 py-3 text-sm text-secondary-yellow-200">
            This email will be sent to the client. In production, it would
            trigger SendGrid or AWS SES.
          </div>
        </form>
      )}
    </Sheet>
  );
}
