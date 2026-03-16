'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  GripVertical,
  PauseCircle,
  Play,
  Users,
  XCircle,
} from 'lucide-react';

import type { OnboardingRecord, OnboardingStatus } from '../types';
import { getStatusStep } from '../utils';

/* ── Column definitions ─────────────────────────────── */
interface ColDef {
  id: OnboardingStatus;
  label: string;
  icon: React.ReactNode;
  countBg: string;
  countText: string;
  headerBorder: string;
  dot: string;
  cardAccent: string;
  progressBar: string;
}

const COLUMNS: ColDef[] = [
  {
    id: 'lead',
    label: 'Leads',
    icon: <Users className="w-3.5 h-3.5" />,
    countBg: 'bg-sky-500/15',
    countText: 'text-sky-400',
    headerBorder: 'border-sky-500/30',
    dot: 'bg-sky-400',
    cardAccent: 'hover:border-sky-500/40',
    progressBar: 'bg-sky-500',
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    icon: <Clock className="w-3.5 h-3.5" />,
    countBg: 'bg-blue-500/15',
    countText: 'text-blue-400',
    headerBorder: 'border-blue-500/30',
    dot: 'bg-blue-400',
    cardAccent: 'hover:border-blue-500/40',
    progressBar: 'bg-blue-500',
  },
  {
    id: 'pending_review',
    label: 'Pending Review',
    icon: <PauseCircle className="w-3.5 h-3.5" />,
    countBg: 'bg-amber-500/15',
    countText: 'text-amber-400',
    headerBorder: 'border-amber-500/30',
    dot: 'bg-amber-400',
    cardAccent: 'hover:border-amber-500/40',
    progressBar: 'bg-amber-400',
  },
  {
    id: 'on_hold',
    label: 'On Hold',
    icon: <PauseCircle className="w-3.5 h-3.5" />,
    countBg: 'bg-purple-500/15',
    countText: 'text-purple-400',
    headerBorder: 'border-purple-500/30',
    dot: 'bg-purple-400',
    cardAccent: 'hover:border-purple-500/40',
    progressBar: 'bg-purple-500',
  },
  {
    id: 'completed',
    label: 'Completed',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    countBg: 'bg-emerald-500/15',
    countText: 'text-emerald-400',
    headerBorder: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    cardAccent: 'hover:border-emerald-500/40',
    progressBar: 'bg-emerald-500',
  },
  {
    id: 'cancelled',
    label: 'Cancelled',
    icon: <XCircle className="w-3.5 h-3.5" />,
    countBg: 'bg-rose-500/15',
    countText: 'text-rose-400',
    headerBorder: 'border-rose-500/30',
    dot: 'bg-rose-400',
    cardAccent: 'hover:border-rose-500/40',
    progressBar: 'bg-rose-500',
  },
];

/* ── Props ──────────────────────────────────────────── */
export interface KanbanBoardProps {
  clients: OnboardingRecord[];
  onSelectClient: (c: OnboardingRecord) => void;
  onResumeClient: (c: OnboardingRecord) => void;
  onStatusChange?: (client: OnboardingRecord, status: OnboardingStatus) => void;
}

/* ── Main Board ─────────────────────────────────────── */
export function KanbanBoard({
  clients,
  onSelectClient,
  onResumeClient,
  onStatusChange,
}: KanbanBoardProps) {
  const [items, setItems] = useState<OnboardingRecord[]>(clients);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    setItems(clients);
  }, [clients]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const activeCard =
    activeId !== null ? (items.find((c) => c.id === activeId) ?? null) : null;

  const colItems = (status: OnboardingStatus) =>
    items.filter((c) => c.status === status);
  const colDef = (status: OnboardingStatus) =>
    COLUMNS.find((c) => c.id === status)!;

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as number);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over) return;

    const activeCard = items.find((c) => c.id === active.id);
    if (!activeCard) return;

    const overColumnId = COLUMNS.find((col) => col.id === over.id)?.id;
    const overCard = items.find((c) => c.id === over.id);

    const nextStatus = overColumnId ?? overCard?.status ?? activeCard.status;

    if (nextStatus !== activeCard.status) {
      setItems((prev) =>
        prev.map((c) =>
          c.id === activeCard.id ? { ...c, status: nextStatus } : c,
        ),
      );
      onStatusChange?.(activeCard, nextStatus);
    }

    if (
      overCard &&
      activeCard.status === overCard.status &&
      active.id !== over.id
    ) {
      setItems((prev) => {
        const oldIdx = prev.findIndex((c) => c.id === active.id);
        const newIdx = prev.findIndex((c) => c.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Horizontal scroll container for columns */}
      <div className="flex gap-5 items-start overflow-x-auto pb-4">
        {COLUMNS.map((col, colIdx) => {
          const cards = colItems(col.id);
          return (
            <KanbanColumn
              key={col.id}
              col={col}
              cards={cards}
              colIdx={colIdx}
              onSelectClient={onSelectClient}
              onResumeClient={onResumeClient}
            />
          );
        })}
      </div>

      {/* Drag overlay — ghost card */}
      <DragOverlay>
        {activeCard ? (
          <KanbanCard
            client={activeCard}
            col={colDef(activeCard.status)}
            onView={() => {}}
            onResume={() => {}}
            isDragging={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/* ── Kanban Column ────────────────────────────────── */
function KanbanColumn({
  col,
  cards,
  colIdx,
  onSelectClient,
  onResumeClient,
}: {
  col: ColDef;
  cards: OnboardingRecord[];
  colIdx: number;
  onSelectClient: (c: OnboardingRecord) => void;
  onResumeClient: (c: OnboardingRecord) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: col.id,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: colIdx * 0.08, duration: 0.3, ease: 'easeOut' }}
      className="flex-none w-[320px] flex flex-col gap-3"
    >
      {/* Column header */}
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-xl bg-secondary-blue-500 border ${col.headerBorder}`}
      >
        <div
          className={`flex items-center gap-2 ${col.countText} font-semibold text-sm`}
        >
          <span className={`w-2 h-2 rounded-full ${col.dot}`} />
          {col.icon}
          <span>{col.label}</span>
        </div>
        <span
          className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded-full ${col.countBg} ${col.countText}`}
        >
          {cards.length}
        </span>
      </div>

      {/* Card list */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2.5 min-h-[400px] rounded-xl transition-colors ${
          isOver
            ? 'bg-secondary-blue-500/30 border-2 border-dashed border-secondary-blue-300'
            : ''
        }`}
      >
        <SortableContext
          id={col.id}
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((client) => (
            <SortableCard
              key={client.id}
              client={client}
              col={col}
              onView={onSelectClient}
              onResume={onResumeClient}
              isDragging={false}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full rounded-xl border-2 border-dashed border-secondary-blue-400/30 bg-secondary-blue-600/20 py-12">
            <div className="w-12 h-12 rounded-full bg-secondary-blue-500/50 flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-secondary-blue-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
            <p className="text-secondary-blue-300 text-xs font-medium">
              Drop cards here
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SortableCard({
  client,
  col,
  onView,
  onResume,
}: {
  client: OnboardingRecord;
  col: ColDef;
  onView: (c: OnboardingRecord) => void;
  onResume: (c: OnboardingRecord) => void;
  isDragging: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: client.id,
    data: { sortable: { containerId: client.status } },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <KanbanCard
        client={client}
        col={col}
        onView={onView}
        onResume={onResume}
        isDragging={isDragging}
        dragListeners={listeners}
      />
    </div>
  );
}

/* ── Card ───────────────────────────────────────────── */
function KanbanCard({
  client,
  col,
  onView,
  onResume,
  isDragging,
  dragListeners,
}: {
  client: OnboardingRecord;
  col: ColDef;
  onView: (c: OnboardingRecord) => void;
  onResume: (c: OnboardingRecord) => void;
  isDragging: boolean;
  dragListeners?: ReturnType<typeof useSortable>['listeners'];
}) {
  const { step, totalSteps } = getStatusStep(client.status);
  const pct = Math.round((step / totalSteps) * 100);
  const metaBadge =
    'bg-primary-green-500/10 text-primary-green-400 border-primary-green-500/25';
  const primaryLabel =
    client.data?.gymName || client.contactName || client.email || '';
  const secondaryLabel = client.data?.gymName
    ? client.contactName || client.email || ''
    : client.contactName
      ? client.email || ''
      : '';
  const createdAt = client.createdAt ? new Date(client.createdAt) : null;
  const createdLabel =
    createdAt && !Number.isNaN(createdAt.getTime())
      ? createdAt.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '';
  const showEmailLine = client.email && client.email !== primaryLabel;

  return (
    <motion.div
      layout
      initial={false}
      animate={{ rotate: isDragging ? 1.5 : 0, scale: isDragging ? 1.02 : 1 }}
      className={`
        bg-secondary-blue-500 border border-secondary-blue-400 rounded-xl p-4
        ${col.cardAccent} transition-colors duration-150
        ${isDragging ? 'shadow-2xl shadow-black/40 border-secondary-blue-300' : 'shadow-sm'}
      `}
    >
      {/* Top: Avatar + Name + Drag handle */}
      <div className="flex items-start gap-3 mb-3">
        {/* Initials avatar */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0 ${col.countBg} ${col.countText} border ${col.headerBorder}`}
        >
          {primaryLabel ? primaryLabel.substring(0, 2).toUpperCase() : ''}
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
        </div>

        {/* Drag handle */}
        <button
          {...dragListeners}
          className="text-secondary-blue-400 hover:text-secondary-blue-200 cursor-grab active:cursor-grabbing mt-0.5 touch-none"
          type="button"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Email */}
      {showEmailLine ? (
        <p className="text-[11px] text-secondary-blue-300 mb-3 truncate">
          {client.email}
        </p>
      ) : null}

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-secondary-blue-400 font-medium">
            Step {step} of {totalSteps}
          </span>
          <span className={`text-[10px] font-bold ${col.countText}`}>
            {pct}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-secondary-blue-400 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${col.progressBar}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          />
        </div>
      </div>

      {/* Footer: meta + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {client.data?.country ? (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${metaBadge}`}
            >
              {client.data.country}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          {client.status !== 'completed' && client.status !== 'cancelled' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResume(client);
              }}
              className={`p-1.5 rounded-lg ${col.countBg} ${col.countText} hover:opacity-80 transition-opacity`}
              title="Resume"
              type="button"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(client);
            }}
            className="p-1.5 rounded-lg bg-secondary-blue-400 text-secondary-blue-100 hover:bg-secondary-blue-300 hover:text-white transition-colors"
            title="View"
            type="button"
          >
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Date */}
      {(createdLabel || client.data?.gymLocation) && (
        <div className="flex items-center gap-1 mt-3 pt-2.5 border-t border-secondary-blue-400">
          {createdLabel ? (
            <>
              <Calendar className="w-2.5 h-2.5 text-secondary-blue-400" />
              <span className="text-[10px] text-secondary-blue-400">
                {createdLabel}
              </span>
            </>
          ) : null}
          {client.data?.gymLocation ? (
            <>
              {createdLabel ? (
                <span className="text-secondary-blue-500 mx-1">·</span>
              ) : null}
              <Building2 className="w-2.5 h-2.5 text-secondary-blue-400" />
              <span className="text-[10px] text-secondary-blue-400">
                {client.data.gymLocation}
              </span>
            </>
          ) : null}
        </div>
      )}
    </motion.div>
  );
}
