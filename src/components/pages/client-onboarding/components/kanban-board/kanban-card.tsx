import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { ArrowRight, GripVertical, Play } from 'lucide-react';

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
  const data = client.data as Record<string, unknown> | null;
  const gymName = typeof data?.gymName === 'string' ? data.gymName : '';
  const primaryLabel = gymName || client.contactName || client.email || '';
  const secondaryLabel = gymName
    ? client.contactName || client.email || client.phoneNumber || ''
    : client.email || client.phoneNumber || '';
  const showContactName =
    client.contactName && primaryLabel !== client.contactName;
  const showEmail = client.email && primaryLabel !== client.email;
  const showPhone = client.phoneNumber && secondaryLabel !== client.phoneNumber;

  const dataEntries: Array<[string, string]> = [];
  const pushEntry = (key: string, value: unknown) => {
    if (value === null || value === undefined) return;
    if (typeof value === 'string') {
      if (!value.trim()) return;
      dataEntries.push([key, value]);
      return;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      dataEntries.push([key, String(value)]);
    }
  };

  pushEntry('gymLocation', data?.gymLocation ?? data?.location);
  pushEntry('gymContactNumber', data?.gymContactNumber);
  pushEntry('country', data?.country);
  pushEntry('region', data?.region);
  pushEntry('plan', data?.plan);
  pushEntry('source', data?.source);
  pushEntry('expectedMembers', data?.expectedMembers);
  pushEntry('portalUsername', client.portalUsername);
  pushEntry('assignedAdminId', client.assignedAdminId);
  pushEntry('completedUserId', client.completedUserId);

  const timestamps: Array<[string, string]> = [];
  if (client.createdAt) timestamps.push(['createdAt', client.createdAt]);
  if (client.updatedAt) timestamps.push(['updatedAt', client.updatedAt]);
  if (client.completedAt) timestamps.push(['completedAt', client.completedAt]);

  return (
    <motion.div
      layout
      initial={false}
      animate={{ rotate: isDragging ? 1.5 : 0, scale: isDragging ? 1.02 : 1 }}
      className={`
        bg-secondary-blue-600/80 border border-secondary-blue-400/40 ${col.cardBorder} border-l-4
        rounded-2xl p-4 transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-lg hover:border-secondary-blue-300/60
        ${isDragging ? 'shadow-2xl shadow-black/40 border-secondary-blue-300/70' : 'shadow-sm'}
      `}
    >
      {/* Top: Avatar + Name + Drag handle */}
      <div className="flex items-start gap-3 mb-3">
        {/* ID avatar */}
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-bold shrink-0 border ${col.accentBorder} ${col.accentBg} ${col.accentText}`}
        >
          {client.id}
        </div>

        <div className="flex-1 min-w-0">
          {primaryLabel ? (
            <p className="font-semibold text-white text-sm leading-tight truncate">
              {primaryLabel}
            </p>
          ) : null}
          {secondaryLabel ? (
            <p className="text-[11px] text-secondary-blue-200 truncate mt-0.5">
              {secondaryLabel}
            </p>
          ) : null}
          <div className="mt-1 space-y-0.5 text-[10px] text-secondary-blue-300">
            {showContactName ? (
              <p className="truncate">contactName: {client.contactName}</p>
            ) : null}
            {showEmail ? (
              <p className="truncate">email: {client.email}</p>
            ) : null}
            {showPhone ? (
              <p className="truncate">phoneNumber: {client.phoneNumber}</p>
            ) : null}
          </div>
        </div>

        {/* Drag handle */}
        <button
          {...dragListeners}
          className="text-secondary-blue-300 hover:text-secondary-blue-100 cursor-grab active:cursor-grabbing mt-0.5 touch-none"
          type="button"
          aria-label="Drag card"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      {client.notes ? (
        <p className="text-[11px] text-secondary-blue-200/80 mb-3 truncate">
          {client.notes}
        </p>
      ) : null}

      {/* Data chips */}
      {dataEntries.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {dataEntries.map(([key, value]) => (
            <span
              key={`${key}-${value}`}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-secondary-blue-400/40 bg-secondary-blue-700/50 text-secondary-blue-200 max-w-50 truncate"
              title={`${key}: ${value}`}
            >
              {key}: {value}
            </span>
          ))}
        </div>
      ) : null}

      {timestamps.length > 0 ? (
        <div className="mb-3 text-[10px] text-secondary-blue-300 space-y-0.5">
          {timestamps.map(([key, value]) => (
            <p key={`${key}-${value}`} className="truncate">
              {key}: {value}
            </p>
          ))}
        </div>
      ) : null}

      {/* Footer: actions */}
      <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-secondary-blue-400/40">
        <div className="flex items-center gap-1">
          {client.status !== 'completed' && client.status !== 'cancelled' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResume(client);
              }}
              className={`px-2.5 py-1 rounded-lg border ${col.accentBorder} ${col.accentBg} ${col.accentText} text-[10px] font-semibold hover:opacity-90 transition-opacity`}
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
            className="px-2.5 py-1 rounded-lg bg-secondary-blue-500/80 text-secondary-blue-100 hover:bg-secondary-blue-400 hover:text-white text-[10px] font-semibold transition-colors"
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
