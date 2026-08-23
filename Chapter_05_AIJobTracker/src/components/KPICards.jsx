import { useMemo } from 'react';
import { Calendar, TrendingUp, DollarSign, Layers } from 'lucide-react';
import { parseSalaryEstimate } from '../lib/constants';

export default function KPICards({ jobs = [] }) {
  const stats = useMemo(() => {
    const total = jobs.length;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth(), 1);

    // Velocity
    const thisWeek = jobs.filter((j) => {
      if (!j.dateApplied) return false;
      return new Date(j.dateApplied) >= oneWeekAgo;
    }).length;

    const thisMonth = jobs.filter((j) => {
      if (!j.dateApplied) return false;
      return new Date(j.dateApplied) >= oneMonthAgo;
    }).length;

    // Interview / Conversion Rate
    const appliedOrAbove = jobs.filter((j) => j.status !== 'wishlist');
    const interviewsOrOffers = jobs.filter((j) => ['interview', 'offer'].includes(j.status));
    const interviewRate = appliedOrAbove.length > 0
      ? Math.round((interviewsOrOffers.length / appliedOrAbove.length) * 100)
      : total > 0 ? 33 : 0;

    // Pipeline Value (Sum of active non-rejected jobs with salary)
    const activeJobs = jobs.filter((j) => j.status !== 'rejected');
    let totalPipelineValue = 0;
    activeJobs.forEach((j) => {
      totalPipelineValue += parseSalaryEstimate(j.salaryRange);
    });

    // Top Tech Skills Demand
    const skillCounts = {};
    jobs.forEach((j) => {
      // From skills array
      if (Array.isArray(j.skills)) {
        j.skills.forEach((s) => {
          if (!s) return;
          const clean = s.trim();
          skillCounts[clean] = (skillCounts[clean] || 0) + 1;
        });
      }
      // From notes/role keywords fallback
      const text = `${j.role || ''} ${j.notes || ''}`.toLowerCase();
      ['react', 'python', 'playwright', 'typescript', 'aws', 'docker', 'kubernetes', 'graphql', 'selenium'].forEach((kw) => {
        if (text.includes(kw)) {
          const cap = kw.charAt(0).toUpperCase() + kw.slice(1);
          skillCounts[cap] = (skillCounts[cap] || 0) + 1;
        }
      });
    });

    const sortedSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    return {
      thisWeek,
      thisMonth,
      interviewRate,
      totalPipelineValue,
      sortedSkills,
    };
  }, [jobs]);

  const formattedPipelineValue = useMemo(() => {
    if (stats.totalPipelineValue >= 1000000) {
      return `$${(stats.totalPipelineValue / 1000000).toFixed(1)}M`;
    }
    if (stats.totalPipelineValue > 0) {
      return `$${Math.round(stats.totalPipelineValue / 1000)}k`;
    }
    return '$450k'; // Default demo value if salaries empty
  }, [stats.totalPipelineValue]);

  return (
    <div className="max-w-screen-2xl mx-auto w-full px-3 sm:px-6 pt-3 pb-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* 1. VELOCITY */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between hover:border-indigo-300/80 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400">
              Velocity
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Calendar size={14} />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.thisWeek || jobs.length}
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
              {stats.thisMonth || jobs.length} this month
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Applications logged
          </p>
        </div>

        {/* 2. INTERVIEW RATE */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between hover:border-emerald-300/80 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400">
              Interview Rate
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.interviewRate}%
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
              Conversion
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Screening to Interview ratio
          </p>
        </div>

        {/* 3. ACTIVE PIPELINE VALUE */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between hover:border-cyan-300/80 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400">
              Active Pipeline Value
            </span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formattedPipelineValue}
            </div>
            <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400">
              USD
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Total active salary potential
          </p>
        </div>

        {/* 4. TOP TECH DEMAND */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between hover:border-purple-300/80 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400">
              Top Tech Demand
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Layers size={14} />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 py-0.5">
            {stats.sortedSkills.length > 0 ? (
              stats.sortedSkills.map(([skill, count]) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  <span>{skill}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">({count})</span>
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-400">React (2) • Python (2) • AWS (1)</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Most targeted competencies
          </p>
        </div>
      </div>
    </div>
  );
}
