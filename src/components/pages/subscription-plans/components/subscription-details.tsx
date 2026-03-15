'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';

import {
  Building2,
  Dumbbell,
  KeyRound,
  Monitor,
  PenLine,
  UserCog,
  Users,
} from 'lucide-react';

import type { Subscription } from '@/types/subscription';

import { FEATURE_GROUPS } from '../utils/feature-groups';

interface SubscriptionDetailsProps {
  subscription: Subscription;
  onEdit: () => void;
}

type BillingCycle = 'monthly' | 'sixMonths' | 'yearly';

type LimitRow = {
  key: string;
  label: string;
  value: number;
  icon: typeof Building2;
};

type FeatureItem = {
  key: keyof Subscription['features'];
  label: string;
};

const formatLimitValue = (value: number) =>
  value < 10 ? `0${value}` : `${value}`;

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export function SubscriptionDetails({
  subscription,
  onEdit,
}: SubscriptionDetailsProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const price =
    billingCycle === 'monthly'
      ? subscription.monthlyPrice
      : billingCycle === 'sixMonths'
        ? subscription.sixMonthsPrice
        : subscription.yearlyPrice;

  const limitRows = useMemo<LimitRow[]>(
    () => [
      {
        key: 'clubs',
        label: 'Clubs',
        value: subscription.limits.maxClubs,
        icon: Building2,
      },
      {
        key: 'members',
        label: 'Members',
        value: subscription.limits.maxMembers,
        icon: Users,
      },
      {
        key: 'trainers',
        label: 'Trainers',
        value: subscription.limits.maxTrainers,
        icon: Dumbbell,
      },
      {
        key: 'staff',
        label: 'Staff',
        value: subscription.limits.maxStaffs,
        icon: UserCog,
      },
      {
        key: 'devices',
        label: 'Devices Per User',
        value: Number(subscription.features.devicesPerUserLimit || 0),
        icon: Monitor,
      },
      {
        key: 'staff-login',
        label: 'Staff Login Limit',
        value: Number(subscription.features.staffLoginLimit || 0),
        icon: KeyRound,
      },
      {
        key: 'trainer-login',
        label: 'Trainer Login Limit',
        value: Number(subscription.features.trainerLoginLimit || 0),
        icon: Dumbbell,
      },
    ],
    [
      subscription.features.devicesPerUserLimit,
      subscription.features.staffLoginLimit,
      subscription.features.trainerLoginLimit,
      subscription.limits.maxClubs,
      subscription.limits.maxMembers,
      subscription.limits.maxStaffs,
      subscription.limits.maxTrainers,
    ],
  );

  const enabledFeatures = useMemo(() => {
    const groups = Object.values(FEATURE_GROUPS) as {
      features: FeatureItem[];
    }[];
    return groups
      .flatMap((group) => group.features)
      .filter((feature) => subscription.features[feature.key]);
  }, [subscription.features]);

  const numericFeatures = useMemo(
    () =>
      [
        {
          key: 'devicesPerUserLimit',
          label: 'Devices Per User Limit',
          value: Number(subscription.features.devicesPerUserLimit || 0),
        },
        {
          key: 'staffLoginLimit',
          label: 'Staff Login Limit',
          value: Number(subscription.features.staffLoginLimit || 0),
        },
        {
          key: 'trainerLoginLimit',
          label: 'Trainer Login Limit',
          value: Number(subscription.features.trainerLoginLimit || 0),
        },
      ].filter((field) => field.value > 0),
    [
      subscription.features.devicesPerUserLimit,
      subscription.features.staffLoginLimit,
      subscription.features.trainerLoginLimit,
    ],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-secondary-blue-200">
        <span>Created: {formatDate(subscription.createdAt)}</span>
        <button
          type="button"
          onClick={onEdit}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#1f222b] text-secondary-blue-200 transition hover:text-white"
          aria-label="Edit subscription"
        >
          <PenLine className="w-4 h-4" />
        </button>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-[#2a2f3a] bg-[#1f222b] p-3.5 shadow-[0_7px_11px_rgba(0,0,0,0.4)]">
        <div className="relative flex items-center justify-between">
          <div className="relative h-12 w-12">
            {subscription.photoPath ? (
              <Image
                src={subscription.photoPath}
                alt={`${subscription.name} plan`}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle,rgba(201,255,50,0.5),rgba(201,255,50,0.1)_70%)]" />
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-[#2b2f38] p-0.5 text-[10px] font-semibold text-white">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-2.5 py-0.5 transition ${
                  billingCycle === 'monthly'
                    ? 'bg-[#d4ff3f] text-[#20242c]'
                    : 'text-[#c7cbd3]'
                }`}
              >
                M
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('sixMonths')}
                className={`rounded-full px-2.5 py-0.5 transition ${
                  billingCycle === 'sixMonths'
                    ? 'bg-[#d4ff3f] text-[#20242c]'
                    : 'text-[#c7cbd3]'
                }`}
              >
                6M
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`rounded-full px-2.5 py-0.5 transition ${
                  billingCycle === 'yearly'
                    ? 'bg-[#d4ff3f] text-[#20242c]'
                    : 'text-[#c7cbd3]'
                }`}
              >
                Y
              </button>
            </div>
          </div>
        </div>

        <div className="relative mt-5 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-white">
              {subscription.name}
            </h3>
            {subscription.badge && (
              <span className="rounded-full border border-[#c9ff32]/35 bg-[#232730] px-2 py-0.5 text-[10px] font-semibold text-[#c9ff32]">
                {subscription.badge}
              </span>
            )}
            {subscription.isPopular && (
              <span className="rounded-full border border-[#c9ff32]/35 bg-[#232730] px-2 py-0.5 text-[10px] font-semibold text-[#c9ff32]">
                Popular
              </span>
            )}
          </div>
          {subscription.subtitle && (
            <p className="text-xs text-secondary-blue-200">
              {subscription.subtitle}
            </p>
          )}
          <div
            className={`text-[40px] font-semibold leading-none ${
              price === 0 ? 'text-[#8b9098]' : 'text-[#c9ff32]'
            }`}
          >
            ₹{price}
          </div>
          {subscription.description && (
            <div
              className="prose prose-sm max-w-none text-[13px] text-secondary-blue-200 prose-p:leading-relaxed prose-p:text-secondary-blue-200 prose-strong:text-white prose-ul:list-none prose-ul:pl-0 prose-li:pl-0 [&_p]:m-0 [&_p]:mt-2 [&_ul]:m-0 [&_li]:m-0"
              dangerouslySetInnerHTML={{ __html: subscription.description }}
            />
          )}
        </div>
      </section>

      <section className="space-y-2">
        {limitRows.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="flex items-center justify-between pb-2 text-sm border-b border-white/5"
            >
              <div className="flex items-center gap-2 text-[#c7cbd3]">
                <Icon className="w-4 h-4 opacity-70" />
                <span>{item.label}</span>
              </div>
              <span className="rounded-full bg-[#f04c5b] px-2.5 py-0.5 text-xs font-semibold text-white">
                {formatLimitValue(item.value)}
              </span>
            </div>
          );
        })}
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Features list</h3>
        <div className="grid gap-3 text-base text-white sm:grid-cols-2">
          {enabledFeatures.map((feature) => (
            <div key={feature.key} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-[3px] bg-[#c9ff32]" />
              <span>{feature.label}</span>
            </div>
          ))}
          {numericFeatures.map((feature) => (
            <div key={feature.key} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-[3px] bg-[#c9ff32]" />
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
