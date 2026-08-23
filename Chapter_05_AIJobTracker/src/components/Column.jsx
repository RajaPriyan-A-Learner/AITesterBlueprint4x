import { useState, useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Plus, ArrowUpDown } from 'lucide-react';
import JobCard from './JobCard';

export default function Column({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onQuickMove,
  onToggleChecklist,
  onOpenATS,
  onOpenOutreach,
}) {
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const sorted = useMemo(() => {
    return [...cards].sort((a, b) => {
      const da = new Date(a.dateApplied || 0).getTime();
      const db = new Date(b.dateApplied || 0).getTime();
      return sortOrder === 'newest' ? db - da : da - db;
    });
  }, [cards, sortOrder]);

  return (
    <div className="flex flex-col w-full min-w-0">
      {/* Column header */}
      <div
        className="flex items-center justify-between px-3.5 py-2.5 rounded-t-xl border border-b-0 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        style={{ borderTop: `3px solid ${column.color}` }}
      >
        <div className="flex items-center gap-2">
          {/* Color dot */}
          <span
            className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: column.color }}
          />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{column.label}</span>
          {/* Count badge */}
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${column.badge}`}
          >
            {cards.length}
          </span>
        </div>

        {/* Sort toggle */}
        <button
          onClick={() => setSortOrder((o) => (o === 'newest' ? 'oldest' : 'newest'))}
          title={sortOrder === 'newest' ? 'Showing newest first' : 'Showing oldest first'}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <ArrowUpDown size={12} />
        </button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto px-2 py-2 rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 min-h-[200px] max-h-[calc(100vh-210px)] space-y-2 transition-colors ${isOver ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-700' : ''}`}
      >
        <SortableContext items={sorted.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {sorted.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
              onQuickMove={onQuickMove}
              onToggleChecklist={onToggleChecklist}
              onOpenATS={onOpenATS}
              onOpenOutreach={onOpenOutreach}
            />
          ))}
        </SortableContext>

        {sorted.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs text-slate-400 dark:text-slate-600 italic">
            Drop cards here
          </div>
        )}
      </div>

      {/* Add card button */}
      <button
        id={`add-card-${column.id}`}
        onClick={() => onAddCard(column.id)}
        className="mt-2 flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors w-full"
      >
        <Plus size={13} />
        Add card
      </button>
    </div>
  );
}
