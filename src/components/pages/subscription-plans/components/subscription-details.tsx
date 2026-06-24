'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';

import { PenLine } from 'lucide-react';

import type { Subscription } from '@/types/subscription';

import {
  SUBSCRIPTION_FEATURE_GROUPS,
  SUBSCRIPTION_LIMIT_FIELDS,
} from '../utils/feature-groups';

interface SubscriptionDetailsProps {
  subscription: Subscription;
  onEdit: () => void;
}

type BillingCycle = 'monthly' | 'sixMonths' | 'yearly';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getBooleanAtPath = (value: unknown, path: string) => {
  const resolved = path
    .split('.')
    .reduce<unknown>(
      (current, segment) => (isRecord(current) ? current[segment] : undefined),
      value,
    );

  return Boolean(resolved);
};

const isUnlimited = (value: number) => value >= 9999;

const formatLimitValue = (value: number) => {
  if (isUnlimited(value)) return 'Unlimited';
  return value < 10 ? `0${value}` : `${value}`;
};

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

  const limitRows = useMemo(
    () =>
      SUBSCRIPTION_LIMIT_FIELDS.map((field) => ({
        key: field.responseKey,
        label: field.label,
        value: subscription.limits[field.responseKey],
      })),
    [subscription.limits],
  );

  const enabledFeatureGroups = useMemo(
    () =>
      SUBSCRIPTION_FEATURE_GROUPS.map((group) => ({
        title: group.title,
        features: group.features.filter((feature) =>
          getBooleanAtPath(subscription.features, feature.responseKey),
        ),
      })).filter((group) => group.features.length > 0),
    [subscription.features],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-secondary-blue-200">
        <span>Created: {formatDate(subscription.createdAt)}</span>
        <button
          type="button"
          onClick={onEdit}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-surface-raised text-secondary-blue-200 transition hover:text-white"
          aria-label="Edit subscription"
        >
          <PenLine className="h-4 w-4" />
        </button>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-raised p-3.5 shadow-[0_7px_11px_rgba(0,0,0,0.4)]">
        <div className="relative flex items-center justify-between">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl">
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
            <div className="flex items-center gap-1 rounded-full bg-surface-toggle p-0.5 text-[10px] font-semibold text-white">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-2.5 py-0.5 transition ${
                  billingCycle === 'monthly'
                    ? 'bg-primary-green-400 text-content-on-accent'
                    : 'text-content-muted'
                }`}
              >
                M
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('sixMonths')}
                className={`rounded-full px-2.5 py-0.5 transition ${
                  billingCycle === 'sixMonths'
                    ? 'bg-primary-green-400 text-content-on-accent'
                    : 'text-content-muted'
                }`}
              >
                6M
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`rounded-full px-2.5 py-0.5 transition ${
                  billingCycle === 'yearly'
                    ? 'bg-primary-green-400 text-content-on-accent'
                    : 'text-content-muted'
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
              <span className="rounded-full border border-primary-green-500/35 bg-surface-chip px-2 py-0.5 text-[10px] font-semibold text-primary-green-500">
                {subscription.badge}
              </span>
            )}
            {subscription.isPopular && (
              <span className="rounded-full border border-primary-green-500/35 bg-surface-chip px-2 py-0.5 text-[10px] font-semibold text-primary-green-500">
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
              price === 0 ? 'text-content-faint' : 'text-primary-green-500'
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

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Limits</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {limitRows.map((item) => (
            <div
              key={item.key}
              className="rounded-2xl border border-white/8 bg-surface-raised px-4 py-3"
            >
              <div className="text-xs uppercase tracking-wider text-secondary-blue-300">
                {item.label}
              </div>
              <div className="mt-2 text-lg font-semibold text-white">
                {formatLimitValue(item.value)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Features</h3>
        {enabledFeatureGroups.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-surface-raised px-4 py-5 text-sm text-secondary-blue-200">
            No feature toggles are enabled for this plan.
          </div>
        ) : (
          <div className="space-y-3">
            {enabledFeatureGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-white/8 bg-surface-raised px-4 py-4"
              >
                <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-green-400">
                  {group.title}
                </h4>
                <div className="mt-3 grid gap-3 text-sm text-white sm:grid-cols-2">
                  {group.features.map((feature) => (
                    <div
                      key={feature.responseKey}
                      className="flex items-center gap-3"
                    >
                      <span className="h-2 w-2 rounded-[3px] bg-primary-green-500" />
                      <span>{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
