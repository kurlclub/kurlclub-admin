'use client';

import { useState } from 'react';

import { Button, InfoCard, Sheet } from '@kurlclub/ui-components';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  ExternalLink,
  Play,
  Plus,
  ShieldCheck,
  Users,
} from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';

import { OnboardingDetails, OnboardingWizard } from './components';
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
      </StudioLayout>

      {/* ── Detail Sheet ──────────────────────────── */}
      <Sheet
        isOpen={!!selectedClient}
        onClose={(open: boolean) => !open && setSelectedClient(null)}
        width="lg"
        title={selectedClient?.name}
        description={`Created ${selectedClient ? new Date(selectedClient.createdAt).toLocaleDateString() : ''} · ${selectedClient?.owner || ''}`}
        footer={
          selectedClient &&
          (selectedClient.status !== 'Completed' ? (
            <Button
              onClick={() => openResumeWizard(selectedClient)}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Resume Onboarding
            </Button>
          ) : (
            <Button variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Open Portal
            </Button>
          ))
        }
      >
        {selectedClient && <OnboardingDetails client={selectedClient} />}
      </Sheet>

      {/* ── Wizard Modal ──────────────────────────── */}
      <AnimatePresence>
        {wizardOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center pointer-events-none">
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
