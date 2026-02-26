/**
 * Step 4: Sub-Gym Configuration
 * Add multiple gym locations based on tier limits
 */

'use client';

import { useState } from 'react';

import { Button, Input } from '@kurlclub/ui-components';
import { AlertCircle, MapPin, Plus, X } from 'lucide-react';

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
  // const canAddMore = formData.subGyms.subGyms.length < maxGyms;
  const canAddMore = true;

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
      description="Add all additional gym locations managed by this client account. Your Professional plan allows up to 5 locations."
      errors={errors}
      className="max-w-[754px] mx-auto"
      cardWrapper="p-0! border-0"
      gymCount={`${formData.subGyms.subGyms.length}/${maxGyms}`}
    >
      <div className="flex flex-col gap-5">
        {formData.subGyms.subGyms.map((gym) => (
          <div
            key={gym.id}
            className="p-5 rounded-lg border border-primary-blue-300 flex items-start justify-between bg-secondary-blue-500"
          >
            <div className="flex items-center gap-3">
              <MapPin className="h-[34px] w-[34px] text-primary-green-300" />
              <div className="flex flex-col gap-2">
                <p className="text-base leading-[109%] text-white">
                  {gym.name}
                </p>
                <p className="text-sm text-secondary-blue-200 leading-[109%]">
                  Kakkur, Kerala, India
                </p>
              </div>
            </div>
            <button
              onClick={() => removeSubGym(gym.id)}
              disabled={formData.subGyms.subGyms.length === 1}
              title="Remove location"
              className="cursor-pointer group"
            >
              <X className="w-6 h-6 text-alert-red-300 group-hover:text-alert-red-400 k-transition" />
            </button>
          </div>
        ))}

        {showForm ? (
          <div className="p-2 rounded-lg border border-secondary-blue-500 flex flex-col gap-5">
            <Input
              label="Location name"
              value={newGym.name}
              onChange={(e) => setNewGym({ ...newGym, name: e.target.value })}
            />
            <Input
              label="City"
              value={newGym.city}
              onChange={(e) => setNewGym({ ...newGym, city: e.target.value })}
            />
            <Input
              label="Country"
              value={newGym.country}
              onChange={(e) =>
                setNewGym({ ...newGym, country: e.target.value })
              }
            />
            <div className="flex gap-2">
              <Button onClick={addSubGym}>Add Location</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : canAddMore ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full p-[18px] rounded-lg border-2 border-dashed border-primary-blue-300 hover:border-primary-green-500 hover:bg-secondary-blue-600 k-transition text-base leading-[109%] flex items-center justify-center gap-2 text-white cursor-pointer hover:text-primary-green-500"
          >
            <Plus className="w-6 h-6" />
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
