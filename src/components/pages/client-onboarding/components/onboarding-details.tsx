'use client';

import type React from 'react';

import { InfoBadge } from '@kurlclub/ui-components';
import {
  Building2,
  Calendar,
  Mail,
  MapPin,
  Phone,
  StickyNote,
  User,
} from 'lucide-react';

import type { OnboardingRecord } from '../types';
import {
  formatOnboardingDate,
  getStatusLabel,
  getStatusVariant,
} from '../utils';

interface OnboardingDetailsProps {
  client: OnboardingRecord;
}

export function OnboardingDetails({ client }: OnboardingDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <div className="flex items-center gap-2 -mt-2">
        <InfoBadge variant={getStatusVariant(client.status)}>
          {getStatusLabel(client.status)}
        </InfoBadge>
      </div>

      {/* Lead summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1 bg-secondary-blue-600 rounded-2xl p-6 border border-secondary-blue-400 space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-secondary-blue-200" />
            <h3 className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wide">
              Contact
            </h3>
          </div>
          <div className="space-y-3">
            <ContactItem
              icon={<User className="w-3.5 h-3.5" />}
              value={client.contactName}
            />
            <ContactItem
              icon={<Mail className="w-3.5 h-3.5" />}
              value={client.email}
            />
            <ContactItem
              icon={<Phone className="w-3.5 h-3.5" />}
              value={client.phoneNumber}
            />
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-secondary-blue-600 rounded-2xl p-6 border border-secondary-blue-400 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-secondary-blue-200" />
            <h3 className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wide">
              Club Info
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <InfoRow label="Club Name" value={client.data?.gymName} />
            <InfoRow
              label="Club Contact Number"
              value={client.data?.gymContactNumber}
            />
            <InfoRow label="Club Location" value={client.data?.gymLocation} />
            <InfoRow label="Country" value={client.data?.country} />
            <InfoRow
              label="Region / State / Province"
              value={client.data?.region}
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      {client.notes ? (
        <div className="bg-secondary-blue-600 rounded-2xl p-6 border border-secondary-blue-400">
          <div className="flex items-center gap-2 mb-4">
            <StickyNote className="w-4 h-4 text-secondary-blue-200" />
            <h3 className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wide">
              Notes
            </h3>
          </div>
          <p className="text-sm text-secondary-blue-200">{client.notes}</p>
        </div>
      ) : null}

      {/* Timeline */}
      <div className="bg-secondary-blue-600 rounded-2xl p-6 border border-secondary-blue-400">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-secondary-blue-200" />
          <h3 className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wide">
            Timeline
          </h3>
        </div>
        <div className="space-y-2 text-sm">
          <InfoRow
            label="Created"
            value={formatOnboardingDate(client.createdAt)}
          />
          <InfoRow
            label="Updated"
            value={formatOnboardingDate(client.updatedAt)}
          />
          <InfoRow
            label="Completed"
            value={formatOnboardingDate(client.completedAt)}
            valueClass={
              client.completedAt
                ? 'text-primary-green-400'
                : 'text-secondary-blue-300'
            }
          />
          <InfoRow
            label="Assigned Admin"
            value={
              client.assignedAdminId !== null &&
              client.assignedAdminId !== undefined
                ? `#${client.assignedAdminId}`
                : ''
            }
          />
          <InfoRow label="Portal Username" value={client.portalUsername} />
        </div>
      </div>

      {/* Location badge */}
      {client.data?.gymLocation && (
        <div className="flex items-center gap-2 text-xs text-secondary-blue-300">
          <MapPin className="w-3 h-3" />
          {client.data.gymLocation}
        </div>
      )}
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
  value: string | null | undefined;
  valueClass?: string;
}) {
  if (value === null || value === undefined || value === '') return null;
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
  value: string | null | undefined;
}) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex items-center gap-2">
      <div className="text-secondary-blue-300">{icon}</div>
      <span className="text-xs text-white truncate">{value}</span>
    </div>
  );
}
