'use client';

import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { ArrowRight, GripVertical, Play } from 'lucide-react';

import { useAdminFormData } from '@/hooks/use-admin-form-data';
import { useAuth } from '@/providers/auth-provider';
import type { OnboardingRecord } from '@/types/onboarding';
import type { ColDef } from '@/types/onboarding';

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
    if (!adminFormData?.adminUsers || client.assignedAdminId == null) {
      return null;
    }
    const match = adminFormData.adminUsers.find(
      (admin) => admin.id === client.assignedAdminId,
    );
    return match?.name ?? null;
  })();
  const data = client.data as Record<string, unknown> | null;
  const gymName = typeof data?.gymName === 'string' ? data.gymName : '';
  const primaryLabel = gymName || client.contactName || client.email || '';
  const secondaryLabel = gymName
    ? client.contactName || client.email || client.phoneNumber || ''
    : client.email || client.phoneNumber || '';
  const contactItems = [
    { label: 'Contact', value: client.contactName || '' },
    { label: 'Email', value: client.email || '' },
    { label: 'Phone', value: client.phoneNumber || '' },
  ].filter((item) => item.value);

  type MetaItem = { label: string; value: string; span?: 1 | 2 };
  const metaItems: MetaItem[] = [];
  const pushMeta = (label: string, value: unknown, span?: 1 | 2) => {
    if (value === null || value === undefined) return;
    if (typeof value === 'string') {
      if (!value.trim()) return;
      metaItems.push({ label, value, span });
      return;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      metaItems.push({ label, value: String(value), span });
    }
  };

  pushMeta('Club Location', data?.gymLocation ?? data?.location, 2);
  pushMeta('Club Contact', data?.gymContactNumber);
  pushMeta('Country', data?.country);
  pushMeta('Region', data?.region);
  pushMeta('Plan', data?.plan);
  pushMeta('Source', data?.source);
  pushMeta('Expected Members', data?.expectedMembers);
  pushMeta('Portal Username', client.portalUsername);
  if (
    canSeeAssignedAdmin &&
    client.assignedAdminId !== null &&
    client.assignedAdminId !== undefined
  ) {
    pushMeta(
      'Assigned to',
      assignedAdminName ? assignedAdminName : `#${client.assignedAdminId}`,
    );
  }
  if (client.completedUserId !== null && client.completedUserId !== undefined) {
    pushMeta('Completed By', `#${client.completedUserId}`);
  }

  return (
    <motion.div
      layout
      initial={false}
      animate={{ rotate: isDragging ? 1.5 : 0, scale: isDragging ? 1.02 : 1 }}
      className={`
        group relative overflow-hidden rounded-2xl p-5 transition-all duration-200
        border border-secondary-blue-400/30 ${col.cardBorder} border-l-4
        bg-linear-to-br from-secondary-blue-600/75 via-secondary-blue-700/65 to-secondary-blue-800/75
        backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.35)]
        hover:-translate-y-0.5 hover:border-secondary-blue-300/70 hover:shadow-[0_14px_36px_rgba(0,0,0,0.45)]
        ${isDragging ? 'ring-1 ring-secondary-blue-200/40 shadow-2xl shadow-black/50' : ''}
      `}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/6 to-transparent" />
      {/* Top: Name + Drag handle */}
      <div className="relative z-10 flex items-start gap-3 mb-4">
        <div className="flex-1 min-w-0">
          {primaryLabel ? (
            <p className="font-semibold text-white text-base leading-tight truncate">
              {primaryLabel}
            </p>
          ) : null}
          {secondaryLabel ? (
            <p className="text-sm text-secondary-blue-200/90 truncate mt-0.5">
              {secondaryLabel}
            </p>
          ) : null}
          {contactItems.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-secondary-blue-200/90">
              {contactItems.map((item) => (
                <span key={item.label} className="inline-flex gap-1.5">
                  <span className="text-secondary-blue-300">{item.label}:</span>
                  <span className="text-secondary-blue-100">{item.value}</span>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Drag handle */}
        <button
          {...dragListeners}
          className="text-secondary-blue-300 hover:text-white cursor-grab active:cursor-grabbing mt-0.5 touch-none opacity-0 group-hover:opacity-100 transition-opacity"
          type="button"
          aria-label="Drag card"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      {client.notes ? (
        <div className="relative z-10 mb-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-secondary-blue-300">
            Notes
          </p>
          <p className="text-sm text-secondary-blue-100/80 mt-1 line-clamp-2">
            {client.notes}
          </p>
        </div>
      ) : null}

      {/* Data chips */}
      {metaItems.length > 0 ? (
        <div className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
          {metaItems.map((item) => (
            <div
              key={`${item.label}-${item.value}`}
              className={`min-w-0 ${item.span === 2 ? 'col-span-2' : ''}`}
              title={`${item.label}: ${item.value}`}
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-secondary-blue-300">
                {item.label}
              </p>
              <p className="text-sm text-white/90 truncate">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      {/* Footer: actions */}
      <div className="relative z-10 flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-secondary-blue-400/40">
        <div className="flex items-center gap-1">
          {client.status !== 'completed' && client.status !== 'cancelled' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResume(client);
              }}
              className={`px-3 py-1 rounded-full border ${col.accentBorder} ${col.accentBg} ${col.accentText} text-[10px] font-semibold hover:opacity-90 transition-opacity`}
              title="Resume"
              type="button"
            >
              <span className="flex items-center gap-1">
                <Play className="w-2.5 h-2.5 fill-current" />
                Resume
              </span>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(client);
            }}
            className="px-3 py-1 rounded-full bg-secondary-blue-600/70 text-secondary-blue-100 hover:bg-secondary-blue-500 hover:text-white text-[10px] font-semibold transition-colors"
            title="View"
            type="button"
          >
            <span className="flex items-center gap-1">
              View
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
