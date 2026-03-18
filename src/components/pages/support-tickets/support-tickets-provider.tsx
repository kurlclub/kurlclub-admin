'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { INITIAL_TICKETS } from '@/components/pages/support-tickets/data';
import type {
  Message,
  MessageRole,
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from '@/types/ticket';

interface CreateTicketInput {
  subject: string;
  description: string;
  client: string;
  clientEmail?: string;
  category: TicketCategory;
  priority: TicketPriority;
  assignedTo?: string | null;
}

interface SendEmailInput {
  to: string;
  subject: string;
  message: string;
}

interface EscalateInput {
  assignedDev: string | null;
  devNotes?: string | null;
  estimatedHours?: number | null;
  branch?: string | null;
  priority?: TicketPriority;
}

interface SupportTicketsContextValue {
  tickets: Ticket[];
  createTicket: (input: CreateTicketInput) => Ticket;
  updateStatus: (id: number, status: TicketStatus) => void;
  assignTicket: (id: number, assignedTo: string | null) => void;
  addMessage: (
    id: number,
    input: { message: string; author: string; role: MessageRole },
  ) => void;
  sendEmail: (id: number, input: SendEmailInput) => void;
  escalateTicket: (id: number, input: EscalateInput) => void;
  updateDeveloperFields: (
    id: number,
    updates: {
      assignedDev?: string | null;
      devNotes?: string | null;
      estimatedHours?: number | null;
      branch?: string | null;
    },
  ) => void;
}

const SupportTicketsContext = createContext<SupportTicketsContextValue | null>(
  null,
);

const getNextTicketNumber = (tickets: Ticket[]) => {
  const max = tickets.reduce((acc, ticket) => {
    const numeric = Number(ticket.ticketId.replace(/\D/g, ''));
    return Number.isFinite(numeric) ? Math.max(acc, numeric) : acc;
  }, 0);
  return max + 1;
};

const getNextMessageId = (ticket: Ticket) => {
  return (
    ticket.messages.reduce((acc, message) => Math.max(acc, message.id), 0) + 1
  );
};

const createTicketId = (ticketNumber: number) =>
  `TK${String(ticketNumber).padStart(3, '0')}`;

export function SupportTicketsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);

  const updateTicket = useCallback(
    (id: number, updater: (ticket: Ticket) => Ticket) => {
      setTickets((prev) =>
        prev.map((ticket) => (ticket.id === id ? updater(ticket) : ticket)),
      );
    },
    [],
  );

  const createTicket = useCallback(
    (input: CreateTicketInput) => {
      const now = new Date().toISOString();
      const nextId =
        tickets.reduce((acc, ticket) => Math.max(acc, ticket.id), 0) + 1;
      const nextTicketNumber = getNextTicketNumber(tickets);
      const requiresDeveloper = input.category === 'Technical';

      const newTicket: Ticket = {
        id: nextId,
        ticketId: createTicketId(nextTicketNumber),
        subject: input.subject.trim(),
        description: input.description.trim(),
        client: input.client,
        clientEmail: input.clientEmail,
        category: input.category,
        priority: input.priority,
        status: 'Open',
        slaStatus: 'On Track',
        assignedTo: input.assignedTo ?? null,
        requiresDeveloper,
        assignedDev: null,
        branch: null,
        estimatedHours: null,
        devNotes: null,
        createdAt: now,
        updatedAt: now,
        resolvedAt: null,
        messages: [
          {
            id: 1,
            ticketId: nextId,
            author: input.assignedTo ?? 'Support Team',
            role: 'Support',
            message: input.description.trim(),
            timestamp: now,
          },
        ],
        attachments: [],
      };

      setTickets((prev) => [newTicket, ...prev]);
      return newTicket;
    },
    [tickets],
  );

  const updateStatus = useCallback(
    (id: number, status: TicketStatus) => {
      updateTicket(id, (ticket) => {
        const resolvedAt =
          status === 'Resolved' || status === 'Closed'
            ? new Date().toISOString()
            : (ticket.resolvedAt ?? null);
        return {
          ...ticket,
          status,
          resolvedAt,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [updateTicket],
  );

  const assignTicket = useCallback(
    (id: number, assignedTo: string | null) => {
      updateTicket(id, (ticket) => ({
        ...ticket,
        assignedTo,
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateTicket],
  );

  const addMessage = useCallback(
    (
      id: number,
      input: { message: string; author: string; role: MessageRole },
    ) => {
      updateTicket(id, (ticket) => {
        const newMessage: Message = {
          id: getNextMessageId(ticket),
          ticketId: ticket.id,
          author: input.author,
          role: input.role,
          message: input.message.trim(),
          timestamp: new Date().toISOString(),
        };
        return {
          ...ticket,
          updatedAt: new Date().toISOString(),
          messages: [...ticket.messages, newMessage],
        };
      });
    },
    [updateTicket],
  );

  const sendEmail = useCallback(
    (id: number, input: SendEmailInput) => {
      updateTicket(id, (ticket) => {
        const newMessage: Message = {
          id: getNextMessageId(ticket),
          ticketId: ticket.id,
          author: 'Email Notification',
          role: 'Support',
          message: input.message.trim(),
          timestamp: new Date().toISOString(),
          isEmailNotification: true,
          emailSubject: input.subject.trim(),
          emailTo: input.to.trim(),
        };
        return {
          ...ticket,
          updatedAt: new Date().toISOString(),
          messages: [...ticket.messages, newMessage],
        };
      });
    },
    [updateTicket],
  );

  const escalateTicket = useCallback(
    (id: number, input: EscalateInput) => {
      updateTicket(id, (ticket) => ({
        ...ticket,
        requiresDeveloper: true,
        assignedDev: input.assignedDev ?? ticket.assignedDev ?? null,
        devNotes: input.devNotes ?? ticket.devNotes ?? null,
        estimatedHours: input.estimatedHours ?? ticket.estimatedHours ?? null,
        branch: input.branch ?? ticket.branch ?? null,
        priority: input.priority ?? ticket.priority,
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateTicket],
  );

  const updateDeveloperFields = useCallback(
    (
      id: number,
      updates: {
        assignedDev?: string | null;
        devNotes?: string | null;
        estimatedHours?: number | null;
        branch?: string | null;
      },
    ) => {
      updateTicket(id, (ticket) => ({
        ...ticket,
        ...updates,
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateTicket],
  );

  const value = useMemo(
    () => ({
      tickets,
      createTicket,
      updateStatus,
      assignTicket,
      addMessage,
      sendEmail,
      escalateTicket,
      updateDeveloperFields,
    }),
    [
      tickets,
      createTicket,
      updateStatus,
      assignTicket,
      addMessage,
      sendEmail,
      escalateTicket,
      updateDeveloperFields,
    ],
  );

  return (
    <SupportTicketsContext.Provider value={value}>
      {children}
    </SupportTicketsContext.Provider>
  );
}

export const useSupportTickets = () => {
  const context = useContext(SupportTicketsContext);
  if (!context) {
    throw new Error(
      'useSupportTickets must be used within SupportTicketsProvider',
    );
  }
  return context;
};
