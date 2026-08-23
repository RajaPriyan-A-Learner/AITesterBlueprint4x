import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { useState } from 'react';
import { COLUMNS, triggerOfferConfetti } from '../lib/constants';
import Column from './Column';
import JobCard from './JobCard';

export default function KanbanBoard({
  jobs,
  onMoveJob,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onToggleChecklist,
  onOpenATS,
  onOpenOutreach,
}) {
  const [activeJob, setActiveJob] = useState(null);
  const [mobileActiveStage, setMobileActiveStage] = useState('all'); // 'all' | columnId

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = ({ active }) => {
    const job = jobs.find((j) => j.id === active.id);
    setActiveJob(job || null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveJob(null);
    if (!over) return;

    const draggedJob = jobs.find((j) => j.id === active.id);
    if (!draggedJob) return;

    // Determine target column
    const targetColumnId = COLUMNS.some((c) => c.id === over.id)
      ? over.id
      : jobs.find((j) => j.id === over.id)?.status;

    if (!targetColumnId) return;

    if (draggedJob.status !== targetColumnId) {
      if (targetColumnId === 'offer') {
        triggerOfferConfetti();
      }
      onMoveJob(draggedJob.id, targetColumnId);
    }
  };

  const handleQuickMove = (jobId, newStatus) => {
    if (newStatus === 'offer') {
      triggerOfferConfetti();
    }
    onMoveJob(jobId, newStatus);
  };

  const handleDragCancel = () => setActiveJob(null);

  // Filter columns on mobile if specific tab is selected
  const displayedColumns = mobileActiveStage === 'all'
    ? COLUMNS
    : COLUMNS.filter((c) => c.id === mobileActiveStage);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="max-w-screen-2xl mx-auto w-full px-3 sm:px-6 pt-1 pb-8">
        {/* Mobile Stage Selector Tabs (Shown on small screens < 768px) */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2 select-none no-scrollbar">
          <button
            type="button"
            onClick={() => setMobileActiveStage('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              mobileActiveStage === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            All Columns ({jobs.length})
          </button>
          {COLUMNS.map((col) => {
            const count = jobs.filter((j) => j.status === col.id).length;
            const isSelected = mobileActiveStage === col.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setMobileActiveStage(col.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? `${col.badge} ring-2 ring-indigo-500/50 shadow-xs scale-102`
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: col.color }}
                />
                <span>{col.label}</span>
                <span className="opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Adaptive Layout:
            - On Desktop (>= 1280px): Symmetrical 6-Column Grid
            - On Tablet (768px - 1279px): Smooth Horizontal Snap-Scroll Track with Comfortable Widths
            - On Mobile (< 768px): Single-Column or Multi-Column Feed
        */}
        <div className="hidden xl:grid xl:grid-cols-6 gap-3.5 items-start">
          {COLUMNS.map((col) => {
            const colJobs = jobs.filter((j) => j.status === col.id);
            return (
              <Column
                key={col.id}
                column={col}
                cards={colJobs}
                onAddCard={onAddCard}
                onEditCard={onEditCard}
                onDeleteCard={onDeleteCard}
                onQuickMove={handleQuickMove}
                onToggleChecklist={onToggleChecklist}
                onOpenATS={onOpenATS}
                onOpenOutreach={onOpenOutreach}
              />
            );
          })}
        </div>

        {/* Tablet & Mobile Track Layout */}
        <div className="xl:hidden flex md:overflow-x-auto gap-3.5 pb-4 md:snap-x md:snap-mandatory flex-col md:flex-row items-stretch">
          {displayedColumns.map((col) => {
            const colJobs = jobs.filter((j) => j.status === col.id);
            return (
              <div
                key={col.id}
                className="w-full md:w-80 md:flex-shrink-0 md:snap-start"
              >
                <Column
                  column={col}
                  cards={colJobs}
                  onAddCard={onAddCard}
                  onEditCard={onEditCard}
                  onDeleteCard={onDeleteCard}
                  onQuickMove={handleQuickMove}
                  onToggleChecklist={onToggleChecklist}
                  onOpenATS={onOpenATS}
                  onOpenOutreach={onOpenOutreach}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Ghost card shown while dragging */}
      <DragOverlay>
        {activeJob ? (
          <div className="opacity-90 rotate-2 scale-105">
            <JobCard job={activeJob} onEdit={() => {}} onDelete={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
