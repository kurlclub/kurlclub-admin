/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

'use client';

import { useState } from 'react';

import { Copy, Lock, RefreshCw, User } from 'lucide-react';

import { useOnboardingContext } from '../../hooks';
import { useOnboardingForm } from '../../hooks';
import type { AccountCreationData } from '../../types';
import { generatePassword, generateUsername } from '../../utils';
import { validateAccountCreation } from '../../utils';
import { StepWrapper } from '../stepper-wrapper';

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

export function OnboardingStep2() {
  const { formData, setFormData } = useOnboardingContext();
  const { data, handleFieldChange, errors } =
    useOnboardingForm<AccountCreationData>(formData.accountCreation, {
      onValidate: validateAccountCreation,
    });
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerateUsername = () => {
    const newUsername = generateUsername(formData.clientInfo.gymName);
    handleFieldChange('username', newUsername);
    setFormData({
      ...formData,
      accountCreation: { ...data, username: newUsername },
    });
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    handleFieldChange('tempPassword', newPassword);
    setFormData({
      ...formData,
      accountCreation: { ...data, tempPassword: newPassword },
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <StepWrapper
      title="Account Creation"
      description="Generate credentials for the client. These will be sent to them via email."
      errors={errors}
      helpText="The temporary password will expire after first login. Client must set a new password on first access."
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Username
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                readOnly
                className="w-full bg-secondary pl-10 pr-4 py-2 rounded-lg border border-border text-sm text-foreground font-mono"
                value={data.username}
              />
            </div>
            <button
              onClick={handleGenerateUsername}
              className="px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground"
              title="Generate new username"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => copyToClipboard(data.username, 'username')}
              className="px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
              {copied === 'username' && (
                <span className="text-xs">Copied!</span>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Temporary Password
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                readOnly
                className="w-full bg-secondary pl-10 pr-4 py-2 rounded-lg border border-border text-sm text-foreground font-mono"
                value={data.tempPassword}
              />
            </div>
            <button
              onClick={handleGeneratePassword}
              className="px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground"
              title="Generate new password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => copyToClipboard(data.tempPassword, 'password')}
              className="px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
              {copied === 'password' && (
                <span className="text-xs">Copied!</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
