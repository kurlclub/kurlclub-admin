'use client';

import { useMemo, useState } from 'react';

import {
  Badge,
  Button,
  InfoBadge,
  Input,
  Sheet,
  Tabs,
  Textarea,
} from '@kurlclub/ui-components';
import {
  ChevronLeft,
  Code,
  Mail,
  MessageCircle,
  Send,
  UserPlus,
} from 'lucide-react';

import { MessageThread } from '@/components/pages/support-tickets/components/message-thread';
import {
  DEV_STATUS_OPTIONS,
  DEV_TEAM_MEMBERS,
  SUPPORT_STATUS_OPTIONS,
  SUPPORT_TEAM_MEMBERS,
} from '@/components/pages/support-tickets/data';
import {
  formatTicketDateTime,
  getPriorityBadgeClasses,
  getTicketStatusVariant,
} from '@/lib/utils/ticket.utils';
import { useAuth } from '@/providers/auth-provider';
import type { MessageRole, Ticket } from '@/types/ticket';

import { useSupportTickets } from '../support-tickets-provider';

type DetailTab = 'overview' | 'messages' | 'developer';

interface TicketDetailSheetProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEmail: (ticketId: number) => void;
  onOpenEscalate: (ticketId: number) => void;
  defaultTab?: DetailTab;
  senderRole?: MessageRole;
}

export function TicketDetailSheet({
  ticket,
  isOpen,
  onClose,
  onOpenEmail,
  onOpenEscalate,
  defaultTab = 'overview',
  senderRole = 'Support',
}: TicketDetailSheetProps) {
  const { user } = useAuth();
  const { updateStatus, assignTicket, addMessage, updateDeveloperFields } =
    useSupportTickets();

  const [activeTab, setActiveTab] = useState<DetailTab>(defaultTab);
  const [messageDraft, setMessageDraft] = useState('');

  const statusOptions = (() => {
    const base =
      defaultTab === 'developer' ? DEV_STATUS_OPTIONS : SUPPORT_STATUS_OPTIONS;
    const hasStatus = ticket
      ? base.some((status) => status === ticket.status)
      : true;
    if (ticket && !hasStatus) {
      return [...base, ticket.status];
    }
    return base;
  })();

  const devStatusOptions = (() => {
    const hasStatus = ticket
      ? DEV_STATUS_OPTIONS.some((status) => status === ticket.status)
      : true;
    if (ticket && !hasStatus) {
      return [...DEV_STATUS_OPTIONS, ticket.status];
    }
    return DEV_STATUS_OPTIONS;
  })();

  const createdBy = ticket?.messages[0]?.author ?? 'Client';
  const authorName =
    user?.userName ??
    (senderRole === 'Developer' ? 'Dev Team' : 'Support Team');

  const tabs = useMemo(
    () => [
      { id: 'overview', label: 'Overview' },
      { id: 'messages', label: 'Messages', icon: MessageCircle },
      { id: 'developer', label: 'Developer', icon: Code },
    ],
    [],
  );

  const handleSendMessage = () => {
    if (!ticket || !messageDraft.trim()) return;
    addMessage(ticket.id, {
      message: messageDraft,
      author: authorName,
      role: senderRole,
    });
    setMessageDraft('');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as DetailTab);
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={ticket?.ticketId ?? 'Ticket details'}
      width="xl"
    >
      {!ticket ? (
        <div className="text-center py-10 text-secondary-blue-300">
          Unable to load ticket details.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onClose}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {ticket.ticketId}
                </h2>
                <p className="text-sm text-secondary-blue-200">
                  {ticket.client} - Created{' '}
                  {formatTicketDateTime(ticket.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <InfoBadge
                variant={getTicketStatusVariant(ticket.status)}
                showIcon={false}
              >
                {ticket.status}
              </InfoBadge>
              <Badge
                variant="outline"
                className={`border text-[11px] uppercase tracking-wide ${getPriorityBadgeClasses(ticket.priority)} ${ticket.priority === 'Critical' ? 'animate-pulse' : ''}`}
              >
                {ticket.priority}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onOpenEmail(ticket.id)}
            >
              <Mail className="h-4 w-4" />
              Send Email Update
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onOpenEscalate(ticket.id)}
            >
              <UserPlus className="h-4 w-4" />
              Escalate to Developer
            </Button>
            {ticket.status !== 'Resolved' && (
              <Button
                size="sm"
                className="gap-2"
                onClick={() => updateStatus(ticket.id, 'Resolved')}
              >
                <Send className="h-4 w-4" />
                Mark as Resolved
              </Button>
            )}
          </div>

          <Tabs
            items={tabs}
            value={activeTab}
            onTabChange={handleTabChange}
            variant="underline"
          />

          {activeTab === 'overview' && (
            <div className="space-y-5">
              <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary-blue-200">
                  Ticket Overview
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-secondary-blue-300">Subject</p>
                    <p className="text-sm text-white">{ticket.subject}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-blue-300">Category</p>
                    <p className="text-sm text-white">{ticket.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-blue-300">Client</p>
                    <p className="text-sm text-white">{ticket.client}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-blue-300">
                      Created By
                    </p>
                    <p className="text-sm text-white">{createdBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-blue-300">Status</p>
                    <select
                      className="mt-1 h-10 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
                      value={ticket.status}
                      onChange={(event) =>
                        updateStatus(
                          ticket.id,
                          event.target.value as typeof ticket.status,
                        )
                      }
                    >
                      {statusOptions.map((status) => (
                        <option
                          key={status}
                          value={status}
                          className="text-black"
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-blue-300">
                      Assigned To
                    </p>
                    <select
                      className="mt-1 h-10 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
                      value={ticket.assignedTo ?? ''}
                      onChange={(event) =>
                        assignTicket(
                          ticket.id,
                          event.target.value ? event.target.value : null,
                        )
                      }
                    >
                      <option value="" className="text-black">
                        Unassigned
                      </option>
                      {SUPPORT_TEAM_MEMBERS.map((member) => (
                        <option
                          key={member}
                          value={member}
                          className="text-black"
                        >
                          {member}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-blue-300">
                      Created At
                    </p>
                    <p className="text-sm text-white">
                      {formatTicketDateTime(ticket.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-blue-300">
                      SLA Status
                    </p>
                    <p className="text-sm text-white">{ticket.slaStatus}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary-blue-200">
                  Description
                </h3>
                <p className="mt-3 text-sm text-white">{ticket.description}</p>
              </section>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-4">
              <MessageThread messages={ticket.messages} />
              <div className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-4">
                <textarea
                  className="min-h-[110px] w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 py-2 text-sm text-white outline-hidden focus:border-primary-green-500/60"
                  placeholder="Type your response..."
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                />
                <div className="mt-3 flex justify-end">
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'developer' && (
            <div className="space-y-5">
              {!ticket.requiresDeveloper ? (
                <div className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5 text-sm text-secondary-blue-200">
                  This ticket has not been escalated to the development team
                  yet.
                </div>
              ) : (
                <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary-blue-200">
                    Developer Details
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-secondary-blue-300">
                        Assigned Dev
                      </p>
                      <select
                        className="mt-1 h-10 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
                        value={ticket.assignedDev ?? ''}
                        onChange={(event) =>
                          updateDeveloperFields(ticket.id, {
                            assignedDev: event.target.value || null,
                          })
                        }
                      >
                        <option value="" className="text-black">
                          Unassigned
                        </option>
                        {DEV_TEAM_MEMBERS.map((member) => (
                          <option
                            key={member}
                            value={member}
                            className="text-black"
                          >
                            {member}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Git Branch"
                      value={ticket.branch ?? ''}
                      onChange={(event) =>
                        updateDeveloperFields(ticket.id, {
                          branch: event.target.value,
                        })
                      }
                      placeholder="feature/payment-fix"
                    />
                    <Input
                      label="Estimated Hours"
                      type="number"
                      value={ticket.estimatedHours ?? ''}
                      onChange={(event) =>
                        updateDeveloperFields(ticket.id, {
                          estimatedHours: event.target.value
                            ? Number(event.target.value)
                            : null,
                        })
                      }
                      placeholder="8"
                    />
                    <div>
                      <p className="text-xs text-secondary-blue-300">Status</p>
                      <select
                        className="mt-1 h-10 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
                        value={ticket.status}
                        onChange={(event) =>
                          updateStatus(
                            ticket.id,
                            event.target.value as typeof ticket.status,
                          )
                        }
                      >
                        {devStatusOptions.map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="text-black"
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Textarea
                    label="Developer Notes"
                    value={ticket.devNotes ?? ''}
                    onChange={(event) =>
                      updateDeveloperFields(ticket.id, {
                        devNotes: event.target.value,
                      })
                    }
                    placeholder="Add dev-specific notes..."
                  />
                </section>
              )}
            </div>
          )}
        </div>
      )}
    </Sheet>
  );
}
