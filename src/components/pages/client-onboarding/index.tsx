'use client';

import { useState } from 'react';

import { Button, InfoBadge, InfoCard } from '@kurlclub/ui-components';
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Users,
  X,
} from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';

import { ContinueOnboardingModule, OnboardingWizard } from './components';
import type { OnboardingClient } from './types';

export function OnboardingModule() {
  const [selectedClient, setSelectedClient] = useState<OnboardingClient | null>(
    null,
  );
  const [showWizard, setShowWizard] = useState(false);
  const [showContinueOnboarding, setShowContinueOnboarding] = useState(false);
  const [resumeClient, setResumeClient] = useState<OnboardingClient | null>(null);

  const onboardingClients: OnboardingClient[] = [
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
  ];

  const getStatusVariant = (
    status: string,
  ): 'success' | 'warning' | 'info' | 'error' => {
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
  };

  if (showContinueOnboarding && resumeClient) {
    return (
      <div className="relative">
        <button
          onClick={() => {
            setShowContinueOnboarding(false);
            setResumeClient(null);
          }}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary-blue-500 text-white hover:bg-secondary-blue-600 k-transition border border-secondary-blue-400"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Queue
        </button>
        <ContinueOnboardingModule
          clientId={resumeClient.id}
          clientName={resumeClient.name}
          currentStep={resumeClient.step}
          totalSteps={resumeClient.totalSteps}
          subscriptionTier={resumeClient.subscriptionTier}
          onComplete={() => {
            setShowContinueOnboarding(false);
            setResumeClient(null);
            setSelectedClient(null);
          }}
        />
      </div>
    );
  }

  return (
    <StudioLayout
      title="Client Onboarding"
      description="Manage client setup, accounts, and multi-gym subscriptions"
      headerActions={
        <Button
          onClick={() => {
            setSelectedClient(null);
            setShowWizard(true);
          }}
        >
          <Plus className="w-5 h-5" />
          New Client
        </Button>
      }
    >
      {showWizard && <OnboardingWizard onClose={() => setShowWizard(false)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <InfoCard
          item={{
            id: '1',
            icon: <Clock className="w-5 h-5 text-primary-blue-500" />,
            color: 'semantic-blue-500',
            title: 'In Progress',
            count: 12,
          }}
        />
        <InfoCard
          item={{
            id: '2',
            icon: <Clock className="w-5 h-5 text-primary-blue-500" />,
            color: 'secondary-pink-500',
            title: 'Pending Activation',
            count: 5,
          }}
        />
        <InfoCard
          item={{
            id: '3',
            icon: <Users className="w-5 h-5 text-primary-blue-500" />,
            color: 'primary-green-500',
            title: 'Total Clients',
            count: 248,
          }}
        />
        <InfoCard
          item={{
            id: '4',
            icon: <CheckCircle className="w-5 h-5 text-primary-blue-500" />,
            color: 'alert-red-400',
            title: 'Completion Rate',
            count: '94%',
          }}
        />
      </div>

          {selectedClient ? (
            <ClientDetailView
              client={selectedClient}
              onClose={() => setSelectedClient(null)}
              onResumeOnboarding={() => {
                setResumeClient(selectedClient);
                setShowContinueOnboarding(true);
              }}
              getStatusVariant={getStatusVariant}
            />
          ) : (
            <OnboardingQueueView
              clients={onboardingClients}
              onSelectClient={setSelectedClient}
              getStatusVariant={getStatusVariant}
            />
          )}
    </StudioLayout>
  );
}

function OnboardingQueueView({
  clients,
  onSelectClient,
  getStatusVariant,
}: {
  clients: OnboardingClient[];
  onSelectClient: (client: OnboardingClient) => void;
  getStatusVariant: (
    status: string,
  ) => 'success' | 'warning' | 'info' | 'error';
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">
        Active Onboarding Queue
      </h3>
      <div className="space-y-4">
        {clients.map((client) => (
          <div
            key={client.id}
            onClick={() => onSelectClient(client)}
            className="bg-secondary-blue-500 p-6 border border-secondary-blue-400 rounded-lg hover:border-primary-green-500 hover:shadow-lg k-transition cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-green-500/20 rounded-lg group-hover:bg-primary-green-500/30 k-transition">
                    <Building2 className="w-5 h-5 text-primary-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{client.name}</h4>
                    <p className="text-sm text-gray-400">{client.owner}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                      Onboarding Progress
                    </span>
                    <span className="text-xs font-bold text-primary-green-500">
                      {client.step}/{client.totalSteps}
                    </span>
                  </div>
                  <div className="w-full bg-secondary-blue-600 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary-green-500 h-full k-transition"
                      style={{
                        width: `${(client.step / client.totalSteps) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Email</p>
                    <p className="text-sm font-medium text-white">
                      {client.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Subscription</p>
                    <p className="text-sm font-medium text-white">
                      {client.subscriptionTier}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Sub-Gyms</p>
                    <p className="text-sm font-medium text-white">
                      {client.subGyms}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Created</p>
                    <p className="text-sm font-medium text-white">
                      {client.createdAt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <InfoBadge variant={getStatusVariant(client.status)}>
                  {client.status}
                </InfoBadge>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-green-500 k-transition" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientDetailView({
  client,
  onClose,
  onResumeOnboarding,
  getStatusVariant,
}: {
  client: OnboardingClient;
  onClose: () => void;
  onResumeOnboarding: (client: OnboardingClient) => void;
  getStatusVariant: (
    status: string,
  ) => 'success' | 'warning' | 'info' | 'error';
}) {
  return (
    <div className="bg-secondary-blue-500 p-8 rounded-lg border border-secondary-blue-400">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-green-500/20 rounded-lg">
            <Building2 className="w-8 h-8 text-primary-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{client.name}</h2>
            <p className="text-gray-400">Owned by {client.owner}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-secondary-blue-600 rounded-lg k-transition"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary-blue-600 border border-secondary-blue-400 hover:bg-secondary-blue-700 k-transition">
                <Mail className="w-5 h-5 text-primary-green-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium text-white truncate">
                    {client.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary-blue-600 border border-secondary-blue-400 hover:bg-secondary-blue-700 k-transition">
                <Phone className="w-5 h-5 text-primary-green-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-white">
                    {client.contactNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary-blue-600 border border-secondary-blue-400 hover:bg-secondary-blue-700 k-transition">
                <MapPin className="w-5 h-5 text-primary-green-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="text-sm font-medium text-white">
                    {client.city}, {client.state}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Subscription Details
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-secondary-blue-400 bg-secondary-blue-600">
                <p className="text-xs text-gray-400 mb-1">Plan</p>
                <p className="text-lg font-bold text-white">
                  {client.subscriptionTier}
                </p>
              </div>
              <div className="p-4 rounded-lg border border-secondary-blue-400 bg-secondary-blue-600">
                <p className="text-xs text-gray-400 mb-1">
                  Gym Locations Allowed
                </p>
                <p className="text-lg font-bold text-primary-green-500">
                  {client.subGyms} /{' '}
                  {client.subscriptionTier === 'Starter'
                    ? '1'
                    : client.subscriptionTier === 'Professional'
                      ? '5'
                      : 'Unlimited'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Onboarding Status
            </h3>
            <div className="space-y-4">
              <div className="p-5 rounded-lg bg-primary-green-500/20 border border-primary-green-500/40">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-white">Progress</p>
                  <span className="text-sm font-bold text-primary-green-500">
                    {client.step}/{client.totalSteps}
                  </span>
                </div>
                <div className="w-full bg-secondary-blue-600 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary-green-500 h-full k-transition"
                    style={{
                      width: `${(client.step / client.totalSteps) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <InfoBadge variant={getStatusVariant(client.status)}>
                {client.status}
              </InfoBadge>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Account Credentials
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-secondary-blue-600 border border-secondary-blue-400">
                <p className="text-xs text-gray-400 mb-2">Username</p>
                <p className="font-mono text-sm text-white">
                  {client.username || 'Not Generated'}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary-blue-600 border border-secondary-blue-400">
                <p className="text-xs text-gray-400 mb-2">Temp Password</p>
                <p className="font-mono text-sm text-white">
                  {client.tempPassword ? '••••••••' : 'Not Generated'}
                </p>
              </div>
            </div>
          </div>

          {client.status !== 'Completed' && (
            <button
              onClick={() => onResumeOnboarding(client)}
              className="w-full px-5 py-3 rounded-lg bg-primary-green-500 text-primary-blue-500 hover:bg-primary-green-600 k-transition font-semibold shadow-lg flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Resume Onboarding
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
