'use client';

import { useEffect, useRef, useState } from 'react';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
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
  const activeStatusRef = useRef<OnboardingStatus | null>(null);

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
    const activeCard = items.find((c) => c.id === active.id);
    activeStatusRef.current = activeCard?.status ?? null;
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    if (active.id === over.id) return;

    const overColumnId = COLUMNS.find((col) => col.id === over.id)?.id;

    setItems((prev) => {
      const activeIndex = prev.findIndex((c) => c.id === active.id);
      if (activeIndex === -1) return prev;

      const activeCard = prev[activeIndex];
      const overIndex = prev.findIndex((c) => c.id === over.id);
      const overCard = overIndex !== -1 ? prev[overIndex] : null;
      const nextStatus =
        (overColumnId as OnboardingStatus | undefined) ??
        (overCard?.status as OnboardingStatus | undefined);

      if (!nextStatus) return prev;

      const isSameStatus = activeCard.status === nextStatus;

      if (overIndex !== -1 && isSameStatus) {
        if (activeIndex === overIndex) return prev;
        return arrayMove(prev, activeIndex, overIndex);
      }

      if (overIndex === -1 && isSameStatus) return prev;

      const next = prev.filter((c) => c.id !== active.id);
      const updatedActive = isSameStatus
        ? activeCard
        : { ...activeCard, status: nextStatus };

      if (overIndex === -1) {
        let lastIndex = -1;
        next.forEach((item, idx) => {
          if (item.status === nextStatus) lastIndex = idx;
        });
        const insertIndex = lastIndex === -1 ? next.length : lastIndex + 1;
        next.splice(insertIndex, 0, updatedActive);
        return next;
      }

      const overIndexNext = next.findIndex((c) => c.id === over.id);
      const insertIndex = overIndexNext === -1 ? next.length : overIndexNext;
      next.splice(insertIndex, 0, updatedActive);
      return next;
    });
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over) {
      activeStatusRef.current = null;
      return;
    }

    const activeCard = items.find((c) => c.id === active.id);
    if (!activeCard) {
      activeStatusRef.current = null;
      return;
    }

    const originalStatus = activeStatusRef.current;
    const overColumnId = COLUMNS.find((col) => col.id === over.id)?.id;
    const overCard = items.find((c) => c.id === over.id);
    const nextStatus =
      (overColumnId as OnboardingStatus | undefined) ??
      (overCard?.status as OnboardingStatus | undefined) ??
      activeCard.status;

    if (originalStatus && nextStatus !== originalStatus) {
      if (activeCard.status !== nextStatus) {
        setItems((prev) =>
          prev.map((c) =>
            c.id === activeCard.id ? { ...c, status: nextStatus } : c,
          ),
        );
      }
      onStatusChange?.({ ...activeCard, status: nextStatus }, nextStatus);
    }
    activeStatusRef.current = null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="relative flex gap-4 items-start overflow-x-auto overflow-y-visible pb-6">
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
