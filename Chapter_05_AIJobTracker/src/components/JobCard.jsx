import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Pencil,
  Trash2,
  ExternalLink,
  Clock,
  GripVertical,
  ChevronDown,
  CheckCircle2,
  Target,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import {
  getColumn,
  getPriority,
  getWorkMode,
  daysSince,
  getCompanyAvatarInfo,
  COLUMNS,
  DEFAULT_CHECKLIST,
} from '../lib/constants';

export default function JobCard({
  job,
  onEdit,
  onDelete,
  onQuickMove,
  onToggleChecklist,
  onOpenATS,
  onOpenOutreach,
}) {
  const col = getColumn(job.status);
  const priority = getPriority(job.priority);
  const workMode = getWorkMode(job.workMode);
  const days = daysSince(job.dateApplied);
  const avatar = getCompanyAvatarInfo(job.company);

  const [checklistOpen, setChecklistOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job.id,
    data: { type: 'job', job },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const checklist = job.checklist || DEFAULT_CHECKLIST;
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter((t) => t.done).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Extract skills
  const skillsList = Array.isArray(job.skills) && job.skills.length > 0
    ? job.skills
    : [];

  const handleCardClick = (e) => {
    if (e.target.closest('[data-no-card-click="true"]')) return;
    onEdit(job);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleCardClick}
      className={`group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs hover:shadow-lg hover:border-indigo-300/80 dark:hover:border-indigo-600/60 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer select-none ${
        isDragging ? 'scale-105 shadow-2xl ring-2 ring-indigo-500/50 z-50 cursor-grabbing' : ''
      }`}
      title="Click to view/edit application"
    >
      {/* Left status accent line */}
      <div
        className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full"
        style={{ backgroundColor: col.color }}
      />

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        data-no-card-click="true"
        aria-label="Drag to rearrange card"
        className="absolute top-2.5 right-2.5 p-1 rounded-md cursor-grab active:cursor-grabbing text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        title="Drag to rearrange"
      >
        <GripVertical size={14} />
      </div>

      <div className="pl-4 pr-3 pt-3 pb-3">
        {/* Header: Company Avatar + Name & Priority */}
        <div className="flex items-start gap-2.5 mb-1.5 pr-6 overflow-hidden">
          {/* Company Avatar */}
          <div
            className={`w-7 h-7 rounded-lg bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-white font-bold text-[11px] shadow-xs flex-shrink-0`}
            title={job.company}
          >
            {avatar.initials}
          </div>

          <div className="w-0 min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              <span
                className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate block flex-1 overflow-hidden"
                title={job.company}
              >
                {job.company}
              </span>
              {/* Priority Pill */}
              {job.priority && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full border flex-shrink-0 ${priority.badge}`}
                  title={`Priority: ${priority.label}`}
                >
                  <span>{priority.icon}</span>
                  <span>{priority.label}</span>
                </span>
              )}
            </div>

            {/* Role Title + External Link */}
            <div className="flex items-center gap-1 mt-0.5 min-w-0 overflow-hidden">
              <h3
                className="font-bold text-sm text-slate-900 dark:text-white leading-tight truncate flex-1 overflow-hidden"
                title={job.role}
              >
                {job.role}
              </h3>
              {job.linkedinUrl && (
                <a
                  href={job.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-no-card-click="true"
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex-shrink-0 p-0.5"
                  title="Open job posting link"
                >
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tech Stack Skill Badges (Matching reference UI) */}
        {skillsList.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 my-2">
            {skillsList.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
              >
                {skill}
              </span>
            ))}
            {skillsList.length > 3 && (
              <span className="text-[9px] font-bold px-1 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                +{skillsList.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Work Mode & Compensation Row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {workMode && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${workMode.badge}`}
            >
              {workMode.label}
            </span>
          )}

          {job.salaryRange && (
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              $ {job.salaryRange.replace(/^\$\s*/, '')}
            </span>
          )}

          {job.referral && (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              title={`Referred by: ${job.referral}`}
            >
              <UserCheck size={10} className="text-indigo-500" />
              <span className="truncate max-w-[90px]">Ref: {job.referral}</span>
            </span>
          )}

          {days !== null && (
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium ml-auto">
              <Clock size={10} />
              {days === 0 ? 'Today' : `${days}d ago`}
            </span>
          )}
        </div>

        {/* Checklist Accordion Trigger */}
        <div className="mb-2" data-no-card-click="true">
          <button
            type="button"
            aria-label="Toggle task checklist"
            onClick={(e) => {
              e.stopPropagation();
              setChecklistOpen(!checklistOpen);
            }}
            className={`w-full inline-flex items-center justify-between px-2.5 py-1 rounded-lg transition-all text-xs font-semibold cursor-pointer border ${
              checklistOpen
                ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200'
                : 'bg-slate-100 dark:bg-slate-750 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
            }`}
            title="Click to view/toggle checklist tasks"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2
                size={13}
                className={completedTasks === totalTasks ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-400'}
              />
              <span>
                {completedTasks}/{totalTasks} tasks
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 text-slate-500 ${
                  checklistOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                }`}
              />
            </div>
          </button>

          {/* Inline Expandable Checklist (Unclipped) */}
          {checklistOpen && (
            <div className="mt-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5 animate-in fade-in duration-150">
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1 flex justify-between">
                <span>Application Tasks</span>
                <span className="text-slate-500 dark:text-slate-400 font-semibold">
                  {completedTasks}/{totalTasks} Done
                </span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {checklist.map((item, idx) => (
                  <label
                    key={item.id || idx}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-start gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs text-slate-800 dark:text-slate-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(item.done)}
                      onChange={() => {
                        if (onToggleChecklist) {
                          onToggleChecklist(job.id, item.id || idx);
                        }
                      }}
                      className="mt-0.5 accent-indigo-600 w-3.5 h-3.5 rounded cursor-pointer flex-shrink-0"
                    />
                    <span
                      className={
                        item.done
                          ? 'line-through text-slate-400 dark:text-slate-500 font-normal select-none'
                          : 'font-medium select-none'
                      }
                    >
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notes preview if available */}
        {job.notes && (
          <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate mb-2.5 bg-slate-50 dark:bg-slate-900/60 px-2 py-1 rounded-md border border-slate-200/60 dark:border-slate-700/60">
            {job.notes}
          </p>
        )}

        {/* Footer Actions Row */}
        <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 relative">
          {/* Quick Stage Switcher (Compact pill) */}
          <div className="relative inline-flex items-center min-w-0 max-w-[110px]" data-no-card-click="true">
            <select
              value={job.status}
              aria-label={`Change stage for ${job.company}`}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                if (onQuickMove && e.target.value !== job.status) {
                  onQuickMove(job.id, e.target.value);
                }
              }}
              className={`w-full appearance-none cursor-pointer text-[10px] font-bold pl-2 pr-5 py-0.5 rounded-lg transition-all ${col.badge} truncate hover:brightness-95 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              title="Click to quickly move stage"
            >
              {COLUMNS.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                  className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold py-1"
                >
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={10}
              className="absolute right-1.5 pointer-events-none text-current opacity-80"
            />
          </div>

          {/* Action Buttons Group */}
          <div className="flex items-center gap-0.5 flex-shrink-0" data-no-card-click="true">
            {/* ATS Score Button */}
            <button
              type="button"
              aria-label="View ATS Match Score"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenATS) onOpenATS(job);
              }}
              className="p-1 rounded-md text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
              title="ATS Keyword Match Score"
            >
              <Target size={12} />
            </button>

            {/* AI Outreach Generator Button */}
            <button
              type="button"
              aria-label="Generate AI Cover Letter and Outreach"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenOutreach) onOpenOutreach(job);
              }}
              className="p-1 rounded-md text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-colors cursor-pointer border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
              title="1-Click AI Cover Letter & Outreach"
            >
              <Sparkles size={12} />
            </button>

            {/* Edit Button */}
            <button
              id={`edit-job-${job.id}`}
              type="button"
              aria-label={`Edit ${job.company}`}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(job);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors cursor-pointer"
              title="Edit details"
            >
              <Pencil size={12} />
            </button>

            {/* Delete Button */}
            <button
              id={`delete-job-${job.id}`}
              type="button"
              aria-label={`Delete ${job.company}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(job);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
              title="Delete job"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



