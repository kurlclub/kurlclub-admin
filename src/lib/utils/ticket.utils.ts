import type { SlaStatus, TicketPriority, TicketStatus } from '@/types/ticket';

export const getTicketStatusVariant = (
  status: TicketStatus,
): 'success' | 'warning' | 'error' | 'info' => {
  switch (status) {
    case 'Resolved':
      return 'success';
    case 'In Progress':
      return 'warning';
    case 'Code Review':
      return 'info';
    case 'Closed':
      return 'info';
    case 'Open':
    default:
      return 'error';
  }
};

export const getPriorityBadgeClasses = (priority: TicketPriority) => {
  switch (priority) {
    case 'Critical':
      return 'border-alert-red-400/60 bg-alert-red-500/15 text-alert-red-200';
    case 'High':
      return 'border-secondary-pink-400/60 bg-secondary-pink-500/15 text-secondary-pink-200';
    case 'Medium':
      return 'border-secondary-yellow-400/60 bg-secondary-yellow-500/15 text-secondary-yellow-200';
    case 'Low':
    default:
      return 'border-semantic-blue-400/60 bg-semantic-blue-500/15 text-semantic-blue-200';
  }
};

export const getPriorityAccentClasses = (priority: TicketPriority) => {
  switch (priority) {
    case 'Critical':
      return 'bg-alert-red-500';
    case 'High':
      return 'bg-secondary-pink-500';
    case 'Medium':
      return 'bg-secondary-yellow-500';
    case 'Low':
    default:
      return 'bg-semantic-blue-500';
  }
};

export const getSlaStatusClasses = (status: SlaStatus) => {
  switch (status) {
    case 'On Track':
      return 'text-primary-green-300 bg-primary-green-500/10 border-primary-green-500/30';
    case 'At Risk':
      return 'text-secondary-yellow-200 bg-secondary-yellow-500/10 border-secondary-yellow-500/30';
    case 'Overdue':
    default:
      return 'text-alert-red-300 bg-alert-red-500/10 border-alert-red-500/30';
  }
};

export const formatTicketDate = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

export const formatTicketDateTime = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};
