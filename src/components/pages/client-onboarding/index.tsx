'use client';

import { useState } from 'react';

import { Button, InfoBadge, InfoCard } from '@kurlclub/ui-components';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Clock,
  CreditCard,
  Dumbbell,
  ExternalLink,
  KeyRound,
  Mail,
  MapPin,
  Play,
  Plus,
  ShieldCheck,
  Users,
} from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';

import { OnboardingWizard } from './components';
import { KanbanBoard } from './components/kanban-board';
import { OnboardingProvider } from './contexts';
import type { OnboardingClient } from './types';

/* ── Shared helpers ──────────────────────────────────── */

function getStatusVariant(
  status: string,
): 'success' | 'warning' | 'info' | 'error' {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'Pending Activation':
      return 'warning';
    case 'In Progress':
      return 'info';
    default:
      return 'error';
  }
}

/* ── Sample data ─────────────────────────────────────── */

const MOCK_CLIENTS: OnboardingClient[] = [
  {
    id: 1,
    name: 'CrossFit Elite',
    owner: 'Marcus Thompson',
    email: 'marcus@crossfitelite.com',
    phone: '+1-555-0101',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    status: 'In Progress',
    step: 3,
    totalSteps: 5,
    createdAt: '2024-01-15',
    subscriptionTier: 'Professional',
    subGyms: 2,
    contactNumber: '+1-555-0101',
    username: 'crossfit_elite',
    tempPassword: 'TempPass123!@#',
  },
  {
    id: 2,
    name: 'Yoga Studios Co',
    owner: 'Priya Sharma',
    email: 'priya@yogastudios.com',
    phone: '+1-555-0102',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    status: 'Pending Activation',
    step: 4,
    totalSteps: 5,
    createdAt: '2024-01-14',
    subscriptionTier: 'Starter',
    subGyms: 1,
    contactNumber: '+1-555-0102',
  },
  {
    id: 3,
    name: 'PowerGym Network',
    owner: 'James Wilson',
    email: 'james@powergym.com',
    phone: '+1-555-0103',
    address: '789 Pine Rd',
    city: 'Chicago',
    state: 'IL',
    status: 'Completed',
    step: 5,
    totalSteps: 5,
    createdAt: '2024-01-10',
    subscriptionTier: 'Enterprise',
    subGyms: 5,
    contactNumber: '+1-555-0103',
  },
  {
    id: 4,
    name: 'Iron Will Fitness',
    owner: 'Sarah Chen',
    email: 'sarah@ironwill.com',
    phone: '+1-555-0104',
    address: '100 Fitness Ave',
    city: 'Austin',
    state: 'TX',
    status: 'In Progress',
    step: 1,
    totalSteps: 5,
    createdAt: '2024-01-20',
    subscriptionTier: 'Starter',
    subGyms: 0,
    contactNumber: '+1-555-0104',
  },
  {
    id: 5,
    name: 'FlexZone Gyms',
    owner: 'David Okonkwo',
    email: 'david@flexzone.com',
    phone: '+1-555-0105',
    address: '22 Liberty Blvd',
    city: 'Houston',
    state: 'TX',
    status: 'Pending Activation',
    step: 4,
    totalSteps: 5,
    createdAt: '2024-01-22',
    subscriptionTier: 'Professional',
    subGyms: 3,
    contactNumber: '+1-555-0105',
  },
  {
    id: 6,
    name: 'Peak Performance',
    owner: 'Aisha Rahman',
    email: 'aisha@peakperf.com',
    phone: '+1-555-0106',
    address: '8 Summit Way',
    city: 'Seattle',
    state: 'WA',
    status: 'Completed',
    step: 5,
    totalSteps: 5,
    createdAt: '2024-01-08',
    subscriptionTier: 'Enterprise',
    subGyms: 8,
    contactNumber: '+1-555-0106',
  },
];

/* ── Root Module ─────────────────────────────────────── */

export function OnboardingModule() {
  const [selectedClient, setSelectedClient] = useState<OnboardingClient | null>(
    null,
  );
  const [wizardOpen, setWizardOpen] = useState(false);
  const [resumeClient, setResumeClient] = useState<OnboardingClient | null>(
    null,
  );

  const openNewWizard = () => {
    setResumeClient(null);
    setWizardOpen(true);
  };
  const openResumeWizard = (c: OnboardingClient) => {
    setResumeClient(c);
    setWizardOpen(true);
  };
  const closeWizard = () => {
    setWizardOpen(false);
    setResumeClient(null);
  };

  const totalInProgress = MOCK_CLIENTS.filter(
    (c) => c.status === 'In Progress',
  ).length;
  const totalPending = MOCK_CLIENTS.filter(
    (c) => c.status === 'Pending Activation',
  ).length;
  const totalCompleted = MOCK_CLIENTS.filter(
    (c) => c.status === 'Completed',
  ).length;
  const completionRate = Math.round(
    (totalCompleted / MOCK_CLIENTS.length) * 100,
  );

  return (
    <>
      <StudioLayout>
        {selectedClient ? (
          <OnboardingDetailPage
            client={selectedClient}
            onBack={() => setSelectedClient(null)}
            onResume={openResumeWizard}
          />
        ) : (
          <>
            {/* ── KPIs ──────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <InfoCard
                item={{
                  id: '1',
                  icon: <Clock className="w-5 h-5" />,
                  color: 'semantic-blue-500',
                  title: 'In Progress',
                  count: totalInProgress,
                }}
              />
              <InfoCard
                item={{
                  id: '2',
                  icon: <ShieldCheck className="w-5 h-5" />,
                  color: 'secondary-pink-500',
                  title: 'Pending Activation',
                  count: totalPending,
                }}
              />
              <InfoCard
                item={{
                  id: '3',
                  icon: <Users className="w-5 h-5" />,
                  color: 'primary-green-500',
                  title: 'Total Clients',
                  count: MOCK_CLIENTS.length,
                }}
              />
              <InfoCard
                item={{
                  id: '4',
                  icon: <CheckCircle className="w-5 h-5" />,
                  color: 'alert-red-400',
                  title: 'Completion Rate',
                  count: `${completionRate}%`,
                }}
              />
            </div>

            {/* ── Board header ──────────────────────────── */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Onboarding Board
                </h2>
                <p className="text-sm text-secondary-blue-200 mt-0.5">
                  Drag cards between columns to update status
                </p>
              </div>
              <Button onClick={openNewWizard} className="gap-2">
                <Plus className="w-4 h-4" />
                Add new client
              </Button>
            </div>

            {/* ── Kanban board ──────────────────────────── */}
            <KanbanBoard
              clients={MOCK_CLIENTS}
              onSelectClient={setSelectedClient}
              onResumeClient={openResumeWizard}
              getStatusVariant={getStatusVariant}
            />
          </>
        )}
      </StudioLayout>

      {/* ── Wizard Modal ──────────────────────────── */}
      <AnimatePresence>
        {wizardOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
              onClick={closeWizard}
            />

            {/* Modal panel */}
            <motion.div
              key="wizard-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative w-[95vw] h-[90vh] max-w-7xl bg-primary-blue-500 rounded-3xl overflow-hidden shadow-2xl border border-secondary-blue-400 pointer-events-auto flex flex-col"
            >
              <OnboardingProvider initialClient={resumeClient}>
                <OnboardingWizard
                  onClose={closeWizard}
                  initialClient={resumeClient}
                />
              </OnboardingProvider>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Onboarding Detail Page ────────────────────────────── */

const STEP_LABELS = [
  'Client Info',
  'Account Setup',
  'Subscription',
  'Gym Locations',
  'Review',
];

const TIER_STYLES: Record<
  string,
  { badge: string; max: string; color: string }
> = {
  Starter: {
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    max: '1 location',
    color: 'blue',
  },
  Professional: {
    badge:
      'bg-primary-green-500/10 text-primary-green-400 border-primary-green-500/30',
    max: '5 locations',
    color: 'green',
  },
  Enterprise: {
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    max: 'Unlimited',
    color: 'purple',
  },
};

function OnboardingDetailPage({
  client,
  onBack,
  onResume,
}: {
  client: OnboardingClient;
  onBack: () => void;
  onResume: (c: OnboardingClient) => void;
}) {
  const pct = Math.round((client.step / client.totalSteps) * 100);
  const isCompleted = client.status === 'Completed';
  const tierStyle = TIER_STYLES[client.subscriptionTier] ?? TIER_STYLES.Starter;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="pb-10"
    >
      {/* ── Top Header Section ──────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-secondary-blue-600 border border-secondary-blue-400 text-secondary-blue-200 hover:text-white hover:border-white/20 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {client.name}
              </h1>
              <InfoBadge variant={getStatusVariant(client.status)}>
                {client.status}
              </InfoBadge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-secondary-blue-200 text-sm">
                Created{' '}
                {new Date(client.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span className="text-secondary-blue-400">·</span>
              <span className="text-secondary-blue-200 text-sm italic">
                {client.owner}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isCompleted ? (
            <Button
              onClick={() => onResume(client)}
              className="gap-2 h-11 px-6 shadow-xl shadow-primary-green-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              Resume Onboarding
            </Button>
          ) : (
            <Button
              variant="outline"
              className="gap-2 h-11 px-6 border-white/10 hover:bg-white/5"
            >
              <ExternalLink className="w-4 h-4" />
              Open Portal
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left Column: Main Progress & Details ────────── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Progress Card */}
          <div className="bg-secondary-blue-600 rounded-3xl p-8 border border-secondary-blue-400 relative overflow-hidden shadow-2xl shadow-black/20">
            <div
              className={`absolute top-0 right-0 w-64 h-64 bg-${tierStyle.color}-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2`}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Current Milestones
                  </h3>
                  <p className="text-sm text-secondary-blue-200 mt-1">
                    Step {client.step} of {client.totalSteps} —{' '}
                    {STEP_LABELS[client.step - 1]}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-white">{pct}%</span>
                  <p className="text-[10px] uppercase tracking-wider text-secondary-blue-300 font-bold mt-1">
                    Completed
                  </p>
                </div>
              </div>

              {/* Progress Track */}
              <div className="relative h-4 bg-secondary-blue-400/30 rounded-full overflow-hidden p-1 mb-10 shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary-green-500 via-primary-green-400 to-emerald-400 relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.2,
                  }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-px bg-white/40 shadow-[0_0_8px_white]" />
                </motion.div>
              </div>

              {/* Step Sequence */}
              <div className="grid grid-cols-5 gap-4">
                {STEP_LABELS.map((label, i) => {
                  const stepNum = i + 1;
                  const isDone = stepNum < client.step;
                  const isActive = stepNum === client.step;
                  return (
                    <div key={label} className="space-y-3">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500
                        ${isDone ? 'bg-primary-green-500' : isActive ? 'bg-primary-green-500/40 animate-pulse' : 'bg-secondary-blue-400/40'}`}
                      />
                      <div className="flex flex-col">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-tight
                          ${isDone || isActive ? 'text-white' : 'text-secondary-blue-400'}`}
                        >
                          {label}
                        </span>
                        {isActive && (
                          <span className="text-[10px] text-primary-green-400 font-medium">
                            In Progress
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Locations Grid */}
          <div className="bg-secondary-blue-600 rounded-3xl p-8 border border-secondary-blue-400 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Registered Gym Locations
                </h3>
              </div>
              <span className="text-xs font-bold text-secondary-blue-300 bg-secondary-blue-500 px-3 py-1 rounded-full border border-secondary-blue-400">
                {client.subGyms} Total
              </span>
            </div>

            {client.subGyms > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: client.subGyms }).map((_, i) => (
                  <div
                    key={i}
                    className="group p-5 rounded-2xl bg-secondary-blue-500 border border-secondary-blue-400 hover:border-primary-green-400/30 transition-all flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-green-500/10 border border-primary-green-500/20 flex items-center justify-center text-primary-green-400 group-hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">
                        Location {i + 1}
                      </h4>
                      <p className="text-xs text-secondary-blue-200 mt-0.5">
                        {client.city}, {client.state}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-secondary-blue-400 bg-secondary-blue-600 px-2 py-0.5 rounded-full border border-secondary-blue-400">
                          Main Facility
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-secondary-blue-400/50 bg-secondary-blue-500/10">
                <div className="p-4 rounded-full bg-secondary-blue-500 text-secondary-blue-300 mb-3">
                  <MapPin className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-secondary-blue-300 text-sm italic">
                  No sub-gyms registered yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Info Cards ────────────────────── */}
        <div className="lg:col-span-4 space-y-6">
          {/* Subscription Card */}
          <SideCard
            title="Subscription"
            icon={<CreditCard className="w-4 h-4" />}
          >
            <div className="py-6 flex flex-col items-center border-b border-secondary-blue-400/50 mb-5">
              <span
                className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-3 ${tierStyle.badge}`}
              >
                {client.subscriptionTier}
              </span>
              <h4 className="text-2xl font-bold text-white tracking-tight">
                Active Plan
              </h4>
            </div>
            <div className="space-y-4">
              <InfoRow label="Billing Cycle" value="Monthly" />
              <InfoRow label="Capacity" value={tierStyle.max} />
              <InfoRow
                label="Status"
                value="Verified"
                valueClass="text-primary-green-400 font-bold"
              />
            </div>
          </SideCard>

          {/* Account Card */}
          <SideCard
            title="Account Info"
            icon={<KeyRound className="w-4 h-4" />}
          >
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-bold text-secondary-blue-300 uppercase block mb-2">
                  Username
                </span>
                <div className="p-3 rounded-xl bg-secondary-blue-500 border border-secondary-blue-400 font-mono text-xs text-white break-all">
                  {client.username || 'Not generated yet'}
                </div>
              </div>
              <div>
                <span className="text-[11px] font-bold text-secondary-blue-300 uppercase block mb-2">
                  Temp Password
                </span>
                <div className="p-3 rounded-xl bg-secondary-blue-500 border border-secondary-blue-400 font-mono text-xs text-white/40 tracking-widest">
                  {client.tempPassword ? '••••••••••••' : 'Not generated'}
                </div>
              </div>
            </div>
          </SideCard>

          {/* Contact Summary */}
          <SideCard title="Contact Detail" icon={<Mail className="w-4 h-4" />}>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-secondary-blue-300 uppercase font-bold">
                    Primary Email
                  </p>
                  <p className="text-xs text-white truncate">{client.email}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-secondary-blue-300 uppercase font-bold">
                    Address
                  </p>
                  <p className="text-xs text-white break-words">
                    {client.address}
                  </p>
                </div>
              </div>
            </div>
          </SideCard>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Sub-components ──────────────────────────────────── */

function SideCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-secondary-blue-600 rounded-3xl p-6 border border-secondary-blue-400 shadow-xl">
      <div className="flex items-center gap-2 mb-6 text-secondary-blue-200">
        <div className="p-1.5 rounded-lg bg-secondary-blue-400/40 text-secondary-blue-100">
          {icon}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueClass = 'text-white',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-secondary-blue-300 font-medium">
        {label}
      </span>
      <span className={`text-xs text-right truncate ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}
