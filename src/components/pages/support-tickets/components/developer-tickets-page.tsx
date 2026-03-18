'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Button,
  DataTable,
  DataTableToolbar,
  InfoCard,
} from '@kurlclub/ui-components';
import { AlertTriangle, ChevronLeft, Code } from 'lucide-react';

import { EscalateTicketSheet } from '@/components/pages/support-tickets/components/escalate-ticket-sheet';
import { SendEmailSheet } from '@/components/pages/support-tickets/components/send-email-sheet';
import { TicketDetailSheet } from '@/components/pages/support-tickets/components/ticket-detail-sheet';
import {
  DEV_STATUS_OPTIONS,
  PRIORITY_OPTIONS,
} from '@/components/pages/support-tickets/data';
import { createDevTicketsColumns } from '@/components/pages/support-tickets/table/dev-tickets-columns';
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
      ticket.assignedDev,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
};

export function DeveloperTicketsPage() {
  const router = useRouter();
  const { tickets } = useSupportTickets();

  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [emailTicketId, setEmailTicketId] = useState<number | null>(null);
  const [escalateTicketId, setEscalateTicketId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const devTickets = useMemo(
    () => tickets.filter((ticket) => ticket.requiresDeveloper),
    [tickets],
  );

  const filteredTickets = useMemo(
    () => filterTickets(devTickets, searchTerm),
    [devTickets, searchTerm],
  );

  const selectedTicket = useMemo(
    () => devTickets.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [devTickets, selectedTicketId],
  );

  const emailTicket = useMemo(
    () => devTickets.find((ticket) => ticket.id === emailTicketId) ?? null,
    [devTickets, emailTicketId],
  );

  const escalateTicket = useMemo(
    () => devTickets.find((ticket) => ticket.id === escalateTicketId) ?? null,
    [devTickets, escalateTicketId],
  );

  const columns = useMemo(
    () => createDevTicketsColumns((id) => setSelectedTicketId(id)),
    [],
  );

  const stats = useMemo(() => {
    const total = devTickets.length;
    const open = devTickets.filter((ticket) => ticket.status === 'Open').length;
    const inProgress = devTickets.filter((ticket) =>
      ['In Progress', 'Code Review'].includes(ticket.status),
    ).length;
    const critical = devTickets.filter(
      (ticket) => ticket.priority === 'Critical',
    ).length;
    return { total, open, inProgress, critical };
  }, [devTickets]);

  return (
    <>
      <StudioLayout>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/support-tickets')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Developer Tickets
                </h1>
                <p className="text-sm text-secondary-blue-200 mt-1">
                  Code-level issues requiring development team attention
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              item={{
                id: 'total',
                icon: <Code className="h-5 w-5" />,
                color: 'semantic-blue-500',
                title: 'Total Dev Tickets',
                count: stats.total,
              }}
            />
            <InfoCard
              item={{
                id: 'open',
                icon: <AlertTriangle className="h-5 w-5" />,
                color: 'alert-red-400',
                title: 'Open Tickets',
                count: stats.open,
              }}
            />
            <InfoCard
              item={{
                id: 'in-progress',
                icon: <Code className="h-5 w-5" />,
                color: 'secondary-yellow-500',
                title: 'In Progress',
                count: stats.inProgress,
              }}
            />
            <InfoCard
              item={{
                id: 'critical',
                icon: <AlertTriangle className="h-5 w-5 animate-pulse" />,
                color: 'alert-red-500',
                title: 'Critical Issues',
                count: stats.critical,
              }}
            />
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
                    options: DEV_STATUS_OPTIONS.map((status) => ({
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
        defaultTab="developer"
        senderRole="Developer"
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
