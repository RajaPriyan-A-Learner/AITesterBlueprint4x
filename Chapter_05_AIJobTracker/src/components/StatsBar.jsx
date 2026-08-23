import { useState, useMemo } from 'react';
import { TrendingUp, Award, Calendar, CheckCircle2, ChevronDown, ChevronUp, Flame, Sparkles } from 'lucide-react';
import { COLUMNS } from '../lib/constants';

export default function StatsBar({ jobs = [], activeFilterStatus, onSelectStatusFilter }) {
  const [collapsed, setCollapsed] = useState(false);

  const stats = useMemo(() => {
    const totalWishlist = jobs.filter((j) => j.status === 'wishlist').length;
    const totalApplied = jobs.filter((j) => j.status === 'applied').length;
    const totalFollowup = jobs.filter((j) => j.status === 'followup').length;
    const totalInterview = jobs.filter((j) => j.status === 'interview').length;
    const totalOffer = jobs.filter((j) => j.status === 'offer').length;
    const totalRejected = jobs.filter((j) => j.status === 'rejected').length;

    // Applications submitted (excluding wishlist)
    const applicationsSubmitted = jobs.filter((j) => j.status !== 'wishlist').length;

    // Active pipeline (in progress)
    const activePipeline = totalApplied + totalFollowup + totalInterview;

    // High priority count
    const highPriorityCount = jobs.filter((j) => j.priority === 'high' && j.status !== 'rejected').length;

    // Conversion rates
    const interviewRate = applicationsSubmitted > 0
      ? Math.round(((totalInterview + totalOffer) / applicationsSubmitted) * 100)
      : 0;

    const offerRate = applicationsSubmitted > 0
      ? Math.round((totalOffer / applicationsSubmitted) * 100)
      : 0;

    return {
      totalWishlist,
      totalApplied,
      totalFollowup,
      totalInterview,
      totalOffer,
      totalRejected,
      applicationsSubmitted,
      activePipeline,
      highPriorityCount,
      interviewRate,
      offerRate,
    };
  }, [jobs]);

  return (
    <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 mb-2">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xs transition-all">
        {/* Header Toggle Row */}
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles size={13} />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
              Pipeline Analytics & Funnel
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              ({jobs.length} Total Jobs)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Stat Pill Preview when collapsed */}
            {collapsed && (
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-medium">
                  {stats.activePipeline} Active
                </span>
                <span className="px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-medium">
                  {stats.interviewRate}% Interview Rate
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium">
                  {stats.totalOffer} Offers 🎉
                </span>
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              title={collapsed ? 'Expand Pipeline Stats' : 'Collapse Pipeline Stats'}
            >
              <span>{collapsed ? 'Show' : 'Hide'}</span>
              {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
            </button>
          </div>
        </div>

        {/* Expanded Metric Cards & Funnel */}
        {!collapsed && (
          <div className="px-4 pb-3.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {/* Metric 1: Applications Sent */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span className="text-xs font-semibold">Applications Sent</span>
                  <Calendar size={14} className="text-sky-500" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {stats.applicationsSubmitted}
                  </span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    +{stats.totalWishlist} wishlist
                  </span>
                </div>
              </div>

              {/* Metric 2: Active Pipeline */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span className="text-xs font-semibold">Active Pipeline</span>
                  <TrendingUp size={14} className="text-indigo-500" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                    {stats.activePipeline}
                  </span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">in motion</span>
                </div>
              </div>

              {/* Metric 3: Interview Conversion Rate */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span className="text-xs font-semibold">Interview Rate</span>
                  <CheckCircle2 size={14} className="text-violet-500" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-violet-700 dark:text-violet-300">
                    {stats.interviewRate}%
                  </span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    ({stats.totalInterview} active)
                  </span>
                </div>
              </div>

              {/* Metric 4: Offers Landed */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-200 mb-1">
                  <span className="text-xs font-bold">Offers Landed</span>
                  <Award size={14} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-emerald-800 dark:text-emerald-300">
                    {stats.totalOffer} 🎉
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    ({stats.offerRate}% won)
                  </span>
                </div>
              </div>

              {/* Metric 5: High Priority Focus (Hidden on mobile) */}
              <div className="hidden lg:flex p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-col justify-between">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span className="text-xs font-semibold">Top Priority</span>
                  <Flame size={14} className="text-rose-500" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-rose-700 dark:text-rose-300">
                    {stats.highPriorityCount}
                  </span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">active focus</span>
                </div>
              </div>
            </div>

            {/* Quick Interactive Stage Filter Chips */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">
                Filter Stage:
              </span>

              <button
                type="button"
                onClick={() => onSelectStatusFilter && onSelectStatusFilter(null)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !activeFilterStatus
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                All ({jobs.length})
              </button>

              {COLUMNS.map((col) => {
                const count = jobs.filter((j) => j.status === col.id).length;
                const isSelected = activeFilterStatus === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => onSelectStatusFilter && onSelectStatusFilter(isSelected ? null : col.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? `${col.badge} ring-2 ring-indigo-500 dark:ring-indigo-400 shadow-xs`
                        : `${col.badge} hover:brightness-95`
                    }`}
                  >
                    <span>{col.label}</span>
                    <span className="text-[11px] font-black">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
