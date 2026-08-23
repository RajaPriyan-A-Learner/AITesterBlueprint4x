import { useMemo, useState } from 'react';
import { Zap } from 'lucide-react';

export default function ActivityHeatmap({ jobs = [] }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate matrix for the last 120 days (approx 17-18 weeks)
  const { weeks, totalActivityCount } = useMemo(() => {
    // Map dates to counts
    const countsByDate = {};
    jobs.forEach((j) => {
      if (j.dateApplied) {
        const dateStr = j.dateApplied.slice(0, 10);
        countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1;
      }
    });

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 120 days back
    for (let i = 119; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const count = countsByDate[dateStr] || 0;
      days.push({
        date: d,
        dateStr,
        dayOfWeek: d.getDay(),
        count,
      });
    }

    // Pad first week to start on Sunday
    const firstDayOfWeek = days[0].dayOfWeek;
    const paddedDays = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      paddedDays.push(null);
    }
    paddedDays.push(...days);

    // Group into weeks (columns of 7 days)
    const weekCols = [];
    for (let i = 0; i < paddedDays.length; i += 7) {
      weekCols.push(paddedDays.slice(i, i + 7));
    }

    let total = 0;
    days.forEach((d) => {
      total += d.count;
    });

    return { weeks: weekCols, totalActivityCount: total };
  }, [jobs]);

  const getCellColor = (count) => {
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50';
    if (count === 1) return 'bg-indigo-300 dark:bg-indigo-800 border border-indigo-400/50';
    if (count === 2) return 'bg-indigo-500 dark:bg-indigo-600 border border-indigo-400';
    return 'bg-cyan-400 dark:bg-cyan-500 border border-cyan-300';
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 pt-1 pb-3">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-black tracking-wider uppercase text-slate-800 dark:text-slate-200">
              Application Activity Heatmap (Last 120 Days)
            </h3>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              • {totalActivityCount || jobs.length} total events
            </span>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 select-none">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
            <div className="w-2.5 h-2.5 rounded-xs bg-indigo-300 dark:bg-indigo-800" />
            <div className="w-2.5 h-2.5 rounded-xs bg-indigo-500 dark:bg-indigo-600" />
            <div className="w-2.5 h-2.5 rounded-xs bg-cyan-400 dark:bg-cyan-500" />
            <span>More</span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="relative overflow-x-auto pb-1">
          <div className="flex gap-1.5 min-w-max">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day, dIdx) => {
                  if (!day) {
                    return <div key={`pad-${dIdx}`} className="w-3.5 h-3.5 opacity-0" />;
                  }

                  const isHovered = hoveredDay?.dateStr === day.dateStr;

                  return (
                    <div
                      key={day.dateStr}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3.5 h-3.5 rounded-xs transition-all cursor-pointer ${getCellColor(day.count)} ${
                        isHovered ? 'ring-2 ring-indigo-500 scale-125 z-20' : 'hover:scale-110'
                      }`}
                      title={`${day.dateStr}: ${day.count} application${day.count === 1 ? '' : 's'}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Hover Status Info */}
          {hoveredDay && (
            <div className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 animate-in fade-in flex items-center gap-2">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {hoveredDay.dateStr}:
              </span>
              <span>
                {hoveredDay.count === 0
                  ? 'No applications logged'
                  : `${hoveredDay.count} application${hoveredDay.count === 1 ? '' : 's'} logged`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
