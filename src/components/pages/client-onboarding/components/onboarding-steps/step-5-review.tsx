'use client';

import type React from 'react';

import Image from 'next/image';

import {
  Building2,
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  NotebookPen,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';

import { useOnboardingContext } from '@/hooks/onboarding';

import { StepWrapper } from './stepper-wrapper';

export function OnboardingStep5() {
  const { formData } = useOnboardingContext();
  const { lead, account, subscription, gyms } = formData;

  return (
    <StepWrapper
      title="Review & Complete"
      description="Verify the lead, account, subscription, and gym details before completing onboarding."
      className="max-w-225 mx-auto"
    >
      <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Contact */}
          <div className="p-6 rounded-4xl bg-secondary-blue-500/50 border border-secondary-blue-400 space-y-5">
            <SectionSubHeader
              title="Lead Contact"
              icon={<User className="w-3.5 h-3.5" />}
            />
            <div className="space-y-3">
              <InfoRow label="Contact Name" value={lead.contactName} />
              <InfoRow
                label="Email"
                value={lead.email}
                icon={<Mail className="w-3.5 h-3.5" />}
              />
              <InfoRow
                label="Contact Number"
                value={lead.phoneNumber}
                icon={<Phone className="w-3.5 h-3.5" />}
              />
              <InfoRow
                label="Assigned Team Member"
                value={
                  lead.assignedAdminId !== null &&
                  lead.assignedAdminId !== undefined
                    ? `#${lead.assignedAdminId}`
                    : ''
                }
              />
            </div>
          </div>

          {/* Lead Details */}
          <div className="p-6 rounded-4xl bg-secondary-blue-500/50 border border-secondary-blue-400 space-y-5">
            <SectionSubHeader
              title="Club Overview"
              icon={<Building2 className="w-3.5 h-3.5" />}
            />
            <div className="space-y-3">
              <InfoRow label="Club Name" value={lead.leadData.gymName} />
              <InfoRow
                label="Club Contact Number"
                value={lead.leadData.gymContactNumber}
                icon={<Phone className="w-3.5 h-3.5" />}
              />
              <InfoRow
                label="Club Location"
                value={lead.leadData.gymLocation}
                icon={<MapPin className="w-3.5 h-3.5" />}
              />
              <InfoRow label="Country" value={lead.leadData.country} />
              <InfoRow
                label="Region / State / Province"
                value={lead.leadData.region}
              />
            </div>
          </div>

          {/* Account Setup */}
          <div className="p-6 rounded-4xl bg-secondary-blue-500/50 border border-secondary-blue-400 space-y-5">
            <SectionSubHeader
              title="Account Setup"
              icon={<ShieldCheck className="w-3.5 h-3.5" />}
            />
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-secondary-blue-600 border border-secondary-blue-400 flex items-center justify-center">
                {account.userPhotoPreview ? (
                  <Image
                    src={account.userPhotoPreview}
                    alt="Account Owner"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-secondary-blue-400" />
                )}
              </div>
              <div className="space-y-1">
                {account.userName ? (
                  <p className="text-sm font-bold text-white">
                    {account.userName}
                  </p>
                ) : null}
                {account.email ? (
                  <p className="text-xs text-secondary-blue-300">
                    {account.email}
                  </p>
                ) : null}
                {account.phoneNumber ? (
                  <p className="text-xs text-secondary-blue-300">
                    {account.phoneNumber}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-secondary-blue-600/40 border border-secondary-blue-400/40 text-xs text-secondary-blue-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary-green-400" />
              Temporary password will be sent to the account owner&apos;s email.
            </div>
          </div>

          {/* Subscription */}
          <div className="p-6 rounded-4xl bg-secondary-blue-500/50 border border-secondary-blue-400 space-y-5">
            <SectionSubHeader
              title="Subscription"
              icon={<Calendar className="w-3.5 h-3.5" />}
            />
            <div className="space-y-3">
              <InfoRow
                label="Subscription ID"
                value={subscription.subscriptionId}
              />
              <InfoRow
                label="Subscription Date"
                value={subscription.subscriptionDate}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        {lead.notes ? (
          <div className="p-6 rounded-3xl bg-secondary-blue-500/40 border border-secondary-blue-400 space-y-3">
            <SectionSubHeader
              title="Notes"
              icon={<NotebookPen className="w-3.5 h-3.5" />}
            />
            <p className="text-sm text-secondary-blue-200">{lead.notes}</p>
          </div>
        ) : null}

        {/* Gyms */}
        {gyms.gyms.length > 0 ? (
          <div className="p-6 rounded-3xl bg-secondary-blue-500/40 border border-secondary-blue-400 space-y-4">
            <div className="flex items-center justify-between">
              <SectionSubHeader
                title="Clubs"
                icon={<Building2 className="w-3.5 h-3.5" />}
              />
              <span className="text-[10px] font-bold text-primary-green-400 bg-primary-green-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
                {gyms.gyms.length} Locations
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gyms.gyms.map((gym, i) => (
                <div
                  key={`${gym.gymName}-${i}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-secondary-blue-600/30 border border-secondary-blue-400/30"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary-blue-500 border border-secondary-blue-400 flex items-center justify-center text-primary-green-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {gym.gymName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-secondary-blue-300">
                      <MapPin className="w-2.5 h-2.5" />
                      <span className="text-[10px] truncate">
                        {gym.gymLocation}
                      </span>
                    </div>
                    {gym.gymContactNumber ? (
                      <div className="flex items-center gap-1.5 mt-1 text-secondary-blue-300">
                        <Phone className="w-2.5 h-2.5" />
                        <span className="text-[10px] truncate">
                          {gym.gymContactNumber}
                        </span>
                      </div>
                    ) : null}
                    {gym.gymEmail ? (
                      <div className="flex items-center gap-1.5 mt-1 text-secondary-blue-300">
                        <Mail className="w-2.5 h-2.5" />
                        <span className="text-[10px] truncate">
                          {gym.gymEmail}
                        </span>
                      </div>
                    ) : null}
                    {(gym.country || gym.region) && (
                      <div className="text-[10px] text-secondary-blue-400 mt-1">
                        {[gym.country, gym.region].filter(Boolean).join(' · ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </StepWrapper>
  );
}

function SectionSubHeader({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-secondary-blue-400/30 text-secondary-blue-200">
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-blue-200">
        {title}
      </span>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number | null | undefined;
  icon?: React.ReactNode;
}) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2 text-secondary-blue-300">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-xs font-semibold text-white truncate max-w-45">
        {value}
      </span>
    </div>
  );
}
