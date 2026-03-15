'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';

import {
  Building2,
  ChevronRight,
  Dumbbell,
  Star,
  UserCog,
  Users,
} from 'lucide-react';

import type { Subscription } from '@/types/subscription';

interface SubscriptionCardProps {
  subscription: Subscription;
  onView: (id: number) => void;
}

type BillingCycle = 'monthly' | 'sixMonths' | 'yearly';

type LimitRow = {
  key: string;
  label: string;
  value: number;
  icon: typeof Building2;
};

const isUnlimited = (value: number) => value >= 9999;

const formatLimitValue = (value: number) =>
  value < 10 ? `0${value}` : `${value}`;

export function SubscriptionCard({
  subscription,
  onView,
}: SubscriptionCardProps) {
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
    ],
    [subscription.limits],
  );

  return (
    <div className="relative h-full overflow-visible">
      {subscription.isPopular && (
        <div className="absolute -top-3 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#d4ff3f] px-3 py-1 text-xs font-semibold text-[#20242c] shadow-[0_8px_12px_rgba(201,255,50,0.25)]">
          <Star className="h-3.5 w-3.5" />
          Popular
        </div>
      )}
      <div
        className={`group relative flex h-full flex-col overflow-hidden rounded-[22px] border bg-[#1b1e26] p-4 transition ${
          subscription.isPopular
            ? 'border-[#c9ff32]/40 shadow-[0_26px_50px_rgba(0,0,0,0.55)]'
            : 'border-[#2a2f3a] shadow-[0_18px_36px_rgba(0,0,0,0.45)]'
        }`}
      >
        {subscription.isPopular && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.75 rounded-t-[22px] bg-[#c9ff32] shadow-[0_6px_16px_rgba(201,255,50,0.45)]" />
            <div className="pointer-events-none absolute inset-0 z-10 rounded-[22px] border border-[#c9ff32]/30" />
          </>
        )}
        <div className="relative flex items-center justify-between">
          <div className="relative w-11 h-11">
            {subscription.photoPath ? (
              <Image
                src={subscription.photoPath}
                alt={`${subscription.name} plan`}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
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

        <div className="mt-3 space-y-2">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-white">
                {subscription.name}
              </h3>
              {subscription.badge && (
                <span className="rounded-full border border-[#c9ff32]/35 bg-[#232730] px-2 py-0.5 text-[10px] font-semibold text-[#c9ff32]">
                  {subscription.badge}
                </span>
              )}
            </div>
            {subscription.subtitle && (
              <p className="text-xs text-secondary-blue-200">
                {subscription.subtitle}
              </p>
            )}
          </div>
          <div
            className={`text-[32px] font-semibold leading-none ${
              price === 0 ? 'text-[#8b9098]' : 'text-[#c9ff32]'
            }`}
          >
            ₹{price}
          </div>
          {subscription.description && (
            <div
              className="prose prose-sm max-w-none text-[13px] text-secondary-blue-200 prose-p:leading-relaxed prose-p:text-secondary-blue-200 prose-strong:text-white prose-ul:list-none prose-ul:pl-0 prose-li:pl-0 [&_p]:m-0 [&_p]:mt-2 [&_ul]:m-0 [&_li]:m-0"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              dangerouslySetInnerHTML={{ __html: subscription.description }}
            />
          )}
        </div>

        <div className="flex flex-col flex-1 gap-3 mt-3">
          <div className="space-y-1.5">
            {limitRows.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between border-b border-white/5 pb-1.5 text-xs"
                >
                  <div className="flex items-center gap-2 text-[#c7cbd3]">
                    <Icon className="h-3.5 w-3.5 opacity-70" />
                    <span>{item.label}</span>
                  </div>
                  {isUnlimited(item.value) ? (
                    <span className="rounded-full border border-[#c9ff32]/40 bg-[#232730] px-2 py-0.5 text-[10px] font-semibold text-[#c9ff32]">
                      Unlimited
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#f04c5b] px-2 py-0.5 text-[10px] font-semibold text-white">
                      {formatLimitValue(item.value)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onView(subscription.id)}
            className="mt-auto inline-flex items-center gap-2 text-xs font-semibold text-[#c9ff32] underline decoration-[#c9ff32]/70 underline-offset-4"
          >
            Show all features
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
