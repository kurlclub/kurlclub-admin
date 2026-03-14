'use client';

import { Badge } from '@kurlclub/ui-components';
import { Check, X } from 'lucide-react';

import type { Subscription } from '@/types/subscription';

import { FEATURE_GROUPS } from '../utils/feature-groups';

interface SubscriptionDetailsProps {
  subscription: Subscription;
}

export function SubscriptionDetails({
  subscription,
}: SubscriptionDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Pricing */}
      <section className="bg-secondary-blue-600 rounded-2xl p-6 border border-secondary-blue-400">
        <h3 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider mb-4">
          Pricing
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-secondary-blue-300">Monthly</p>
            <p className="text-2xl font-bold text-white">
              ₹{subscription.monthlyPrice}
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary-blue-300">6 Months</p>
            <p className="text-2xl font-bold text-white">
              ₹{subscription.sixMonthsPrice}
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary-blue-300">Yearly</p>
            <p className="text-2xl font-bold text-white">
              ₹{subscription.yearlyPrice}
            </p>
          </div>
        </div>
      </section>

      {/* Limits */}
      <section className="bg-secondary-blue-600 rounded-2xl p-6 border border-secondary-blue-400">
        <h3 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider mb-4">
          Limits
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-blue-300">Max Clubs</span>
            <span className="text-sm font-semibold text-white">
              {subscription.limits.maxClubs}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-blue-300">Max Members</span>
            <span className="text-sm font-semibold text-white">
              {subscription.limits.maxMembers}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-blue-300">
              Max Trainers
            </span>
            <span className="text-sm font-semibold text-white">
              {subscription.limits.maxTrainers}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-blue-300">Max Staff</span>
            <span className="text-sm font-semibold text-white">
              {subscription.limits.maxStaffs}
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary-blue-600 rounded-2xl p-6 border border-secondary-blue-400">
        <h3 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider mb-4">
          Features
        </h3>
        <div className="space-y-6">
          {Object.entries(FEATURE_GROUPS).map(([groupKey, group]) => (
            <div key={groupKey} className="space-y-3">
              <h4 className="text-xs font-semibold text-primary-green-400 uppercase tracking-wider">
                {group.title}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {group.features.map((feature) => {
                  const isEnabled =
                    subscription.features[
                      feature.key as keyof typeof subscription.features
                    ];
                  return (
                    <div
                      key={feature.key}
                      className="flex items-center gap-2 text-sm"
                    >
                      {isEnabled ? (
                        <Check className="w-4 h-4 text-primary-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-secondary-blue-400" />
                      )}
                      <span
                        className={
                          isEnabled ? 'text-white' : 'text-secondary-blue-400'
                        }
                      >
                        {feature.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Numeric Limits */}
          <div className="pt-4 border-t border-secondary-blue-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-blue-300">
                Devices Per User
              </span>
              <Badge variant="info">
                {subscription.features.devicesPerUserLimit}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-blue-300">
                Staff Login Limit
              </span>
              <Badge variant="info">
                {subscription.features.staffLoginLimit}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-blue-300">
                Trainer Login Limit
              </span>
              <Badge variant="info">
                {subscription.features.trainerLoginLimit}
              </Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
