/**
 * Step 4: Sub-Gym Configuration
 * Add multiple gym locations based on tier limits
 */

'use client';

import { useState } from 'react';

import { AlertCircle, Building2, Plus, X } from 'lucide-react';

import { useOnboardingContext } from '../../hooks';
import { useOnboardingForm } from '../../hooks';
import type { SubGymData } from '../../types';
import { getGymLimitByTier } from '../../utils';
import { validateSubGyms } from '../../utils';
import { StepWrapper } from '../stepper-wrapper';

/**
 * Step 4: Sub-Gym Configuration
 * Add multiple gym locations based on tier limits
 */

/**
 * Step 4: Sub-Gym Configuration
 * Add multiple gym locations based on tier limits
 */

/**
 * Step 4: Sub-Gym Configuration
 * Add multiple gym locations based on tier limits
 */

/**
 * Step 4: Sub-Gym Configuration
 * Add multiple gym locations based on tier limits
 */

/**
 * Step 4: Sub-Gym Configuration
 * Add multiple gym locations based on tier limits
 */

/**
 * Step 4: Sub-Gym Configuration
 * Add multiple gym locations based on tier limits
 */

/**
 * Step 4: Sub-Gym Configuration
 * Add multiple gym locations based on tier limits
 */

/**
 * Step 4: Sub-Gym Configuration
 * Add multiple gym locations based on tier limits
 */

export function OnboardingStep4() {
  const { formData, setFormData, selectedTier } = useOnboardingContext();
  const [showForm, setShowForm] = useState(false);
  const [newGym, setNewGym] = useState({ name: '', city: '', country: '' });

  const maxGyms = getGymLimitByTier(selectedTier);
  const canAddMore = formData.subGyms.subGyms.length < maxGyms;

  const { errors } = useOnboardingForm<SubGymData>(formData.subGyms, {
    onValidate: (data) => validateSubGyms(data.subGyms, maxGyms),
  });

  const addSubGym = () => {
    if (newGym.name && newGym.city && canAddMore) {
      const updated = {
        ...formData,
        subGyms: {
          subGyms: [...formData.subGyms.subGyms, { ...newGym, id: Date.now() }],
        },
      };
      setFormData(updated);
      setNewGym({ name: '', city: '', country: '' });
      setShowForm(false);
    }
  };

  const removeSubGym = (id: number | string) => {
    if (formData.subGyms.subGyms.length > 1) {
      const updated = {
        ...formData,
        subGyms: {
          subGyms: formData.subGyms.subGyms.filter((gym) => gym.id !== id),
        },
      };
      setFormData(updated);
    }
  };

  return (
    <StepWrapper
      title="Sub-Gym Locations"
      description={`Add all additional gym locations managed by this client account. Your ${selectedTier} plan allows up to ${maxGyms} location${maxGyms > 1 ? 's' : ''}.`}
      errors={errors}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formData.subGyms.subGyms.length}/{maxGyms} locations
          </span>
        </div>

        {formData.subGyms.subGyms.map((gym) => (
          <div
            key={gym.id}
            className="p-4 rounded-lg border border-border flex items-center justify-between hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{gym.name}</p>
                <p className="text-sm text-muted-foreground">
                  {gym.city}, {gym.country}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeSubGym(gym.id)}
              disabled={formData.subGyms.subGyms.length === 1}
              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove location"
            >
              <X className="w-4 h-4 text-destructive" />
            </button>
          </div>
        ))}

        {showForm ? (
          <div className="p-4 rounded-lg border border-border space-y-3 bg-secondary/30">
            <input
              type="text"
              placeholder="Location name"
              className="w-full bg-secondary px-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={newGym.name}
              onChange={(e) => setNewGym({ ...newGym, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="City"
              className="w-full bg-secondary px-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={newGym.city}
              onChange={(e) => setNewGym({ ...newGym, city: e.target.value })}
            />
            <input
              type="text"
              placeholder="Country"
              className="w-full bg-secondary px-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={newGym.country}
              onChange={(e) =>
                setNewGym({ ...newGym, country: e.target.value })
              }
            />
            <div className="flex gap-2">
              <button
                onClick={addSubGym}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
              >
                Add Location
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : canAddMore ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/30 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-5 h-5" />
            Add Another Location
          </button>
        ) : (
          <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Location Limit Reached
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your {selectedTier} plan supports up to {maxGyms} location
                {maxGyms > 1 ? 's' : ''}. Upgrade to add more.
              </p>
            </div>
          </div>
        )}
      </div>
    </StepWrapper>
  );
}
