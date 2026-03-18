export type TicketStatus =
  | 'Open'
  | 'In Progress'
  | 'Code Review'
  | 'Resolved'
  | 'Closed';

export type TicketPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type TicketCategory =
  | 'Technical'
  | 'Feature Request'
  | 'Bug Report'
  | 'Billing'
  | 'General';

export type SlaStatus = 'On Track' | 'At Risk' | 'Overdue';

export type MessageRole = 'Client' | 'Support' | 'Developer';

export interface Message {
  id: number;
  ticketId: number;
  author: string;
  role: MessageRole;
  message: string;
  timestamp: string;
  isEmailNotification?: boolean;
  emailSubject?: string;
  emailTo?: string;
}

export interface Attachment {
  id: number;
  ticketId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Ticket {
  id: number;
  ticketId: string;
  subject: string;
  description: string;
  client: string;
  clientEmail?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  slaStatus: SlaStatus;
  assignedTo: string | null;
  requiresDeveloper: boolean;
  assignedDev?: string | null;
  branch?: string | null;
  estimatedHours?: number | null;
  devNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  messages: Message[];
  attachments: Attachment[];
}
