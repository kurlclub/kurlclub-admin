'use client';

import { Badge, Button } from '@kurlclub/ui-components';
import { Building2, Edit, Eye, Star, Trash2, Users } from 'lucide-react';

import type { Subscription } from '@/types/subscription';

interface SubscriptionCardProps {
  subscription: Subscription;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function SubscriptionCard({
  subscription,
  onView,
  onEdit,
  onDelete,
}: SubscriptionCardProps) {
  return (
    <div className="group relative bg-secondary-blue-500 border border-secondary-blue-400 rounded-3xl p-6 hover:border-primary-green-500/40 transition-all">
      {subscription.isPopular && (
        <div className="absolute -top-3 left-6">
          <Badge className="bg-primary-green-500 text-primary-blue-500 gap-1">
            <Star className="w-3 h-3 fill-current" />
            Popular
          </Badge>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white">{subscription.name}</h3>
          {subscription.badge && (
            <span className="text-xs text-primary-green-400 font-medium">
              {subscription.badge}
            </span>
          )}
          <p className="text-sm text-secondary-blue-200 mt-1">
            {subscription.subtitle}
          </p>
        </div>

        <div className="py-4 border-y border-secondary-blue-400">
          <div className="text-3xl font-bold text-white">
            ₹{subscription.monthlyPrice}
            <span className="text-sm text-secondary-blue-300 font-normal">
              /month
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-secondary-blue-200">
            <Users className="w-4 h-4" />
            <span>Up to {subscription.limits.maxMembers} members</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary-blue-200">
            <Building2 className="w-4 h-4" />
            <span>Up to {subscription.limits.maxClubs} clubs</span>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(subscription.id)}
            className="flex-1 gap-2"
          >
            <Eye className="w-4 h-4" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(subscription.id)}
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(subscription.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
