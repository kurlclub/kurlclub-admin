'use client';

import type React from 'react';
import { useRef } from 'react';

import Image from 'next/image';

import { Input } from '@kurlclub/ui-components';
import { Camera, User, X } from 'lucide-react';

import { useOnboardingContext } from '../../hooks';
import { StepWrapper } from '../stepper-wrapper';

export function OnboardingStep1() {
  const { formData, setFormData } = useOnboardingContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { email, phoneNumber, profilePhotoPreview } = formData.clientInfo;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      clientInfo: {
        ...formData.clientInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          clientInfo: {
            ...formData.clientInfo,
            profilePhotoFile: file,
            profilePhotoPreview: reader.result as string,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData({
      ...formData,
      clientInfo: {
        ...formData.clientInfo,
        profilePhotoFile: null,
        profilePhotoPreview: '',
      },
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <StepWrapper
      title="Owner Information"
      description="Provide the primary account owner's contact details and profile photo."
      className="max-w-[635px] mx-auto"
    >
      <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
        {/* Photo Upload Section */}
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <SectionHeader title="Profile Identity" />

          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl overflow-hidden bg-secondary-blue-500 border-2 border-dashed border-secondary-blue-400 flex items-center justify-center group-hover:border-primary-green-400 transition-all">
              {profilePhotoPreview ? (
                <Image
                  src={profilePhotoPreview}
                  alt="Preview"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-secondary-blue-300" />
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-primary-green-500 text-primary-blue-500 shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              <Camera className="w-5 h-5" />
            </button>

            {profilePhotoPreview && (
              <button
                onClick={removePhoto}
                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-alert-red-400 text-white shadow-lg hover:bg-alert-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <p className="text-[10px] text-secondary-blue-300 font-medium">
            Recommended: Square PNG/JPG, max 2MB
          </p>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-4">
          <SectionHeader title="Primary Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              name="email"
              label="Email Address"
              placeholder="owner@kurlclub.com"
              mandatory
              value={email}
              onChange={handleInputChange}
              className="bg-secondary-blue-500/50 border-secondary-blue-400 focus:border-primary-green-400 transition-all font-medium"
            />
            <Input
              name="phoneNumber"
              label="Phone Number"
              placeholder="+91 99000 00000"
              mandatory
              value={phoneNumber}
              onChange={handleInputChange}
              className="bg-secondary-blue-500/50 border-secondary-blue-400 focus:border-primary-green-400 transition-all font-medium"
            />
          </div>
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
