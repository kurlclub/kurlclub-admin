import type { CSSProperties } from 'react';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

import type { OnboardingRecord } from '@/types/onboarding';
import type { ColDef } from '@/types/onboarding';

import { KanbanCard } from './kanban-card';

interface KanbanColumnProps {
  col: ColDef;
  cards: OnboardingRecord[];
  colIdx: number;
  onSelectClient: (c: OnboardingRecord) => void;
  onResumeClient: (c: OnboardingRecord) => void;
}

export function KanbanColumn({
  col,
  cards,
  colIdx,
  onSelectClient,
  onResumeClient,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: col.id,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: colIdx * 0.08, duration: 0.3, ease: 'easeOut' }}
      className="flex-none w-82.5 flex flex-col gap-3"
    >
      {/* Column header */}
      <div
        className={`relative rounded-2xl border ${col.accentBorder} bg-secondary-blue-600/70 px-3.5 py-3`}
      >
        <div
          className={`absolute left-0 top-0 h-full w-1.5 rounded-l-2xl ${col.accentSolid}`}
        />
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${col.accentBorder} ${col.accentBg} ${col.accentText}`}
            >
              {col.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">
                {col.label}
              </p>
              <p className="text-[11px] text-secondary-blue-200">
                {col.description}
              </p>
            </div>
          </div>
          <span
            className={`text-[11px] font-semibold tabular-nums px-2.5 py-1 rounded-full border ${col.accentBorder} ${col.accentBg} ${col.accentText}`}
          >
            {cards.length}
          </span>
        </div>
      </div>

      {/* Card list */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-3 min-h-120 rounded-2xl border border-secondary-blue-500/30 bg-secondary-blue-700/30 p-2.5 transition-all ${
          isOver
            ? `bg-secondary-blue-600/60 ring-2 ${col.accentRing} border-secondary-blue-300/40`
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
          <div className="flex flex-col items-center justify-center h-full rounded-xl border border-dashed border-secondary-blue-400/40 bg-secondary-blue-800/40 py-12 text-center">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border ${col.accentBorder} ${col.accentBg} ${col.accentText}`}
            >
              <span className="text-sm font-semibold">+</span>
            </div>
            <p className="text-secondary-blue-200 text-xs font-medium">
              Drag a card here to start
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

  const style: CSSProperties = {
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
