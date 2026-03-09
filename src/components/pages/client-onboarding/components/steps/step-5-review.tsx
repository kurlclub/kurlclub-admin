'use client';

import {
  Building2,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  ShieldCheck,
  Smartphone,
  Store,
  User,
} from 'lucide-react';

import { useOnboardingContext } from '../../hooks';
import { StepWrapper } from '../stepper-wrapper';

export function OnboardingStep5() {
  const { formData } = useOnboardingContext();
  const { email, phoneNumber, profilePhotoPreview } = formData.clientInfo;
  const { userName } = formData.accountCreation;
  const { tier } = formData.subscription;
  const { gyms } = formData.subGyms;

  return (
    <StepWrapper
      title="Final Review"
      description="Verify that all details are correct before activating the client account and facilities."
      className="max-w-[800px] mx-auto"
    >
      <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Identity Summary */}
          <div className="p-6 rounded-[32px] bg-secondary-blue-500/50 border border-secondary-blue-400 space-y-6">
            <SectionSubHeader
              title="Account Identity"
              icon={<User className="w-3.5 h-3.5" />}
            />

            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-secondary-blue-600 border border-secondary-blue-400 flex items-center justify-center">
                {profilePhotoPreview ? (
                  <img
                    src={profilePhotoPreview}
                    alt="Owner"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-secondary-blue-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {userName || 'Not Set'}
                </p>
                <p className="text-[11px] text-secondary-blue-300 font-medium uppercase tracking-wider mt-1">
                  {tier} Plan
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <InfoRow
                icon={<Mail className="w-3.5 h-3.5" />}
                label="Email"
                value={email}
              />
              <InfoRow
                icon={<Smartphone className="w-3.5 h-3.5" />}
                label="Phone"
                value={phoneNumber}
              />
            </div>
          </div>

          {/* Security & Access Summary */}
          <div className="p-6 rounded-[32px] bg-secondary-blue-500/50 border border-secondary-blue-400 space-y-6">
            <SectionSubHeader
              title="Access Configuration"
              icon={<ShieldCheck className="w-3.5 h-3.5" />}
            />

            <div className="p-4 rounded-2xl bg-secondary-blue-600/50 border border-secondary-blue-400/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-secondary-blue-300 font-bold uppercase tracking-widest">
                  Login Security
                </span>
                <CheckCircle2 className="w-4 h-4 text-primary-green-400" />
              </div>
              <p className="text-[13px] text-white">
                Temporary password set and encrypted.
              </p>
              <p className="text-[11px] text-secondary-blue-300 mt-2">
                Owner will receive an activation link to set their permanent
                password.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-[11px] font-bold text-secondary-blue-300 uppercase tracking-widest">
                Automation Tasks
              </p>
              <div className="space-y-2">
                <TaskItem label="Generate Admin Token" active />
                <TaskItem label="Initialize API Workspace" active />
                <TaskItem label="Send Welcome Credentials" active />
              </div>
            </div>
          </div>

          {/* Facilities Summary */}
          <div className="p-6 rounded-[32px] bg-secondary-blue-500/50 border border-secondary-blue-400 lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <SectionSubHeader
                title="Registered Facilities"
                icon={<Store className="w-3.5 h-3.5" />}
              />
              <span className="text-[10px] font-bold text-primary-green-400 bg-primary-green-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
                {gyms.length} Units
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gyms.map((gym, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-secondary-blue-600/30 border border-secondary-blue-400/30"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary-blue-500 border border-secondary-blue-400 flex items-center justify-center text-primary-green-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {gym.GymName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-secondary-blue-300">
                      <MapPin className="w-2.5 h-2.5" />
                      <span className="text-[10px] truncate">
                        {gym.Location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {gyms.length === 0 && (
                <p className="text-sm text-secondary-blue-400 italic py-4">
                  No gym locations added.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Note */}
        <div className="p-5 rounded-[24px] bg-primary-green-500/5 border border-primary-green-500/20 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-primary-green-500/10 flex items-center justify-center text-primary-green-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Final Activation</p>
            <p className="text-[12px] text-secondary-blue-200 leading-relaxed mt-1">
              Clicking &quot;Activate Client&quot; will Provision the account,
              register the gym facilities, and send the welcome package to{' '}
              <span className="text-white font-medium">{email}</span>. This
              process may take a few seconds.
            </p>
          </div>
        </div>
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
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2.5 text-secondary-blue-300">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-xs font-semibold text-white truncate max-w-[150px]">
        {value || 'N/A'}
      </span>
    </div>
  );
}

function TaskItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-primary-green-400 shadow-[0_0_8px_rgba(25,230,140,0.5)]' : 'bg-secondary-blue-400'}`}
      />
      <span
        className={`text-[11px] ${active ? 'text-secondary-blue-100' : 'text-secondary-blue-400'}`}
      >
        {label}
      </span>
    </div>
  );
}
