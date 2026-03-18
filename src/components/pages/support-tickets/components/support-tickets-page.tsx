'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, DataTable, DataTableToolbar } from '@kurlclub/ui-components';
import { Code, Plus } from 'lucide-react';

import { CreateTicketSheet } from '@/components/pages/support-tickets/components/create-ticket-sheet';
import { EscalateTicketSheet } from '@/components/pages/support-tickets/components/escalate-ticket-sheet';
import { SendEmailSheet } from '@/components/pages/support-tickets/components/send-email-sheet';
import { TicketDetailSheet } from '@/components/pages/support-tickets/components/ticket-detail-sheet';
import {
  PRIORITY_OPTIONS,
  SUPPORT_STATUS_OPTIONS,
} from '@/components/pages/support-tickets/data';
import { createSupportTicketsColumns } from '@/components/pages/support-tickets/table/support-tickets-columns';
import { StudioLayout } from '@/components/shared/layout';
import type { Ticket } from '@/types/ticket';

import { useSupportTickets } from '../support-tickets-provider';

const filterTickets = (tickets: Ticket[], term: string) => {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return tickets;
  return tickets.filter((ticket) => {
    const haystack = [
      ticket.ticketId,
      ticket.subject,
      ticket.client,
      ticket.priority,
      ticket.status,
      ticket.assignedTo,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
};

export function SupportTicketsPage() {
  const router = useRouter();
  const { tickets } = useSupportTickets();

  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [emailTicketId, setEmailTicketId] = useState<number | null>(null);
  const [escalateTicketId, setEscalateTicketId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = useMemo(
    () => createSupportTicketsColumns((id) => setSelectedTicketId(id)),
    [],
  );

  const filteredTickets = useMemo(
    () => filterTickets(tickets, searchTerm),
    [tickets, searchTerm],
  );

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [tickets, selectedTicketId],
  );

  const emailTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === emailTicketId) ?? null,
    [tickets, emailTicketId],
  );

  const escalateTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === escalateTicketId) ?? null,
    [tickets, escalateTicketId],
  );

  return (
    <>
      <StudioLayout>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Support Ticketing
              </h1>
              <p className="text-sm text-secondary-blue-200 mt-1">
                Manage customer support tickets and escalations
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => router.push('/support-tickets/developer')}
              >
                <Code className="h-4 w-4" />
                View Dev Tickets
              </Button>
              <Button className="gap-2" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" />
                Create Ticket
              </Button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredTickets}
            toolbar={(table) => (
              <DataTableToolbar
                table={table}
                onSearch={setSearchTerm}
                searchPlaceholder="Search by ticket ID, subject, or client"
                filters={[
                  {
                    columnId: 'status',
                    title: 'Status',
                    options: SUPPORT_STATUS_OPTIONS.map((status) => ({
                      label: status,
                      value: status,
                    })),
                  },
                  {
                    columnId: 'priority',
                    title: 'Priority',
                    options: PRIORITY_OPTIONS.map((priority) => ({
                      label: priority,
                      value: priority,
                    })),
                  },
                ]}
              />
            )}
          />
        </div>
      </StudioLayout>

      <TicketDetailSheet
        key={selectedTicketId ?? 'ticket'}
        ticket={selectedTicket}
        isOpen={!!selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        onOpenEmail={(id) => setEmailTicketId(id)}
        onOpenEscalate={(id) => setEscalateTicketId(id)}
        senderRole="Support"
      />

      <CreateTicketSheet
        key={showCreate ? 'open' : 'closed'}
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />

      <SendEmailSheet
        key={emailTicketId ?? 'email'}
        ticket={emailTicket}
        isOpen={!!emailTicketId}
        onClose={() => setEmailTicketId(null)}
      />

      <EscalateTicketSheet
        key={escalateTicketId ?? 'escalate'}
        ticket={escalateTicket}
        isOpen={!!escalateTicketId}
        onClose={() => setEscalateTicketId(null)}
      />
    </>
  );
}
