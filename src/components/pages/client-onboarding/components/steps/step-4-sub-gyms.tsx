'use client';

import { useState } from 'react';

import { Button, Input } from '@kurlclub/ui-components';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Briefcase,
  Building2,
  Globe,
  MapPin,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

import { useOnboardingContext } from '../../hooks';
import type { GymLocation } from '../../types';
import { getGymLimitByTier } from '../../utils';
import { StepWrapper } from '../stepper-wrapper';

export function OnboardingStep4() {
  const { formData, setFormData, selectedTier } = useOnboardingContext();
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const initialGymState: GymLocation = {
    GymName: '',
    Location: '',
    ContactNumber1: '',
    ContactNumber2: '',
    Email: '',
    Status: 'Active',
    SocialLinks: ['', '', ''], // [Insta, FB, Twitter/Web]
  };

  const [currentGym, setCurrentGym] = useState<GymLocation>(initialGymState);

  const maxGyms = getGymLimitByTier(selectedTier);
  const gyms = formData.subGyms.gyms;
  const canAddMore = gyms.length < maxGyms;

  const handleInputChange = (field: keyof GymLocation, value: string) => {
    setCurrentGym({ ...currentGym, [field]: value });
  };

  const handleSocialChange = (index: number, value: string) => {
    const updatedLinks = [...currentGym.SocialLinks];
    updatedLinks[index] = value;
    setCurrentGym({ ...currentGym, SocialLinks: updatedLinks });
  };

  const saveGym = () => {
    if (!currentGym.GymName || !currentGym.Location || !currentGym.Email)
      return;

    const updatedGyms = [...gyms];
    if (editingIndex !== null) {
      updatedGyms[editingIndex] = currentGym;
    } else {
      updatedGyms.push(currentGym);
    }

    setFormData({
      ...formData,
      subGyms: { gyms: updatedGyms },
    });

    closeForm();
  };

  const editGym = (index: number) => {
    setCurrentGym(gyms[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const removeGym = (index: number) => {
    const updatedGyms = gyms.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      subGyms: { gyms: updatedGyms },
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingIndex(null);
    setCurrentGym(initialGymState);
  };

  return (
    <StepWrapper
      title="Gym Management"
      description={`Add and manage the gym locations for this client. Your ${selectedTier} plan allows up to ${maxGyms} locations.`}
      className="max-w-[800px] mx-auto"
      gymCount={`${gyms.length}/${maxGyms}`}
    >
      <div className="space-y-6">
        {/* Gym List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {gyms.map((gym, idx) => (
              <motion.div
                key={`${gym.GymName}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group p-5 rounded-3xl bg-secondary-blue-500/50 border border-secondary-blue-400 hover:border-primary-green-500/40 hover:bg-secondary-blue-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary-green-500/10 border border-primary-green-500/20 flex items-center justify-center text-primary-green-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => editGym(idx)}
                        className="p-1.5 rounded-lg bg-secondary-blue-400 text-white hover:bg-secondary-blue-300 transition-colors"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeGym(idx)}
                        className="p-1.5 rounded-lg bg-alert-red-400/20 text-alert-red-400 hover:bg-alert-red-400 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-base truncate">
                    {gym.GymName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-secondary-blue-300">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs truncate">{gym.Location}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-secondary-blue-400 pt-4">
                  <div className="flex -space-x-2">
                    {gym.SocialLinks.filter((l) => l).map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-secondary-blue-400 border border-secondary-blue-500 flex items-center justify-center"
                      >
                        <Globe className="w-2.5 h-2.5 text-secondary-blue-200" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-primary-green-400 uppercase bg-primary-green-500/10 px-2 py-0.5 rounded-full">
                    {gym.Status}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {canAddMore && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="h-full min-h-[160px] rounded-3xl border-2 border-dashed border-secondary-blue-400 hover:border-primary-green-400 hover:bg-primary-green-500/5 transition-all flex flex-col items-center justify-center gap-3 group px-6 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary-blue-500 border border-secondary-blue-400 flex items-center justify-center text-secondary-blue-300 group-hover:text-primary-green-400 group-hover:scale-110 transition-all">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Add Location</p>
                <p className="text-[10px] text-secondary-blue-300 mt-1">
                  Register another facility
                </p>
              </div>
            </button>
          )}
        </div>

        {/* Add/Edit Form Overlay */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-secondary-blue-600 rounded-3xl p-8 border border-secondary-blue-400 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-green-500/10 border border-primary-green-500/20 flex items-center justify-center text-primary-green-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {editingIndex !== null ? 'Edit Gym' : 'Add New Gym'}
                  </h3>
                </div>
                <button
                  onClick={closeForm}
                  className="p-2 text-secondary-blue-200 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Facility Name"
                    placeholder="e.g. Iron Paradise Downtown"
                    mandatory
                    value={currentGym.GymName}
                    onChange={(e) =>
                      handleInputChange('GymName', e.target.value)
                    }
                    className="bg-secondary-blue-500/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Full Address / Location"
                    placeholder="No. 123, Fitness Street, NYC, NY 10001"
                    mandatory
                    value={currentGym.Location}
                    onChange={(e) =>
                      handleInputChange('Location', e.target.value)
                    }
                    className="bg-secondary-blue-500/50"
                  />
                </div>
                <Input
                  label="Contact Number 1"
                  placeholder="+1 555-0101"
                  mandatory
                  value={currentGym.ContactNumber1}
                  onChange={(e) =>
                    handleInputChange('ContactNumber1', e.target.value)
                  }
                  className="bg-secondary-blue-500/50"
                />
                <Input
                  label="Contact Number 2"
                  placeholder="+1 555-0102"
                  value={currentGym.ContactNumber2}
                  onChange={(e) =>
                    handleInputChange('ContactNumber2', e.target.value)
                  }
                  className="bg-secondary-blue-500/50"
                />
                <Input
                  label="Business Email"
                  placeholder="contact@gym.com"
                  mandatory
                  value={currentGym.Email}
                  onChange={(e) => handleInputChange('Email', e.target.value)}
                  className="bg-secondary-blue-500/50"
                />
                <Input
                  label="Status"
                  value={currentGym.Status}
                  onChange={(e) => handleInputChange('Status', e.target.value)}
                  className="bg-secondary-blue-500/50"
                />

                <div className="md:col-span-2 space-y-4 pt-4 border-t border-secondary-blue-400">
                  <p className="text-xs font-bold text-secondary-blue-200 uppercase tracking-widest">
                    Social Links
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['Instagram', 'Facebook', 'Twitter'].map((tag, i) => (
                      <Input
                        key={tag}
                        label={tag}
                        placeholder={tag}
                        value={currentGym.SocialLinks[i]}
                        onChange={(e) => handleSocialChange(i, e.target.value)}
                        className="bg-secondary-blue-500/50 text-xs"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <Button
                  onClick={saveGym}
                  className="flex-1 h-12 shadow-xl shadow-primary-green-500/20"
                >
                  {editingIndex !== null ? 'Update Gym' : 'Add to Account'}
                </Button>
                <Button
                  variant="outline"
                  onClick={closeForm}
                  className="h-12 border-white/10 hover:bg-white/5"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {gyms.length === 0 && !showForm && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 rounded-[40px] border-2 border-dashed border-secondary-blue-400/50 bg-secondary-blue-500/10">
            <div className="p-6 rounded-full bg-secondary-blue-500 text-secondary-blue-300">
              <Building2 className="w-12 h-12 opacity-30" />
            </div>
            <div>
              <p className="text-white font-bold">No locations added</p>
              <p className="text-xs text-secondary-blue-300 mt-1">
                Start by adding your primary gym facility.
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="mt-4 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Location
            </Button>
          </div>
        )}
      </div>
    </StepWrapper>
  );
}
