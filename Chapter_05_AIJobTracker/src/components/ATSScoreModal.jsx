import { useMemo } from 'react';
import { X, Target, CheckCircle, AlertCircle, Lightbulb, Sparkles } from 'lucide-react';
import { calculateATSScore } from '../services/aiService';

export default function ATSScoreModal({ isOpen, onClose, job, onOpenOutreach }) {
  const atsData = useMemo(() => {
    if (!job) return null;
    return calculateATSScore(job);
  }, [job]);

  if (!isOpen || !job || !atsData) return null;

  const { score, matched, missing, recommendations } = atsData;

  const getScoreColor = (s) => {
    if (s >= 80) return { ring: 'text-emerald-500', bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
    if (s >= 60) return { ring: 'text-indigo-500', bg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
    return { ring: 'text-amber-500', bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
  };

  const scoreTheme = getScoreColor(score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-10 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xs">
              <Target size={16} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                ATS Keyword Match Audit
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 font-medium">
                <span className="font-bold text-slate-900 dark:text-white">{job.company}</span>
                <span>•</span>
                <span>{job.role}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Top Score Banner */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {score}%
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreTheme.bg}`}
                >
                  {score >= 80 ? '🔥 High Match' : score >= 60 ? '⭐ Good Match' : '⚠️ Needs Tailoring'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Estimated Applicant Tracking System (ATS) keyword alignment score.
              </p>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={scoreTheme.ring}
                  strokeDasharray={`${score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold text-slate-800 dark:text-white">
                {score}%
              </span>
            </div>
          </div>

          {/* Matched Keywords Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle size={14} />
                <span>Matched Core Keywords ({matched.length})</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              {matched.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs"
                >
                  ✓ {kw}
                </span>
              ))}
              {matched.length === 0 && (
                <span className="text-xs text-slate-400 italic">No exact keyword overlap found.</span>
              )}
            </div>
          </div>

          {/* Missing Keywords Grid */}
          {missing.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  <span>Missing Keywords to Add to Resume ({missing.length})</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                {missing.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-2xs"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Recommendations */}
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
              <Lightbulb size={14} className="text-amber-500" />
              <span>Resume Enhancement Recommendations</span>
            </span>
            <ul className="space-y-2 text-xs">
              {recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300"
                >
                  <span className="font-bold text-indigo-500 mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenOutreach) onOpenOutreach(job);
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles size={13} />
              <span>Generate AI Cover Letter for this Job</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
