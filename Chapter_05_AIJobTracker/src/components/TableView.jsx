import { useState, useMemo } from 'react';
import {
  Pencil,
  Trash2,
  ExternalLink,
  ChevronDown,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  ListTodo,
  Target,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import {
  COLUMNS,
  getColumn,
  getPriority,
  getWorkMode,
  daysSince,
  getCompanyAvatarInfo,
  DEFAULT_CHECKLIST,
} from '../lib/constants';

export default function TableView({
  jobs,
  onEditCard,
  onDeleteCard,
  onQuickMove,
  onToggleChecklist,
  onOpenATS,
  onOpenOutreach,
}) {
  const [sortField, setSortField] = useState('dateApplied');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'
  const [checklistPopoverId, setChecklistPopoverId] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';

      if (sortField === 'dateApplied') {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [jobs, sortField, sortDirection]);

  if (jobs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
        <p className="text-sm font-medium">No job applications match your filters.</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-4 flex-1">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header */}
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700 select-none">
              <tr>
                <th
                  onClick={() => handleSort('company')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Company & Role</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Stage</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('priority')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Priority</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <ListTodo size={12} className="opacity-70" />
                    <span>Checklist</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort('salaryRange')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Salary & Mode</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('dateApplied')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Date Applied</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {sortedJobs.map((job) => {
                const col = getColumn(job.status);
                const priority = getPriority(job.priority);
                const workMode = getWorkMode(job.workMode);
                const days = daysSince(job.dateApplied);
                const avatar = getCompanyAvatarInfo(job.company);

                const checklist = job.checklist || DEFAULT_CHECKLIST;
                const totalCount = checklist.length;
                const completedCount = checklist.filter((i) => i.done).length;
                const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                return (
                  <tr
                    key={job.id}
                    onClick={() => onEditCard(job)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    {/* 1. Company & Role */}
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-3">
                        {/* Company Avatar */}
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-white font-bold text-[11px] shadow-xs flex-shrink-0 select-none mt-0.5`}
                        >
                          {avatar.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[200px]">
                              {job.company}
                            </span>
                            {job.referral && (
                              <span
                                className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                title={`Referred by: ${job.referral}`}
                              >
                                <UserCheck size={9} className="text-indigo-500" />
                                <span>Ref</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-[200px] font-medium">
                            {job.role}
                          </div>
                          {/* Skills preview */}
                          {Array.isArray(job.skills) && job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {job.skills.slice(0, 2).map((s, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] font-bold px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                >
                                  {s}
                                </span>
                              ))}
                              {job.skills.length > 2 && (
                                <span className="text-[9px] text-slate-400">
                                  +{job.skills.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 2. Stage Select Pill */}
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-flex items-center">
                        <select
                          value={job.status}
                          onChange={(e) => {
                            if (onQuickMove && e.target.value !== job.status) {
                              onQuickMove(job.id, e.target.value);
                            }
                          }}
                          className={`appearance-none cursor-pointer text-[10px] font-bold pl-2 pr-5 py-1 rounded-md transition-all ${col.badge} border border-slate-200/80 dark:border-slate-700/80 hover:brightness-95 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                          title="Change stage"
                        >
                          {COLUMNS.map((c) => (
                            <option
                              key={c.id}
                              value={c.id}
                              className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium py-1"
                            >
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={10}
                          className="absolute right-1.5 pointer-events-none text-current opacity-70"
                        />
                      </div>
                    </td>

                    {/* 3. Priority Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priority.badge}`}
                      >
                        <span>{priority.icon}</span>
                        <span>{priority.label}</span>
                      </span>
                    </td>

                    {/* 4. Checklist Progress */}
                    <td className="py-3 px-4 relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() =>
                          setChecklistPopoverId(checklistPopoverId === job.id ? null : job.id)
                        }
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-[10px] font-medium"
                      >
                        <CheckCircle2
                          size={11}
                          className={completedCount === totalCount ? 'text-emerald-500' : 'text-slate-400'}
                        />
                        <span>
                          {completedCount}/{totalCount}
                        </span>
                        <div className="w-10 h-1.5 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden ml-0.5">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </button>

                      {/* Checklist Popover */}
                      {checklistPopoverId === job.id && (
                        <>
                          <div
                            className="fixed inset-0 z-30"
                            onClick={() => setChecklistPopoverId(null)}
                          />
                          <div className="absolute left-4 top-full mt-1 z-40 w-64 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-2">
                            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-1 flex items-center justify-between">
                              <span>Action Checklist</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {completedCount} of {totalCount} completed
                              </span>
                            </div>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                              {checklist.map((item, idx) => (
                                <label
                                  key={item.id || idx}
                                  className="flex items-start gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1 rounded-md transition-colors text-[11px]"
                                >
                                  <input
                                    type="checkbox"
                                    checked={Boolean(item.done)}
                                    onChange={() => {
                                      if (onToggleChecklist) {
                                        onToggleChecklist(job.id, item.id || idx);
                                      }
                                    }}
                                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                  />
                                  <span
                                    className={
                                      item.done
                                        ? 'line-through text-slate-400 dark:text-slate-500'
                                        : 'text-slate-700 dark:text-slate-200'
                                    }
                                  >
                                    {item.text}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </td>

                    {/* 5. Salary & Mode */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        {job.salaryRange && (
                          <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                            $ {job.salaryRange.replace(/^\$\s*/, '')}
                          </span>
                        )}
                        {workMode && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${workMode.badge}`}>
                            {workMode.label}
                          </span>
                        )}
                        {!job.salaryRange && !workMode && (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </div>
                    </td>

                    {/* 6. Date Applied */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock size={11} className="text-slate-400" />
                        <span>{job.dateApplied || '—'}</span>
                        {days !== null && (
                          <span className="text-[10px] text-slate-400">
                            ({days === 0 ? 'Today' : `${days}d ago`})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 7. Action Buttons */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {/* ATS Score Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenATS) onOpenATS(job);
                          }}
                          className="p-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                          title="ATS Keyword Match Score"
                        >
                          <Target size={13} />
                        </button>

                        {/* AI Outreach Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenOutreach) onOpenOutreach(job);
                          }}
                          className="p-1 rounded-md text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
                          title="1-Click AI Cover Letter & Outreach"
                        >
                          <Sparkles size={13} />
                        </button>

                        {job.linkedinUrl && (
                          <a
                            href={job.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors cursor-pointer"
                            title="Open LinkedIn Job"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => onEditCard(job)}
                          className="p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteCard(job)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {sortedJobs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500 italic">
                    No job applications match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
