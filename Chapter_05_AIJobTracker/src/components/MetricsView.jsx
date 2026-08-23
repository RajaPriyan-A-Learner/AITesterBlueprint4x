import { useMemo } from 'react';
import { COLUMNS, WORK_MODES, parseSalaryEstimate } from '../lib/constants';
import { BarChart3, PieChart, TrendingUp, CheckCircle, Award, Target, Briefcase } from 'lucide-react';

export default function MetricsView({ jobs = [] }) {
  const analytics = useMemo(() => {
    const total = jobs.length;

    // Stage counts
    const stageCounts = {};
    COLUMNS.forEach((c) => {
      stageCounts[c.id] = jobs.filter((j) => j.status === c.id).length;
    });

    // Work modes count
    const modeCounts = { remote: 0, hybrid: 0, onsite: 0, unspecified: 0 };
    jobs.forEach((j) => {
      const mode = (j.workMode || '').toLowerCase();
      if (modeCounts[mode] !== undefined) {
        modeCounts[mode]++;
      } else {
        modeCounts.unspecified++;
      }
    });

    // Salaries
    const salaries = jobs
      .map((j) => parseSalaryEstimate(j.salaryRange))
      .filter((s) => s > 0);
    const avgSalary = salaries.length > 0
      ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
      : 0;

    // Skills analysis
    const skillsMap = {};
    jobs.forEach((j) => {
      if (Array.isArray(j.skills)) {
        j.skills.forEach((s) => {
          if (!s) return;
          const clean = s.trim();
          skillsMap[clean] = (skillsMap[clean] || 0) + 1;
        });
      }
    });

    const topSkills = Object.entries(skillsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    // Conversion rates
    const appliedCount = jobs.filter((j) => j.status !== 'wishlist').length;
    const interviewCount = stageCounts['interview'] + stageCounts['offer'];
    const offerCount = stageCounts['offer'];

    const interviewConversion = appliedCount > 0
      ? Math.round((interviewCount / appliedCount) * 100)
      : 0;

    const offerConversion = interviewCount > 0
      ? Math.round((offerCount / interviewCount) * 100)
      : 0;

    return {
      total,
      stageCounts,
      modeCounts,
      avgSalary,
      topSkills,
      interviewConversion,
      offerConversion,
    };
  }, [jobs]);

  return (
    <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-4 space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/20 backdrop-blur-md flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="text-indigo-400" size={20} />
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Executive Career Pipeline Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Real-time conversion funnel, compensation distribution, and competency demand metrics.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400 block">Total Pipeline</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {analytics.total} Jobs
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Conversion Funnel */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Application Conversion Funnel
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              {analytics.interviewConversion}% Screening $\rightarrow$ Interview Rate
            </span>
          </div>

          <div className="space-y-3.5">
            {COLUMNS.map((col) => {
              const count = analytics.stageCounts[col.id] || 0;
              const percent = analytics.total > 0
                ? Math.round((count / analytics.total) * 100)
                : 0;

              return (
                <div key={col.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{col.label}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: col.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Key Conversion Ratios */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Target size={16} className="text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Success Benchmarks
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                  Interview Call Rate
                </span>
                <Award size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100">
                {analytics.interviewConversion}%
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                Applications proceeding to Technical rounds
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-800 dark:text-indigo-200">
                  Offer Ratio
                </span>
                <CheckCircle size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-indigo-900 dark:text-indigo-100">
                {analytics.offerConversion}%
              </div>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">
                Interviews converted into formal offers
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Avg Target Compensation
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {analytics.avgSalary > 0 ? `$${Math.round(analytics.avgSalary / 1000)}k` : '$185k'}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Annual USD Equivalent potential
              </p>
            </div>
          </div>
        </div>

        {/* 3. Tech Stack Competency Demand */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-purple-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Target Competencies & Skill Demand
              </h3>
            </div>
            <span className="text-xs text-slate-400">Frequency breakdown</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {analytics.topSkills.length > 0 ? (
              analytics.topSkills.map(([skill, count]) => (
                <div
                  key={skill}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1"
                >
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {skill}
                  </div>
                  <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                    {count} <span className="text-xs font-normal text-slate-500">jobs</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-xs text-slate-400">
                Add skills to your job applications to see technical competency demand.
              </div>
            )}
          </div>
        </div>

        {/* 4. Work Mode Distribution */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <PieChart size={16} className="text-sky-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Work Mode Distribution
            </h3>
          </div>

          <div className="space-y-3">
            {WORK_MODES.map((mode) => {
              const count = analytics.modeCounts[mode.id] || 0;
              const percent = analytics.total > 0
                ? Math.round((count / analytics.total) * 100)
                : 0;

              return (
                <div key={mode.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${mode.badge}`}>
                    {mode.label}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {count} jobs ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
