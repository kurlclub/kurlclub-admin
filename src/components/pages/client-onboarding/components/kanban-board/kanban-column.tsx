import type { CSSProperties } from 'react';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

import type { ColDef, OnboardingRecord } from '@/types/onboarding';

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
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: colIdx * 0.06, duration: 0.25, ease: 'easeOut' }}
      className="flex-none w-80 flex flex-col"
    >
      {/* ── Column header ── */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-1 pb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full flex-none ${col.accentSolid}`}
          />
          <span className="text-sm font-semibold text-white">{col.label}</span>
        </div>
        <span
          className={`text-xs font-semibold tabular-nums px-2 py-0.5 rounded-md
            ${col.accentBg} ${col.accentText}`}
        >
          {cards.length}
        </span>
      </div>

      {/* ── Drop zone ── */}
      <div
        ref={setNodeRef}
        className={`relative flex flex-col gap-2.5 min-h-[480px] rounded-xl border
          border-secondary-blue-400/15 bg-secondary-blue-800/60
          p-2.5 transition-all duration-150
          ${isOver ? `ring-1 ${col.accentRing} bg-secondary-blue-700/40 border-secondary-blue-300/20` : ''}`}
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
          <div className="flex flex-col items-center justify-center flex-1 min-h-[200px] py-10 text-center">
            <p className={`text-xs font-medium ${col.accentText} opacity-60`}>
              No {col.label.toLowerCase()} yet
            </p>
            <p className="text-[11px] text-secondary-blue-500 mt-1">
              Drop a card here
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
    opacity: isDragging ? 0.12 : 1,
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
