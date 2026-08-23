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
} from 'lucide-react';
import {
  COLUMNS,
  getColumn,
  getPriority,
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
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [jobs, sortField, sortDirection]);

  return (
    <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-2 overflow-hidden flex-1 flex flex-col">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 shadow-sm overflow-hidden flex-1 flex flex-col">
        {/* Table scroll container */}
        <div className="overflow-x-auto overflow-y-auto flex-1 max-h-[calc(100vh-210px)]">
          <table className="w-full text-left border-collapse text-xs">
            {/* Table Header */}
            <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider select-none">
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
                    <span>Salary</span>
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
                const days = daysSince(job.dateApplied);
                const avatar = getCompanyAvatarInfo(job.company);

                const checklist = job.checklist || DEFAULT_CHECKLIST;
                const completedCount = checklist.filter((item) => item.done).length;
                const totalCount = checklist.length;
                const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                return (
                  <tr
                    key={job.id}
                    onClick={() => onEditCard(job)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    {/* 1. Company & Role */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {/* Company Avatar */}
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-white font-bold text-[11px] shadow-xs flex-shrink-0 select-none`}
                        >
                          {avatar.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-white text-xs truncate max-w-[200px]">
                            {job.company}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] font-medium">
                            {job.role}
                          </div>
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

                    {/* 5. Salary */}
                    <td className="py-3 px-4">
                      {job.salaryRange ? (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
                          {job.salaryRange}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
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
