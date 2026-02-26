'use client';

import { useState } from 'react';

import {
  Badge,
  Button,
  InfoBadge,
  InfoCard,
  Search,
} from '@kurlclub/ui-components';
import {
  ArrowUpRight,
  Building2,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Users,
  X,
} from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';

import { OnboardingWizard } from './components';
import type { OnboardingClient } from './types';

export function OnboardingModule() {
  const [selectedClient, setSelectedClient] = useState<OnboardingClient | null>(
    null,
  );
  const [showWizard, setShowWizard] = useState(false);

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

  return showWizard ? (
    <OnboardingWizard onClose={() => setShowWizard(false)} />
  ) : (
    <StudioLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
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

      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-[20px] font-medium text-white">
          Active Onboarding Queue
        </h3>

        <Button
          onClick={() => {
            setSelectedClient(null);
            setShowWizard(true);
          }}
        >
          <Plus className="w-5 h-5" />
          Add new
        </Button>
      </div>

      {selectedClient ? (
        <ClientDetailView
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onResumeOnboarding={() => {}}
          getStatusVariant={getStatusVariant}
          showWizard={setShowWizard}
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
  getStatusVariant,
  onSelectClient,
}: {
  clients: OnboardingClient[];
  onSelectClient: (client: OnboardingClient) => void;
  getStatusVariant: (
    status: string,
  ) => 'success' | 'warning' | 'info' | 'error';
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Search
          placeholder="Search"
          onSearch={() => {}}
          className="max-w-[332px]"
        />
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            {/* TODO: Need to add count in badge */}
            <Badge variant="outline">In progress</Badge>
            <Badge variant="outline">Pending activation</Badge>
            <Badge variant="outline">Completed</Badge>
          </div>
          {/* TODO: Classname of button not working */}
          <Button variant="outline" className="h-[37px]">
            View
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {clients.map((client) => (
          <div
            key={client.id}
            onClick={() => onSelectClient(client)}
            className="bg-secondary-blue-500 p-4 border border-secondary-blue-50 rounded-lg hover:border-primary-green-500 hover:shadow-lg k-transition cursor-pointer group"
          >
            {/* <div className="flex items-start justify-between gap-4"> */}
            <div className="flex-1">
              <div className="flex items-start gap-4 justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* TODO: Avatr comp is missing in ui library */}
                  <div className="uppercase bg-secondary-blue-400 rounded-full h-12 w-12 text-neutral-green-300 text-[20px] font-medium flex items-center justify-center">
                    ds
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-medium text-white text-[20px] leading-[109%]">
                      {client.name}
                    </h4>
                    <p className="text-sm font-semibold leading-[109%] text-semantic-blue-500">
                      Powerfit Andheri +2 more
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <InfoBadge variant={getStatusVariant(client.status)}>
                    {client.status}
                  </InfoBadge>
                  <ArrowUpRight className="w-8 h-8 text-gray-400 group-hover:text-primary-green-500 k-transition" />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400 font-medium tracking-wider">
                    Onboarding Progress
                  </span>
                </div>
                {/* TODO: Progress bar missing in UI library */}
                <div className="w-full bg-secondary-blue-400 rounded-lg h-2 overflow-hidden">
                  <div
                    className="bg-primary-green-500 h-full k-transition rounded-lg"
                    style={{
                      width: `${(client.step / client.totalSteps) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="flex flex-col gap-3">
                  <p className="text-secondary-blue-200 text-sm leading-[109%]">
                    Email
                  </p>
                  <p className="text-sm font-semibold leading-[109%] text-white">
                    {client.email}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-secondary-blue-200 text-sm leading-[109%]">
                    Subscription
                  </p>
                  <p className="text-sm font-semibold leading-[109%] text-white">
                    {client.subscriptionTier}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-secondary-blue-200 text-sm leading-[109%]">
                    Created on
                  </p>
                  <p className="text-sm font-semibold leading-[109%] text-white">
                    {/* TODO: Date format is not as er figma */}
                    {client.createdAt}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-secondary-blue-200 text-sm leading-[109%]">
                    Created by
                  </p>
                  <p className="text-sm font-semibold leading-[109%] text-white">
                    {client.owner}
                  </p>
                </div>
              </div>
            </div>
          </div>
          // </div>
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
  showWizard,
}: {
  client: OnboardingClient;
  onClose: () => void;
  showWizard: (show: boolean) => void;
  onResumeOnboarding: (client: OnboardingClient) => void;
  getStatusVariant: (
    status: string,
  ) => 'success' | 'warning' | 'info' | 'error';
}) {
  return (
    <div className="bg-secondary-blue-500 rounded-xl border border-secondary-blue-400 shadow-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-secondary-blue-400">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-green-500/20 rounded-lg">
            <Building2 className="w-7 h-7 text-primary-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{client.name}</h2>
            <p className="text-sm text-gray-400">Owned by {client.owner}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 hover:bg-secondary-blue-600 rounded-lg k-transition"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Contact Card */}
          <SectionCard title="Contact Information">
            <InfoRow icon={<Mail />} label="Email" value={client.email} />
            <InfoRow
              icon={<Phone />}
              label="Phone"
              value={client.contactNumber}
            />
            <InfoRow
              icon={<MapPin />}
              label="Location"
              value={`${client.city}, ${client.state}`}
            />
          </SectionCard>

          {/* Subscription Card */}
          <SectionCard title="Subscription">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Plan</span>
              <span className="text-white font-semibold">
                {client.subscriptionTier}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Gyms</span>
              <span className="text-primary-green-500 font-semibold">
                {client.subGyms} /{' '}
                {client.subscriptionTier === 'Starter'
                  ? '1'
                  : client.subscriptionTier === 'Professional'
                    ? '5'
                    : 'Unlimited'}
              </span>
            </div>
          </SectionCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Onboarding */}
          <SectionCard title="Onboarding Status">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">Progress</span>
              <span className="text-primary-green-500 font-semibold">
                {client.step}/{client.totalSteps}
              </span>
            </div>

            <div className="w-full bg-secondary-blue-600 rounded-full h-2 mb-3">
              <div
                className="bg-primary-green-500 h-full rounded-full"
                style={{
                  width: `${(client.step / client.totalSteps) * 100}%`,
                }}
              />
            </div>

            <InfoBadge variant={getStatusVariant(client.status)}>
              {client.status}
            </InfoBadge>
          </SectionCard>

          {/* Credentials */}
          <SectionCard title="Account Credentials">
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-400">Username</p>
                <p className="font-mono text-white">
                  {client.username || 'Not Generated'}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Temp Password</p>
                <p className="font-mono text-white">
                  {client.tempPassword ? '••••••••' : 'Not Generated'}
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Action */}
          {client.status !== 'Completed' && (
            <button
              onClick={() => {
                showWizard(true);
                onResumeOnboarding(client);
              }}
              className="w-full py-3 rounded-lg bg-primary-green-500 text-primary-blue-500 hover:bg-primary-green-600 font-semibold flex items-center justify-center gap-2 shadow-lg"
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

/* Reusable Components */

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-secondary-blue-600 border border-secondary-blue-400 rounded-lg p-4 space-y-3">
      <h3 className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-primary-green-500 w-5 h-5">{icon}</div>
      <div className="min-w-0">
        <p className="text-[12px] text-gray-400">{label}</p>
        <p className="text-[14px] text-white truncate">{value}</p>
      </div>
    </div>
  );
}
