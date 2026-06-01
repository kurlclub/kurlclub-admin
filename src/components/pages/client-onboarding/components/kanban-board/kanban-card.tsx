'use client';

import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { ArrowRight, GripVertical, MapPin, Play } from 'lucide-react';

import { useAdminFormData } from '@/hooks/use-admin-form-data';
import { formatOnboardingDate } from '@/lib/utils/onboarding.utils';
import { useAuth } from '@/providers/auth-provider';
import type { ColDef, OnboardingRecord } from '@/types/onboarding';

interface KanbanCardProps {
  client: OnboardingRecord;
  col: ColDef;
  onView: (c: OnboardingRecord) => void;
  onResume: (c: OnboardingRecord) => void;
  isDragging: boolean;
  dragListeners?: DraggableSyntheticListeners;
}

export function KanbanCard({
  client,
  col,
  onView,
  onResume,
  isDragging,
  dragListeners,
}: KanbanCardProps) {
  const { user } = useAuth();
  const canSeeAssignedAdmin = user?.userRole === 'super_admin';
  const { adminFormData } = useAdminFormData();

  const assignedAdminName = (() => {
    if (!adminFormData?.adminUsers || client.assignedAdminId == null)
      return null;
    return (
      adminFormData.adminUsers.find((a) => a.id === client.assignedAdminId)
        ?.name ?? null
    );
  })();

  const data = client.data as Record<string, unknown> | null;
  const gymName = typeof data?.gymName === 'string' ? data.gymName : '';
  const primaryLabel = gymName || client.contactName || client.email || '';
  const secondaryLabel = gymName
    ? client.contactName || client.email || client.phoneNumber || ''
    : client.email || client.phoneNumber || '';

  const gymLocation =
    typeof data?.gymLocation === 'string' ? data.gymLocation : '';
  const gymCountry = typeof data?.country === 'string' ? data.country : '';
  const locationLine = [gymLocation, gymCountry].filter(Boolean).join(', ');
  const createdAtFormatted = formatOnboardingDate(client.createdAt);

  const initials = primaryLabel
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  const isTerminal =
    client.status === 'completed' || client.status === 'cancelled';

  return (
    <motion.div
      layout
      initial={false}
      animate={{ rotate: isDragging ? 1.5 : 0, scale: isDragging ? 1.02 : 1 }}
      className={`
        group relative rounded-xl border-l-[3px] ${col.cardBorder}
        border border-secondary-blue-400/20 bg-secondary-blue-700/40
        px-4 py-3.5 transition-colors duration-150 cursor-default
        hover:bg-secondary-blue-700/60 hover:border-secondary-blue-300/25
        ${isDragging ? 'opacity-90 ring-1 ring-secondary-blue-300/30' : ''}
      `}
    >
      {/* ── Top row: avatar + name + drag handle ── */}
      <div className="flex items-start gap-2.5 mb-2.5">
        {/* Avatar */}
        <div
          className={`flex-none w-8 h-8 rounded-full flex items-center justify-center
            text-[11px] font-bold select-none
            ${col.accentBg} ${col.accentText} border ${col.accentBorder}`}
        >
          {initials || '?'}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-[13px] leading-snug truncate">
            {primaryLabel || '—'}
          </p>
          {secondaryLabel && (
            <p className="text-xs text-secondary-blue-300 truncate mt-0.5">
              {secondaryLabel}
            </p>
          )}
        </div>

        {/* Drag handle */}
        <button
          {...dragListeners}
          className="flex-none text-secondary-blue-500 hover:text-secondary-blue-300
            cursor-grab active:cursor-grabbing touch-none mt-0.5
            opacity-0 group-hover:opacity-100 transition-opacity"
          type="button"
          aria-label="Drag card"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Location + date ── */}
      {(locationLine || createdAtFormatted) && (
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {locationLine && (
            <p className="text-[11px] text-secondary-blue-400 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-none" />
              {locationLine}
            </p>
          )}
          {createdAtFormatted && (
            <p className="text-[11px] text-secondary-blue-500 flex-none">
              {createdAtFormatted}
            </p>
          )}
        </div>
      )}

      {/* ── Notes ── */}
      {client.notes && (
        <p className="text-[11px] text-secondary-blue-400/80 line-clamp-1 italic mb-2.5">
          {client.notes}
        </p>
      )}

      {/* ── Footer: assigned admin + actions ── */}
      <div className="flex items-center justify-between pt-2.5 border-t border-secondary-blue-600/50">
        <div className="min-w-0 flex-1">
          {canSeeAssignedAdmin && assignedAdminName && (
            <p className="text-[10px] text-secondary-blue-500 truncate">
              {assignedAdminName}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-none">
          {!isTerminal && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResume(client);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md
                text-[10px] font-semibold ${col.accentBg} ${col.accentText}
                hover:opacity-80 transition-opacity`}
              type="button"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              Resume
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(client);
            }}
            className="flex items-center gap-1 text-[10px] font-medium
              text-secondary-blue-400 hover:text-white transition-colors"
            type="button"
          >
            View
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
