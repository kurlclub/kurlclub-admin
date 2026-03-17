'use client';

import { useEffect, useState } from 'react';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import type { OnboardingRecord, OnboardingStatus } from '@/types/onboarding';

import { COLUMNS } from './constants';
import { KanbanCard } from './kanban-card';
import { KanbanColumn } from './kanban-column';

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
      {/* Board shell */}
      <div className="relative rounded-3xl border border-secondary-blue-400/30 bg-secondary-blue-700/40 p-4 md:p-5 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 55%), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 28px 28px, 28px 28px',
            backgroundPosition: 'center, top left, top left',
          }}
        />

        {/* Horizontal scroll container for columns */}
        <div className="relative flex gap-5 items-start overflow-x-auto pb-4 pr-2">
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
