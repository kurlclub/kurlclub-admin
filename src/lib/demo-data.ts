/**
 * Prototype demo data.
 *
 * Static, deterministic sample data used to bring the admin screens to life for
 * an end-to-end demo while the backend is being built. This is NOT a mock
 * engine — it's plain constants imported directly by the pages. Delete this file
 * (and its imports) once the real APIs are wired.
 */

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};
const daysFromNow = (n: number) => daysAgo(-n);

const inr = (n: number) => n;

// --- Revenue / growth -----------------------------------------------------

export const demoRevenueKpis = {
  mrr: '₹4.21L',
  arr: '₹50.6L',
  activeSubscriptions: 312,
  trialToPaid: '52.4%',
};

export const demoRevenueTrend = [
  28, 31, 30, 34, 37, 39, 41, 44, 46, 49, 51, 54,
]; // relative MRR (k) by month

export const demoPlanMix = [
  { plan: 'Starter', revenue: 92000, pct: 18 },
  { plan: 'Growth', revenue: 187000, pct: 37 },
  { plan: 'Pro', revenue: 156000, pct: 31 },
  { plan: 'Enterprise', revenue: 71000, pct: 14 },
];

export const demoTopGyms = [
  { name: 'Iron Pulse Fitness', value: 612 },
  { name: 'FlexZone Andheri', value: 548 },
  { name: 'Beast Mode Gym', value: 491 },
  { name: 'Titan Strength Club', value: 437 },
  { name: 'CoreFit Studio', value: 388 },
];

export const demoTopClients = [
  { name: 'Aarav Sharma', value: 18 },
  { name: 'Diya Patel', value: 14 },
  { name: 'Ishaan Nair', value: 11 },
  { name: 'Ananya Reddy', value: 9 },
  { name: 'Kabir Mehta', value: 7 },
];

export const demoAnalyticsKpis = {
  conversion: '6.8%',
  churn: '1.8%',
  trialToPaid: '52.4%',
};

export const demoConversionFunnel = [
  { stage: 'Visitors', value: 4820 },
  { stage: 'Sign-ups', value: 1560 },
  { stage: 'Trials', value: 980 },
  { stage: 'Activated', value: 690 },
  { stage: 'Paid', value: 362 },
];

export const demoChurnTrend = [2.4, 2.1, 2.6, 1.9, 2.2, 1.7, 2.0, 1.8];
export const demoTrialConversionTrend = [
  { month: 'Jan', trials: 64, converted: 33 },
  { month: 'Feb', trials: 71, converted: 38 },
  { month: 'Mar', trials: 80, converted: 41 },
  { month: 'Apr', trials: 76, converted: 45 },
  { month: 'May', trials: 88, converted: 52 },
  { month: 'Jun', trials: 95, converted: 58 },
];

// --- Subscriptions --------------------------------------------------------

export type DemoSubscription = {
  id: number;
  clientName: string;
  clientEmail: string;
  planName: string;
  status: string;
  amount: number;
  billingCycle: string;
  renewsOn: string | null;
};

export const demoSubscriptions: DemoSubscription[] = [
  { id: 1, clientName: 'Aarav Sharma', clientEmail: 'aarav.sharma@gmail.com', planName: 'Pro', status: 'Active', amount: inr(4999), billingCycle: 'Monthly', renewsOn: daysFromNow(18) },
  { id: 2, clientName: 'Diya Patel', clientEmail: 'diya.patel@outlook.com', planName: 'Growth', status: 'Trial', amount: inr(2499), billingCycle: 'Monthly', renewsOn: daysFromNow(6) },
  { id: 3, clientName: 'Ishaan Nair', clientEmail: 'ishaan.nair@gmail.com', planName: 'Pro', status: 'Active', amount: inr(4999), billingCycle: 'Yearly', renewsOn: daysFromNow(220) },
  { id: 4, clientName: 'Ananya Reddy', clientEmail: 'ananya.reddy@gmail.com', planName: 'Enterprise', status: 'Active', amount: inr(9999), billingCycle: 'Yearly', renewsOn: daysFromNow(140) },
  { id: 5, clientName: 'Kabir Mehta', clientEmail: 'kabir.mehta@gmail.com', planName: 'Starter', status: 'Past Due', amount: inr(999), billingCycle: 'Monthly', renewsOn: daysAgo(3) },
  { id: 6, clientName: 'Saanvi Iyer', clientEmail: 'saanvi.iyer@gmail.com', planName: 'Growth', status: 'Cancelled', amount: inr(2499), billingCycle: 'Monthly', renewsOn: null },
  { id: 7, clientName: 'Vivaan Khan', clientEmail: 'vivaan.khan@outlook.com', planName: 'Pro', status: 'Active', amount: inr(4999), billingCycle: 'Six Months', renewsOn: daysFromNow(74) },
  { id: 8, clientName: 'Myra Bose', clientEmail: 'myra.bose@gmail.com', planName: 'Starter', status: 'Expired', amount: inr(999), billingCycle: 'Monthly', renewsOn: daysAgo(12) },
];

export const demoSubscriptionDetail = {
  clientName: 'Aarav Sharma',
  clientEmail: 'aarav.sharma@gmail.com',
  plan: 'Pro',
  status: 'Active',
  billingCycle: 'Monthly',
  amount: '₹4,999',
  started: daysAgo(96),
  renewsOn: daysFromNow(18),
  trialEnds: '—',
  events: [
    { id: 1, action: 'Renewed subscription', detail: '₹4,999 · Pro', actor: 'system', at: daysAgo(18) },
    { id: 2, action: 'Plan upgraded', detail: 'Growth → Pro', actor: 'support@kurlclub.com', at: daysAgo(54) },
    { id: 3, action: 'Trial converted to paid', detail: 'Growth · Monthly', actor: 'system', at: daysAgo(82) },
    { id: 4, action: 'Subscription created', detail: 'Growth · Trial', actor: 'system', at: daysAgo(96) },
  ],
};

// --- Campaigns ------------------------------------------------------------

export type DemoCampaign = {
  id: number;
  name: string;
  channel: string;
  status: string;
  audience: string;
  sent: number;
  opened: number;
  scheduledFor: string | null;
};

export const demoCampaigns: DemoCampaign[] = [
  { id: 1, name: 'Summer Shred Challenge', channel: 'push', status: 'Sent', audience: 'All users', sent: 18420, opened: 9655, scheduledFor: daysAgo(4) },
  { id: 2, name: 'New Year, New You', channel: 'email', status: 'Sent', audience: 'All clients', sent: 312, opened: 188, scheduledFor: daysAgo(20) },
  { id: 3, name: 'Pro Plan Flash Sale', channel: 'whatsapp', status: 'Scheduled', audience: '4 gyms', sent: 0, opened: 0, scheduledFor: daysFromNow(2) },
  { id: 4, name: 'Refer a Friend Bonus', channel: 'in_app', status: 'Sending', audience: 'Active clients', sent: 6200, opened: 0, scheduledFor: null },
  { id: 5, name: 'Win-back: We Miss You', channel: 'email', status: 'Draft', audience: 'Churned', sent: 0, opened: 0, scheduledFor: null },
  { id: 6, name: 'Weekend Class Reminder', channel: 'push', status: 'Sent', audience: 'All users', sent: 14880, opened: 7210, scheduledFor: daysAgo(9) },
];

export const demoCampaignDetail = {
  name: 'Summer Shred Challenge',
  channel: 'Push',
  audience: 'All users',
  status: 'Sent',
  scheduledFor: daysAgo(4),
  sentAt: daysAgo(4),
  created: daysAgo(7),
  stats: { Sent: '18,420', Delivered: '18,002', Opened: '9,655', Clicked: '3,128', Failed: '418' },
  daily: [620, 940, 1180, 1020, 860, 720, 540], // opens by day
};

// --- Users ----------------------------------------------------------------

export type DemoUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLoginAt: string | null;
};

export const demoUsers: DemoUser[] = [
  { id: 1, name: 'Hafiz Naveed', email: 'support@kurlclub.com', role: 'super_admin', status: 'active', lastLoginAt: daysAgo(0) },
  { id: 2, name: 'Riya Kapoor', email: 'riya.kapoor@kurlclub.com', role: 'admin', status: 'active', lastLoginAt: daysAgo(1) },
  { id: 3, name: 'Arjun Menon', email: 'arjun.menon@kurlclub.com', role: 'admin', status: 'locked', lastLoginAt: daysAgo(9) },
  { id: 4, name: 'Sara Das', email: 'sara.das@kurlclub.com', role: 'admin', status: 'active', lastLoginAt: daysAgo(3) },
  { id: 5, name: 'Reyansh Rao', email: 'reyansh.rao@kurlclub.com', role: 'admin', status: 'disabled', lastLoginAt: daysAgo(42) },
];

// --- Audit logs -----------------------------------------------------------

export type DemoAudit = {
  id: number;
  createdAt: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
};

export const demoAuditLogs: DemoAudit[] = [
  { id: 1, createdAt: daysAgo(0), actor: 'support@kurlclub.com', action: 'Suspended gym', target: 'Beast Mode Gym', ip: '103.42.18.7' },
  { id: 2, createdAt: daysAgo(1), actor: 'riya.kapoor@kurlclub.com', action: 'Edited client', target: 'Aarav Sharma', ip: '49.36.220.14' },
  { id: 3, createdAt: daysAgo(2), actor: 'support@kurlclub.com', action: 'Changed plan', target: 'Diya Patel · Growth → Pro', ip: '103.42.18.7' },
  { id: 4, createdAt: daysAgo(3), actor: 'arjun.menon@kurlclub.com', action: 'Reactivated client', target: 'Kabir Mehta', ip: '157.49.88.2' },
  { id: 5, createdAt: daysAgo(5), actor: 'support@kurlclub.com', action: 'Forced password reset', target: 'sara.das@kurlclub.com', ip: '103.42.18.7' },
];

// --- Content --------------------------------------------------------------

export const demoBanners = [
  { id: 1, title: 'Summer Sale 30% Off', placement: 'Home hero', active: true, window: '01 Jun – 30 Jun' },
  { id: 2, title: 'Refer & Earn', placement: 'Dashboard', active: true, window: 'Always on' },
  { id: 3, title: 'New Pro Plan', placement: 'Login', active: false, window: '15 Jul – 15 Aug' },
];

export const demoCoupons = [
  { id: 1, code: 'SUMMER20', type: '20%', redeemed: 142, max: 500, validity: 'till 30 Jun', active: true },
  { id: 2, code: 'FLAT500', type: '₹500', redeemed: 88, max: 200, validity: 'till 15 Jul', active: true },
  { id: 3, code: 'WELCOME10', type: '10%', redeemed: 612, max: '∞', validity: 'Always', active: true },
  { id: 4, code: 'WINBACK', type: '25%', redeemed: 34, max: 100, validity: 'expired', active: false },
];

export const demoAnnouncements = [
  { id: 1, title: 'Scheduled maintenance on Sunday', audience: 'All users', status: 'Published', publishedAt: daysAgo(2) },
  { id: 2, title: 'New WhatsApp reminders are live', audience: 'Clients', status: 'Published', publishedAt: daysAgo(8) },
  { id: 3, title: 'Festive offer — coming soon', audience: 'Gyms', status: 'Draft', publishedAt: null },
];

// --- System health --------------------------------------------------------

export const demoHealthServices = [
  { key: 'api', name: 'API', status: 'Operational', tone: 'ok', lastSync: '20s ago', latency: '92 ms', uptime: '99.98%' },
  { key: 'web', name: 'Web Application', status: 'Operational', tone: 'ok', lastSync: '15s ago', latency: '140 ms', uptime: '99.95%' },
  { key: 'biometric', name: 'Biometric Devices', status: 'Operational', tone: 'ok', lastSync: '1m ago', latency: '210 ms', uptime: '99.70%' },
  { key: 'whatsapp', name: 'WhatsApp Service', status: 'Degraded', tone: 'warn', lastSync: '2m ago', latency: '480 ms', uptime: '98.40%' },
  { key: 'razorpay', name: 'Razorpay Integration', status: 'Operational', tone: 'ok', lastSync: '35s ago', latency: '160 ms', uptime: '99.90%' },
];

export const demoHealthAlerts = [
  { id: 1, service: 'WhatsApp', level: 'Critical', message: 'Delivery success rate dropped below 95%.', at: '4m ago' },
  { id: 2, service: 'WhatsApp', level: 'Warning', message: 'Average send latency above 400ms.', at: '22m ago' },
  { id: 3, service: 'Biometric', level: 'Warning', message: '3 devices missed their heartbeat window.', at: '1h ago' },
];

export const demoUptimeTrend = [99.9, 100, 99.8, 100, 99.6, 100, 99.9, 98.4, 99.9, 100, 99.95, 100];

// --- Logs -----------------------------------------------------------------

export type DemoLog = {
  id: number;
  time: string;
  actor: string;
  action: string;
  detail: string;
};

export const demoLogs: Record<string, DemoLog[]> = {
  admin: [
    { id: 1, time: daysAgo(0), actor: 'support@kurlclub.com', action: 'Suspended a gym', detail: 'Beast Mode Gym' },
    { id: 2, time: daysAgo(0), actor: 'riya.kapoor@kurlclub.com', action: 'Updated subscription plan', detail: 'Pro' },
    { id: 3, time: daysAgo(1), actor: 'support@kurlclub.com', action: 'Exported a report', detail: 'Subscriptions.csv' },
  ],
  user: [
    { id: 1, time: daysAgo(0), actor: 'Aarav Sharma', action: 'Upgraded subscription', detail: 'Growth → Pro' },
    { id: 2, time: daysAgo(0), actor: 'Diya Patel', action: 'Started a trial', detail: 'Growth' },
    { id: 3, time: daysAgo(1), actor: 'Ishaan Nair', action: 'Booked a class', detail: 'HIIT 6pm' },
  ],
  api: [
    { id: 1, time: daysAgo(0), actor: 'system', action: 'POST /api/v1/payments/webhook', detail: '200 · 84ms' },
    { id: 2, time: daysAgo(0), actor: 'system', action: 'GET /api/v1/clients', detail: '200 · 41ms' },
    { id: 3, time: daysAgo(0), actor: 'system', action: 'POST /api/v1/auth/login', detail: '401 · 22ms' },
  ],
  audit: [
    { id: 1, time: daysAgo(0), actor: 'support@kurlclub.com', action: 'Role changed', detail: 'support → admin' },
    { id: 2, time: daysAgo(2), actor: 'support@kurlclub.com', action: 'API key rotated', detail: 'prod' },
  ],
  login: [
    { id: 1, time: daysAgo(0), actor: 'support@kurlclub.com', action: 'Successful login', detail: '103.42.18.7' },
    { id: 2, time: daysAgo(0), actor: 'arjun.menon@kurlclub.com', action: 'Failed login attempt', detail: '157.49.88.2' },
  ],
  usage: [
    { id: 1, time: daysAgo(0), actor: 'platform', action: 'Active sessions', detail: '1,284' },
    { id: 2, time: daysAgo(0), actor: 'platform', action: 'API calls (24h)', detail: '482,910' },
  ],
};

export const demoPerfTrend = [120, 140, 110, 160, 130, 150, 125, 145, 135, 155, 128, 142];

// --- Backups --------------------------------------------------------------

export const demoBackups = [
  { id: 1, createdAt: daysAgo(0), size: '412 MB', type: 'Manual', status: 'Completed' },
  { id: 2, createdAt: daysAgo(1), size: '408 MB', type: 'Auto', status: 'Completed' },
  { id: 3, createdAt: daysAgo(2), size: '401 MB', type: 'Auto', status: 'Completed' },
  { id: 4, createdAt: daysAgo(3), size: '—', type: 'Auto', status: 'Failed' },
];
