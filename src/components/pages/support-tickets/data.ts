import type { Ticket } from '@/types/ticket';

export const SUPPORT_TEAM_MEMBERS = [
  'Sarah Lee',
  'Tom Wilson',
  'Aisha Khan',
  'Daniel Perez',
];

export const DEV_TEAM_MEMBERS = [
  'Mike Chen',
  'Sarah Chen',
  'Priya Patel',
  'Luis Ramirez',
];

export const CLIENT_OPTIONS = [
  {
    name: 'Elite Fitness NY',
    email: 'ops@elitefitnessny.com',
  },
  {
    name: 'Urban Gym LA',
    email: 'support@urbangymla.com',
  },
  {
    name: 'Summit Athletics',
    email: 'hello@summitathletics.com',
  },
  {
    name: 'Pulse Studio SF',
    email: 'team@pulsestudiosf.com',
  },
  {
    name: 'Northside Fitness',
    email: 'admin@northsidefitness.com',
  },
];

export const CATEGORY_OPTIONS = [
  'Technical',
  'Feature Request',
  'Bug Report',
  'Billing',
  'General',
] as const;

export const PRIORITY_OPTIONS = ['Critical', 'High', 'Medium', 'Low'] as const;

export const SUPPORT_STATUS_OPTIONS = [
  'Open',
  'In Progress',
  'Resolved',
  'Closed',
] as const;

export const DEV_STATUS_OPTIONS = [
  'Open',
  'In Progress',
  'Code Review',
  'Resolved',
] as const;

export const SLA_OPTIONS = ['On Track', 'At Risk', 'Overdue'] as const;

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 1,
    ticketId: 'TK001',
    subject: 'Payment gateway failing for subscriptions',
    description:
      'Customers are unable to complete subscription payments. Error shows \"PG_AUTH token expired.\"',
    client: 'Elite Fitness NY',
    clientEmail: 'ops@elitefitnessny.com',
    category: 'Technical',
    priority: 'Critical',
    status: 'In Progress',
    slaStatus: 'At Risk',
    assignedTo: 'Sarah Lee',
    requiresDeveloper: true,
    assignedDev: 'Mike Chen',
    branch: 'hotfix/payment-gateway-auth',
    estimatedHours: 2,
    devNotes: 'Investigate token expiry handling in PG_AUTH middleware.',
    createdAt: '2026-03-17T04:30:00.000Z',
    updatedAt: '2026-03-17T05:10:00.000Z',
    resolvedAt: null,
    messages: [
      {
        id: 1,
        ticketId: 1,
        author: 'Elite Fitness NY',
        role: 'Client',
        message:
          'Payment gateway failing for subscriptions. Customers see a token expired error.',
        timestamp: '2026-03-17T04:30:00.000Z',
      },
      {
        id: 2,
        ticketId: 1,
        author: 'Sarah Lee',
        role: 'Support',
        message: 'Investigating now, looping in the payments team.',
        timestamp: '2026-03-17T04:35:00.000Z',
      },
    ],
    attachments: [],
  },
  {
    id: 2,
    ticketId: 'TK002',
    subject: 'Request custom branding for client portal',
    description:
      'Urban Gym LA would like custom branding options (logo + colors) in the member portal.',
    client: 'Urban Gym LA',
    clientEmail: 'support@urbangymla.com',
    category: 'Feature Request',
    priority: 'Medium',
    status: 'Open',
    slaStatus: 'On Track',
    assignedTo: 'Tom Wilson',
    requiresDeveloper: true,
    assignedDev: 'Sarah Chen',
    branch: 'feature/custom-branding',
    estimatedHours: 8,
    devNotes: 'Plan UI for logo upload + color picker in settings.',
    createdAt: '2026-03-16T09:20:00.000Z',
    updatedAt: '2026-03-16T09:40:00.000Z',
    resolvedAt: null,
    messages: [
      {
        id: 1,
        ticketId: 2,
        author: 'Urban Gym LA',
        role: 'Client',
        message:
          'Can we customize our portal branding with logo + colors? We want it to match our studio.',
        timestamp: '2026-03-16T09:20:00.000Z',
      },
      {
        id: 2,
        ticketId: 2,
        author: 'Tom Wilson',
        role: 'Support',
        message:
          'Thanks! I am escalating this to our product team to scope the work.',
        timestamp: '2026-03-16T09:35:00.000Z',
      },
    ],
    attachments: [],
  },
  {
    id: 3,
    ticketId: 'TK003',
    subject: 'Invoice not generated for March billing',
    description:
      'Client did not receive March invoice after monthly billing cycle.',
    client: 'Summit Athletics',
    clientEmail: 'hello@summitathletics.com',
    category: 'Billing',
    priority: 'High',
    status: 'Open',
    slaStatus: 'Overdue',
    assignedTo: 'Aisha Khan',
    requiresDeveloper: false,
    assignedDev: null,
    branch: null,
    estimatedHours: null,
    devNotes: null,
    createdAt: '2026-03-15T13:05:00.000Z',
    updatedAt: '2026-03-16T08:00:00.000Z',
    resolvedAt: null,
    messages: [
      {
        id: 1,
        ticketId: 3,
        author: 'Summit Athletics',
        role: 'Client',
        message:
          'We have not received the March invoice yet. Can you please check?',
        timestamp: '2026-03-15T13:05:00.000Z',
      },
    ],
    attachments: [],
  },
  {
    id: 4,
    ticketId: 'TK004',
    subject: 'App crash when exporting members list',
    description: 'Exporting members list crashes the admin app on iPad Safari.',
    client: 'Pulse Studio SF',
    clientEmail: 'team@pulsestudiosf.com',
    category: 'Bug Report',
    priority: 'Low',
    status: 'Resolved',
    slaStatus: 'On Track',
    assignedTo: 'Daniel Perez',
    requiresDeveloper: false,
    assignedDev: null,
    branch: null,
    estimatedHours: null,
    devNotes: null,
    createdAt: '2026-03-12T18:40:00.000Z',
    updatedAt: '2026-03-14T12:15:00.000Z',
    resolvedAt: '2026-03-14T12:15:00.000Z',
    messages: [
      {
        id: 1,
        ticketId: 4,
        author: 'Pulse Studio SF',
        role: 'Client',
        message:
          'Exporting members list crashes the app on Safari iPad. Happens every time.',
        timestamp: '2026-03-12T18:40:00.000Z',
      },
      {
        id: 2,
        ticketId: 4,
        author: 'Daniel Perez',
        role: 'Support',
        message:
          'We deployed a fix for Safari export. Please retry and confirm it works now.',
        timestamp: '2026-03-14T11:50:00.000Z',
      },
    ],
    attachments: [],
  },
];
