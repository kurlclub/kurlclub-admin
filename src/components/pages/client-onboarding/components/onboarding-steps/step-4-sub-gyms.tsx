'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  FieldGrid,
  Form,
  KFormField,
  KFormFieldType,
  ProfileUploader,
} from '@kurlclub/ui-components';
import { Country, State } from 'country-state-city';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Briefcase,
  Building2,
  MapPin,
  Phone,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

import { useOnboardingContext } from '@/hooks/onboarding';
import { gymDraftSchema, gymListSchema } from '@/schemas/onboarding.schema';
import type { GymDraft } from '@/types/onboarding';

import { StepWrapper } from './stepper-wrapper';

const INITIAL_GYM_STATE: GymDraft = {
  gymName: '',
  gymEmail: '',
  gymLocation: '',
  gymContactNumber: '',
  country: '',
  region: '',
  gymPhotoFile: null,
  gymPhotoPreview: '',
};

export function OnboardingStep4() {
  const { formData, setFormData, registerStepValidator } =
    useOnboardingContext();
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  const gymForm = useForm<GymDraft>({
    resolver: zodResolver(gymDraftSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: INITIAL_GYM_STATE,
  });
  const currentGym =
    useWatch({
      control: gymForm.control,
    }) ?? INITIAL_GYM_STATE;
  const preview = useWatch({
    control: gymForm.control,
    name: 'gymPhotoPreview',
  });
  const previousCountryRef = useRef<string | null>(null);
  const { lead } = formData;
  const gyms = formData.gyms.gyms;

  const countries = useMemo(() => Country.getAllCountries(), []);
  const countryOptions = useMemo(
    () =>
      [...countries]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((country) => ({
          label: country.name,
          value: country.name,
        })),
    [countries],
  );
  const selectedCountry = useMemo(
    () =>
      countries.find((country) => country.name === currentGym.country) ?? null,
    [countries, currentGym.country],
  );
  const regionOptions = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry.isoCode)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((region) => ({
        label: region.name,
        value: region.name,
      }));
  }, [selectedCountry]);
  const regionDisabled = !currentGym.country || regionOptions.length === 0;

  useEffect(() => {
    if (!showForm || editingIndex !== null) return;
    gymForm.reset(INITIAL_GYM_STATE);
    previousCountryRef.current = null;
  }, [editingIndex, gymForm, showForm]);

  useEffect(() => {
    const country = currentGym.country ?? '';
    if (previousCountryRef.current === null) {
      previousCountryRef.current = country;
      return;
    }
    if (previousCountryRef.current !== country) {
      gymForm.setValue('region', '');
      previousCountryRef.current = country;
    }
  }, [currentGym.country, gymForm]);

  const validateGymList = useCallback(async () => {
    const result = gymListSchema.safeParse(gyms);
    if (!result.success) {
      setListError(result.error.issues[0]?.message ?? 'Validation error');
      return false;
    }
    setListError(null);
    return true;
  }, [gyms]);

  useEffect(() => {
    const unregister = registerStepValidator(4, validateGymList);
    return unregister;
  }, [registerStepValidator, validateGymList]);

  useEffect(() => {
    const leadGym: GymDraft = {
      gymName: lead.leadData.gymName.trim(),
      gymEmail: lead.email.trim(),
      gymLocation: lead.leadData.gymLocation.trim(),
      gymContactNumber: lead.leadData.gymContactNumber.trim(),
      country: lead.leadData.country.trim(),
      region: lead.leadData.region.trim(),
      gymPhotoFile: null,
      gymPhotoPreview: '',
    };
    const hasLeadValues = [
      leadGym.gymName,
      leadGym.gymLocation,
      leadGym.gymContactNumber,
      leadGym.country,
      leadGym.region,
    ].some((value) => value !== '');
    if (!hasLeadValues) return;

    const alreadyAdded = gyms.some(
      (gym) =>
        gym.gymName === leadGym.gymName &&
        gym.gymEmail === leadGym.gymEmail &&
        gym.gymLocation === leadGym.gymLocation &&
        gym.gymContactNumber === leadGym.gymContactNumber &&
        gym.country === leadGym.country &&
        gym.region === leadGym.region,
    );
    if (alreadyAdded) return;

    setFormData({
      ...formData,
      gyms: {
        ...formData.gyms,
        gyms: [leadGym, ...gyms],
      },
    });
  }, [formData, gyms, lead.email, lead.leadData, setFormData]);

  const saveGym = async () => {
    const isValid = await gymForm.trigger();
    if (!isValid) return;

    const gymValues = gymForm.getValues();
    const hasGymPhoto =
      (typeof File !== 'undefined' && gymValues.gymPhotoFile instanceof File) ||
      Boolean(gymValues.gymPhotoPreview?.trim());
    if (
      !gymValues.gymName ||
      !gymValues.gymEmail ||
      !gymValues.gymLocation ||
      !gymValues.gymContactNumber ||
      !gymValues.country ||
      !gymValues.region ||
      !hasGymPhoto
    )
      return;

    const updatedGyms = [...gyms];
    if (editingIndex !== null) {
      updatedGyms[editingIndex] = gymValues;
    } else {
      updatedGyms.push(gymValues);
    }

    setFormData({
      ...formData,
      gyms: { ...formData.gyms, gyms: updatedGyms },
    });

    closeForm();
  };

  const editGym = (index: number) => {
    gymForm.reset(gyms[index]);
    previousCountryRef.current = gyms[index]?.country ?? '';
    setEditingIndex(index);
    setShowForm(true);
  };

  const removeGym = (index: number) => {
    const updatedGyms = gyms.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      gyms: { ...formData.gyms, gyms: updatedGyms },
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingIndex(null);
    gymForm.reset(INITIAL_GYM_STATE);
    previousCountryRef.current = null;
  };

  return (
    <StepWrapper
      title="Club Locations"
      description="Add club locations and contact details."
      className="max-w-225 mx-auto"
      gymCount={`${gyms.length} locations`}
    >
      <div className="space-y-6">
        {listError ? (
          <div className="rounded-2xl border border-alert-red-400/40 bg-alert-red-400/10 px-4 py-3 text-sm text-alert-red-200">
            {listError}
          </div>
        ) : null}
        {/* Gym List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {gyms.map((gym, idx) => (
              <motion.div
                key={`${gym.gymName}-${idx}`}
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
                        type="button"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeGym(idx)}
                        className="p-1.5 rounded-lg bg-alert-red-400/20 text-alert-red-400 hover:bg-alert-red-400 hover:text-white transition-colors"
                        type="button"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-base truncate">
                    {gym.gymName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-secondary-blue-300">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs truncate">{gym.gymLocation}</span>
                  </div>
                  {gym.gymContactNumber ? (
                    <div className="flex items-center gap-2 mt-1 text-secondary-blue-300">
                      <Phone className="w-3 h-3" />
                      <span className="text-xs truncate">
                        {gym.gymContactNumber}
                      </span>
                    </div>
                  ) : null}
                  {(gym.country || gym.region) && (
                    <div className="text-[10px] text-secondary-blue-400 mt-1">
                      {[gym.country, gym.region].filter(Boolean).join(' · ')}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="h-full min-h-40 rounded-3xl border-2 border-dashed border-secondary-blue-400 hover:border-primary-green-400 hover:bg-primary-green-500/5 transition-all flex flex-col items-center justify-center gap-3 group px-6 text-center"
              type="button"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary-blue-500 border border-secondary-blue-400 flex items-center justify-center text-secondary-blue-300 group-hover:text-primary-green-400 group-hover:scale-110 transition-all">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Add Club</p>
                <p className="text-[10px] text-secondary-blue-300 mt-1">
                  Register another club
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
              className="bg-secondary-blue-600/20 rounded-2xl p-5 border border-secondary-blue-400/50 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-green-500/10 border border-primary-green-500/20 flex items-center justify-center text-primary-green-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {editingIndex !== null ? 'Edit Club' : 'Add New Club'}
                  </h3>
                </div>
                <button
                  onClick={closeForm}
                  className="p-2 text-secondary-blue-200 hover:text-white"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Form {...gymForm}>
                <form>
                  <div className="flex flex-col items-center justify-center space-y-4 py-2">
                    <div className="flex items-center gap-2 text-secondary-blue-200">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                        Club Profile
                      </span>
                    </div>
                    <KFormField
                      fieldType={KFormFieldType.SKELETON}
                      control={gymForm.control}
                      name="gymPhotoFile"
                      renderSkeleton={(field) => (
                        <ProfileUploader
                          files={
                            field.value instanceof File ? field.value : null
                          }
                          existingImageUrl={
                            typeof preview === 'string' && preview
                              ? preview
                              : null
                          }
                          onChange={(file) => {
                            if (!file) {
                              field.onChange(null);
                              gymForm.setValue('gymPhotoPreview', '');
                              return;
                            }

                            const reader = new FileReader();
                            reader.onloadend = () => {
                              gymForm.setValue(
                                'gymPhotoPreview',
                                typeof reader.result === 'string'
                                  ? reader.result
                                  : '',
                                {
                                  shouldDirty: true,
                                },
                              );
                            };
                            reader.readAsDataURL(file);
                            field.onChange(file);
                          }}
                        />
                      )}
                    />
                  </div>
                  <FieldGrid columns={1} mdColumns={2} gap="md">
                    <KFormField
                      fieldType={KFormFieldType.INPUT}
                      control={gymForm.control}
                      name="gymName"
                      label="Club Name"
                      mandatory
                    />
                    <KFormField
                      fieldType={KFormFieldType.PHONE_INPUT}
                      control={gymForm.control}
                      name="gymContactNumber"
                      label="Club Contact Number"
                      mandatory
                    />
                    <KFormField
                      fieldType={KFormFieldType.INPUT}
                      control={gymForm.control}
                      name="gymEmail"
                      label="Email"
                      type="email"
                      mandatory
                    />
                    <KFormField
                      fieldType={KFormFieldType.INPUT}
                      control={gymForm.control}
                      name="gymLocation"
                      label="Club Location"
                      mandatory
                    />
                    <KFormField
                      fieldType={KFormFieldType.SELECT}
                      control={gymForm.control}
                      name="country"
                      label="Country"
                      options={countryOptions}
                      mandatory
                    />
                    <KFormField
                      fieldType={KFormFieldType.SELECT}
                      control={gymForm.control}
                      name="region"
                      label="Region / State / Province"
                      options={regionOptions}
                      disabled={regionDisabled}
                      mandatory
                    />
                  </FieldGrid>
                </form>
              </Form>

              <div className="flex gap-3 mt-10">
                <Button onClick={saveGym} className="flex-1 h-10">
                  {editingIndex !== null ? 'Update Club' : 'Add Club'}
                </Button>
                <Button
                  variant="outline"
                  onClick={closeForm}
                  className="h-10 border-white/10 hover:bg-white/5"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StepWrapper>
  );
}
