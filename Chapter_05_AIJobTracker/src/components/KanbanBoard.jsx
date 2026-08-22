import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { COLUMNS } from '../lib/constants';
import Column from './Column';
import JobCard from './JobCard';

export default function KanbanBoard({
  jobs,
  onMoveJob,
  onUpdateJob,
  onAddCard,
  onEditCard,
  onDeleteCard,
}) {
  const [activeJob, setActiveJob] = useState(null);

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
    // `over.id` can be a column id (string) or a job id (number)
    const targetColumnId = COLUMNS.some((c) => c.id === over.id)
      ? over.id
      : jobs.find((j) => j.id === over.id)?.status;

    if (!targetColumnId) return;

    if (draggedJob.status !== targetColumnId) {
      // Move to different column
      onMoveJob(draggedJob.id, targetColumnId);
    }
    // Within-column reordering handled by SortableContext automatically
  };

  const handleDragCancel = () => setActiveJob(null);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 pb-4 overflow-x-auto px-4 sm:px-6 pt-4 min-h-0">
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
            />
          );
        })}
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
