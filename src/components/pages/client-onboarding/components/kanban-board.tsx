'use client';

import { useState } from 'react';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
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
  MapPin,
  Play,
  Zap,
} from 'lucide-react';

import type { ClientStatus, OnboardingClient } from '../types';

/* ── Column definitions ─────────────────────────────── */
interface ColDef {
  id: ClientStatus;
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
    id: 'In Progress',
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
    id: 'Pending Activation',
    label: 'Pending Activation',
    icon: <Zap className="w-3.5 h-3.5" />,
    countBg: 'bg-amber-500/15',
    countText: 'text-amber-400',
    headerBorder: 'border-amber-500/30',
    dot: 'bg-amber-400',
    cardAccent: 'hover:border-amber-500/40',
    progressBar: 'bg-amber-400',
  },
  {
    id: 'Completed',
    label: 'Completed',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    countBg: 'bg-emerald-500/15',
    countText: 'text-emerald-400',
    headerBorder: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    cardAccent: 'hover:border-emerald-500/40',
    progressBar: 'bg-emerald-500',
  },
];

/* ── Props ──────────────────────────────────────────── */
export interface KanbanBoardProps {
  clients: OnboardingClient[];
  onSelectClient: (c: OnboardingClient) => void;
  onResumeClient: (c: OnboardingClient) => void;
  getStatusVariant: (s: string) => 'success' | 'warning' | 'info' | 'error';
}

/* ── Main Board ─────────────────────────────────────── */
export function KanbanBoard({
  clients,
  onSelectClient,
  onResumeClient,
}: KanbanBoardProps) {
  const [items, setItems] = useState<OnboardingClient[]>(clients);
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const activeCard =
    activeId !== null ? (items.find((c) => c.id === activeId) ?? null) : null;

  const colItems = (status: ClientStatus) =>
    items.filter((c) => c.status === status);
  const colDef = (status: ClientStatus) =>
    COLUMNS.find((c) => c.id === status)!;

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as number);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const activeCard = items.find((c) => c.id === active.id);
    if (!activeCard) return;

    // Check if over is a column ID directly
    const overColId = COLUMNS.find((col) => col.id === over.id)?.id;

    if (overColId && overColId !== activeCard.status) {
      setItems((prev) =>
        prev.map((c) =>
          c.id === activeCard.id ? { ...c, status: overColId } : c,
        ),
      );
      return;
    }

    // Check if over a card
    const overCard = items.find((c) => c.id === over.id);
    if (overCard && overCard.status !== activeCard.status) {
      setItems((prev) =>
        prev.map((c) =>
          c.id === activeCard.id ? { ...c, status: overCard.status } : c,
        ),
      );
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over) return;
    if (active.id !== over.id) {
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
      onDragOver={handleDragOver}
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
  cards: OnboardingClient[];
  colIdx: number;
  onSelectClient: (c: OnboardingClient) => void;
  onResumeClient: (c: OnboardingClient) => void;
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
  client: OnboardingClient;
  col: ColDef;
  onView: (c: OnboardingClient) => void;
  onResume: (c: OnboardingClient) => void;
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
  client: OnboardingClient;
  col: ColDef;
  onView: (c: OnboardingClient) => void;
  onResume: (c: OnboardingClient) => void;
  isDragging: boolean;
  dragListeners?: ReturnType<typeof useSortable>['listeners'];
}) {
  const pct = Math.round((client.step / client.totalSteps) * 100);

  const tierBadge: Record<string, string> = {
    Starter: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
    Professional:
      'bg-primary-green-500/10 text-primary-green-400 border-primary-green-500/25',
    Enterprise: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
  };

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
          {client.name.substring(0, 2).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm leading-tight truncate">
            {client.name}
          </p>
          <p className="text-[11px] text-secondary-blue-200 truncate mt-0.5">
            {client.owner}
          </p>
        </div>

        {/* Drag handle */}
        <button
          {...dragListeners}
          className="text-secondary-blue-400 hover:text-secondary-blue-200 cursor-grab active:cursor-grabbing mt-0.5 touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Email */}
      <p className="text-[11px] text-secondary-blue-300 mb-3 truncate">
        {client.email}
      </p>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-secondary-blue-400 font-medium">
            Step {client.step} of {client.totalSteps}
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

      {/* Footer: tier + meta + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierBadge[client.subscriptionTier]}`}
          >
            {client.subscriptionTier}
          </span>
          {client.subGyms > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-secondary-blue-300">
              <MapPin className="w-2.5 h-2.5" />
              {client.subGyms}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {client.status !== 'Completed' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResume(client);
              }}
              className={`p-1.5 rounded-lg ${col.countBg} ${col.countText} hover:opacity-80 transition-opacity`}
              title="Resume"
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
          >
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center gap-1 mt-3 pt-2.5 border-t border-secondary-blue-400">
        <Calendar className="w-2.5 h-2.5 text-secondary-blue-400" />
        <span className="text-[10px] text-secondary-blue-400">
          {new Date(client.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
        {client.subGyms > 0 && (
          <>
            <span className="text-secondary-blue-500 mx-1">·</span>
            <Building2 className="w-2.5 h-2.5 text-secondary-blue-400" />
            <span className="text-[10px] text-secondary-blue-400">
              {client.subGyms} gym{client.subGyms > 1 ? 's' : ''}
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}
