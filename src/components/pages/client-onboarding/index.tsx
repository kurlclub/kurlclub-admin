'use client';

import { useMemo, useState } from 'react';

import { Button, InfoCard, Sheet, Spinner } from '@kurlclub/ui-components';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  ExternalLink,
  PauseCircle,
  Play,
  Plus,
  Users,
} from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';
import {
  formatOnboardingDate,
  getStatusLabel,
} from '@/lib/utils/onboarding.utils';
import {
  flattenBoard,
  useOnboardingBoard,
  useOnboardingRecord,
  useUpdateOnboardingStatus,
} from '@/services/client-onboarding';
import type { OnboardingRecord, OnboardingStatus } from '@/types/onboarding';

import { OnboardingDetails, OnboardingWizard } from './components';
import { KanbanBoard } from './components/kanban-board';
import { OnboardingProvider } from './contexts';

/* ── Root Module ─────────────────────────────────────── */

export function OnboardingModule() {
  const [selectedClient, setSelectedClient] = useState<OnboardingRecord | null>(
    null,
  );
  const [wizardOpen, setWizardOpen] = useState(false);
  const [resumeClient, setResumeClient] = useState<OnboardingRecord | null>(
    null,
  );

  const { data: board, isLoading, isError, refetch } = useOnboardingBoard();
  const { data: selectedDetails, isLoading: isDetailLoading } =
    useOnboardingRecord(selectedClient?.id ?? null);
  const updateStatusMutation = useUpdateOnboardingStatus();

  const clients = useMemo(() => (board ? flattenBoard(board) : null), [board]);

  const openNewWizard = () => {
    setResumeClient(null);
    setWizardOpen(true);
  };
  const openResumeWizard = (c: OnboardingRecord) => {
    setResumeClient(c);
    setWizardOpen(true);
  };
  const closeWizard = () => {
    setWizardOpen(false);
    setResumeClient(null);
    refetch();
  };

  const totals = useMemo(() => {
    if (!board || !clients) return null;
    const totalLeads = board.lead.length;
    const totalInProgress = board.inProgress.length;
    const totalPendingReview = board.pendingReview.length;
    const totalCompleted = board.completed.length;
    const completionRate = clients.length
      ? Math.round((totalCompleted / clients.length) * 100)
      : 0;
    return {
      totalLeads,
      totalInProgress,
      totalPendingReview,
      completionRate,
    };
  }, [board, clients]);

  const detailClient = selectedDetails ?? null;
  const detailCreatedAt = detailClient
    ? formatOnboardingDate(detailClient.createdAt)
    : '';
  const detailDescription = detailClient
    ? [
        getStatusLabel(detailClient.status),
        detailCreatedAt ? `Created ${detailCreatedAt}` : '',
      ]
        .filter(Boolean)
        .join(' · ')
    : '';

  const handleStatusChange = (
    client: OnboardingRecord,
    status: OnboardingStatus,
  ) => {
    const payload: { status: OnboardingStatus; notes?: string } = { status };
    if (client.notes) payload.notes = client.notes;
    updateStatusMutation.mutate({
      id: client.id,
      payload,
    });
  };

  return (
    <>
      <StudioLayout>
        <>
          {/* ── KPIs ──────────────────────────────────── */}
          {totals && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <InfoCard
                item={{
                  id: '1',
                  icon: <Users className="w-5 h-5" />,
                  color: 'semantic-blue-500',
                  title: 'Leads',
                  count: totals.totalLeads,
                }}
              />
              <InfoCard
                item={{
                  id: '2',
                  icon: <Clock className="w-5 h-5" />,
                  color: 'secondary-pink-500',
                  title: 'In Progress',
                  count: totals.totalInProgress,
                }}
              />
              <InfoCard
                item={{
                  id: '3',
                  icon: <PauseCircle className="w-5 h-5" />,
                  color: 'alert-red-400',
                  title: 'Pending Review',
                  count: totals.totalPendingReview,
                }}
              />
              <InfoCard
                item={{
                  id: '4',
                  icon: <CheckCircle className="w-5 h-5" />,
                  color: 'primary-green-500',
                  title: 'Completion Rate',
                  count: `${totals.completionRate}%`,
                }}
              />
            </div>
          )}

          {/* ── Board header ──────────────────────────── */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Client Onboarding Board
              </h2>
              <p className="text-sm text-secondary-blue-200 mt-0.5">
                Drag cards between columns to update status
              </p>
            </div>
            <Button onClick={openNewWizard} className="gap-2">
              <Plus className="w-4 h-4" />
              Add new lead
            </Button>
          </div>

          {/* ── Kanban board ──────────────────────────── */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-alert-red-400/40 bg-alert-red-400/10 p-6 text-sm text-alert-red-200">
              Failed to load onboarding board. Please try again.
            </div>
          ) : board && clients ? (
            <KanbanBoard
              clients={clients}
              onSelectClient={setSelectedClient}
              onResumeClient={openResumeWizard}
              onStatusChange={handleStatusChange}
            />
          ) : null}
        </>
      </StudioLayout>

      {/* ── Detail Sheet ──────────────────────────── */}
      <Sheet
        isOpen={!!selectedClient}
        onClose={(open: boolean) => !open && setSelectedClient(null)}
        width="lg"
        title={
          detailClient?.data?.gymName ? (
            detailClient.data.gymName
          ) : detailClient?.contactName ? (
            detailClient.contactName
          ) : (
            <span className="sr-only">Client onboarding details</span>
          )
        }
        description={detailDescription}
        footer={
          detailClient ? (
            detailClient.status === 'completed' ? (
              <Button variant="outline" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Open Portal
              </Button>
            ) : detailClient.status === 'cancelled' ? (
              <Button variant="outline" disabled className="gap-2 opacity-70">
                Cancelled
              </Button>
            ) : (
              <Button
                onClick={() => openResumeWizard(detailClient)}
                className="gap-2"
              >
                <Play className="w-4 h-4" />
                Resume Onboarding
              </Button>
            )
          ) : null
        }
      >
        {detailClient ? (
          <OnboardingDetails client={detailClient} />
        ) : isDetailLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : null}
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
