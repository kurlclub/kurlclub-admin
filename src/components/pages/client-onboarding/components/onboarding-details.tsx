'use client';

import { InfoBadge } from '@kurlclub/ui-components';
import {
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from 'lucide-react';

import type { OnboardingClient } from '../types';

const STEP_LABELS = [
  'Client Info',
  'Account Setup',
  'Subscription',
  'Gym Locations',
  'Review',
];

const TIER_CONFIG: Record<string, { max: string; badge: string }> = {
  Starter: {
    max: '1 location',
    badge: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  },
  Professional: {
    max: '5 locations',
    badge: 'bg-zinc-500/10 text-zinc-200 border-zinc-500/20',
  },
  Enterprise: {
    max: 'Unlimited',
    badge: 'bg-neutral-500/10 text-neutral-100 border-neutral-500/20',
  },
};

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

interface OnboardingDetailsProps {
  client: OnboardingClient;
}

export function OnboardingDetails({ client }: OnboardingDetailsProps) {
  const progress = Math.round((client.step / client.totalSteps) * 100);
  const tierConfig =
    TIER_CONFIG[client.subscriptionTier] ?? TIER_CONFIG.Starter;

  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <div className="flex items-center gap-2 -mt-2">
        <InfoBadge variant={getStatusVariant(client.status)}>
          {client.status}
        </InfoBadge>
      </div>

      {/* Progress */}
      <div className="bg-secondary-blue-600 rounded-2xl p-6 border border-secondary-blue-400">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Progress
            </h3>
            <p className="text-xs text-secondary-blue-200 mt-1">
              Step {client.step} of {client.totalSteps} —{' '}
              {STEP_LABELS[client.step - 1]}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{progress}%</div>
          </div>
        </div>

        <div className="h-2 bg-secondary-blue-500 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-linear-to-r from-white to-secondary-blue-100 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isDone = stepNum < client.step;
            const isActive = stepNum === client.step;
            return (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`w-1 h-6 rounded-full ${
                    isDone
                      ? 'bg-white'
                      : isActive
                        ? 'bg-white/50'
                        : 'bg-secondary-blue-500'
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    isDone || isActive
                      ? 'text-white'
                      : 'text-secondary-blue-300'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1 bg-secondary-blue-600 rounded-2xl p-6 border border-secondary-blue-400">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-secondary-blue-200" />
            <h3 className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wide">
              Subscription
            </h3>
          </div>
          <div className="space-y-4">
            <span
              className={`inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${tierConfig.badge}`}
            >
              {client.subscriptionTier}
            </span>
            <div className="space-y-2 text-sm">
              <InfoRow label="Capacity" value={tierConfig.max} />
              <InfoRow label="Billing" value="Monthly" />
              <InfoRow
                label="Status"
                value="Active"
                valueClass="text-primary-green-400"
              />
            </div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-secondary-blue-600 rounded-2xl p-6 border border-secondary-blue-400">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-secondary-blue-200" />
            <h3 className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wide">
              Contact
            </h3>
          </div>
          <div className="space-y-3">
            <ContactItem
              icon={<Mail className="w-3.5 h-3.5" />}
              value={client.email}
            />
            <ContactItem
              icon={<Phone className="w-3.5 h-3.5" />}
              value={client.phone}
            />
            <ContactItem
              icon={<MapPin className="w-3.5 h-3.5" />}
              value={`${client.city}, ${client.state}`}
            />
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-secondary-blue-600 rounded-2xl p-6 border border-secondary-blue-400">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-4 h-4 text-secondary-blue-200" />
            <h3 className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wide">
              Credentials
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-[10px] text-secondary-blue-300 uppercase mb-1">
                Username
              </div>
              <div className="text-xs font-mono text-white bg-secondary-blue-500 px-3 py-2 rounded-lg border border-secondary-blue-400">
                {client.username || 'Not set'}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-secondary-blue-300 uppercase mb-1">
                Password
              </div>
              <div className="text-xs font-mono text-white/40 bg-secondary-blue-500 px-3 py-2 rounded-lg border border-secondary-blue-400">
                {client.tempPassword ? '••••••••••' : 'Not set'}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-secondary-blue-600 rounded-2xl p-6 border border-secondary-blue-400">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-secondary-blue-200" />
            <h3 className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wide">
              Timeline
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <InfoRow
              label="Created"
              value={new Date(client.createdAt).toLocaleDateString()}
            />
            <InfoRow label="Owner" value={client.owner} />
            <InfoRow label="Client ID" value={`#${client.id}`} />
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="bg-secondary-blue-600 rounded-2xl p-6 border border-secondary-blue-400">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-secondary-blue-200" />
            <h3 className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wide">
              Locations
            </h3>
          </div>
          <span className="text-xs font-semibold text-secondary-blue-300 bg-secondary-blue-500 px-3 py-1 rounded-full border border-secondary-blue-400">
            {client.subGyms} Total
          </span>
        </div>

        {client.subGyms > 0 ? (
          <div className="space-y-3">
            {Array.from({ length: client.subGyms }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-secondary-blue-500 border border-secondary-blue-400"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary-blue-600 border border-secondary-blue-400 flex items-center justify-center text-secondary-blue-200">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">
                      Location {i + 1}
                    </div>
                    <div className="text-xs text-secondary-blue-200 mt-0.5">
                      {client.city}, {client.state}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <CheckCircle2 className="w-3 h-3 text-primary-green-400" />
                      <span className="text-[10px] text-primary-green-400">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-secondary-blue-400/50">
            <MapPin className="w-8 h-8 text-secondary-blue-400 mb-2" />
            <p className="text-sm text-secondary-blue-300">No locations</p>
          </div>
        )}
      </div>

      {/* Security */}
      <div className="bg-secondary-blue-600 rounded-2xl p-6 border border-secondary-blue-400">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-secondary-blue-200" />
          <h3 className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wide">
            Security
          </h3>
        </div>
        <div className="space-y-2 text-sm">
          <InfoRow
            label="2FA"
            value="Enabled"
            valueClass="text-primary-green-400"
          />
          <InfoRow label="Last Login" value="Never" />
          <InfoRow
            label="Verification"
            value="Pending"
            valueClass="text-yellow-400"
          />
        </div>
      </div>
    </div>
  );
}

/* Helper Components */

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
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-secondary-blue-300">{label}</span>
      <span className={`text-xs font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

function ContactItem({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-secondary-blue-300">{icon}</div>
      <span className="text-xs text-white truncate">{value}</span>
    </div>
  );
}
