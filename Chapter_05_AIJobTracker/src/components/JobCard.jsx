import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2, ExternalLink, Clock, FileText, GripVertical } from 'lucide-react';
import { getColumn, daysSince } from '../lib/constants';

export default function JobCard({ job, onEdit, onDelete }) {
  const col = getColumn(job.status);
  const days = daysSince(job.dateApplied);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id, data: { status: job.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-150 ${isDragging ? 'scale-105 shadow-xl z-50' : ''}`}
    >
      {/* Status accent left border */}
      <div
        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
        style={{ backgroundColor: col.color }}
      />

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 right-3 cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Drag to move"
      >
        <GripVertical size={14} />
      </div>

      <div className="pl-4 pr-8 pt-3 pb-3">
        {/* Company + Role */}
        <div className="mb-2 pr-2">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-tight truncate">
            {job.company}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{job.role}</p>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {job.resumeUsed && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              <FileText size={9} />
              {job.resumeUsed}
            </span>
          )}
          {job.salaryRange && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
              {job.salaryRange}
            </span>
          )}
          {days !== null && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
              <Clock size={9} />
              {days === 0 ? 'Today' : `${days}d ago`}
            </span>
          )}
        </div>

        {/* Notes preview */}
        {job.notes && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mb-2">{job.notes}</p>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/50">
          {/* LinkedIn link */}
          {job.linkedinUrl ? (
            <a
              href={job.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-medium text-sky-600 dark:text-sky-400 hover:underline"
              title="Open LinkedIn job"
            >
              <ExternalLink size={10} />
              View Job
            </a>
          ) : (
            <span />
          )}

          {/* Edit / Delete — visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              id={`edit-job-${job.id}`}
              onClick={() => onEdit(job)}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Edit"
            >
              <Pencil size={12} />
            </button>
            <button
              id={`delete-job-${job.id}`}
              onClick={() => onDelete(job)}
              className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
