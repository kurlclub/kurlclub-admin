'use client';

import { Input } from '@kurlclub/ui-components';
import { ShieldCheck } from 'lucide-react';

import { useOnboardingContext } from '../../hooks';
import { StepWrapper } from '../stepper-wrapper';

export function OnboardingStep2() {
  const { formData, setFormData } = useOnboardingContext();
  const { userName, password } = formData.accountCreation;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      accountCreation: {
        ...formData.accountCreation,
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <StepWrapper
      title="Secure Credentials"
      description="Create the primary credentials for the client to access their KurlClub dashboard."
      className="max-w-[635px] mx-auto"
    >
      <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col items-center py-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-primary-green-500/10 border border-primary-green-500/20 flex items-center justify-center text-primary-green-400 mb-4 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-white font-semibold">Access Security</h3>
          <p className="text-xs text-secondary-blue-300 mt-1">
            Ensure the passsword is strong and unique.
          </p>
        </div>

        <div className="space-y-6">
          <SectionHeader title="Account Identity" />
          <div className="grid grid-cols-1 gap-5">
            <Input
              name="userName"
              label="Username"
              placeholder="e.g. elite_fitness_admin"
              mandatory
              value={userName}
              onChange={handleInputChange}
              className="bg-secondary-blue-500/50 border-secondary-blue-400 focus:border-primary-green-400 transition-all font-medium py-6"
            />

            <Input
              name="password"
              label="Temporary Password"
              type="password"
              placeholder="••••••••••••"
              mandatory
              value={password || ''}
              onChange={handleInputChange}
              className="bg-secondary-blue-500/50 border-secondary-blue-400 focus:border-primary-green-400 transition-all font-medium py-6"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-secondary-blue-500/30 border border-secondary-blue-400 flex gap-3 items-start">
          <div className="p-1 px-2 rounded-lg bg-primary-green-500/10 text-[10px] font-bold text-primary-green-400 uppercase">
            Tip
          </div>
          <p className="text-[11px] text-secondary-blue-200 leading-relaxed">
            These credentials will be sent to the owner&apos;s email address
            upon completion of this onboarding flow.
          </p>
        </div>
      </div>
    </StepWrapper>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="h-px flex-1 bg-secondary-blue-400/40" />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-blue-300">
        {title}
      </span>
      <div className="h-px flex-1 bg-secondary-blue-400/40" />
    </div>
  );
}
