import { useState } from 'react';
import { X, Sparkles, Loader2, Check, ArrowRight, Building, Briefcase, DollarSign, Cpu } from 'lucide-react';
import { parseJobDescription } from '../services/aiService';

export default function JDParserModal({ isOpen, onClose, onApplyToJob }) {
  const [jdText, setJdText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleParse = async () => {
    if (!jdText.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    setError('');
    setParsing(true);
    try {
      const result = await parseJobDescription(jdText);
      setParsedResult(result);
    } catch (err) {
      setError(err.message || 'Failed to parse job description.');
    } finally {
      setParsing(false);
    }
  };

  const handleCreateApplication = () => {
    if (!parsedResult) return;
    onApplyToJob({
      company: parsedResult.company,
      role: parsedResult.role,
      salaryRange: parsedResult.salaryRange || '',
      notes: `Key Skills: ${parsedResult.skills?.join(', ')}\n${parsedResult.summary || ''}`.trim(),
      priority: 'high',
      status: 'wishlist',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-10 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                AI Job Description Parser
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste any job posting to extract role details and keywords in seconds.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Input Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Paste Raw Job Description (from LinkedIn, Naukri, Indeed...)
            </label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste job posting text here (e.g. 'We are hiring a Lead QA Engineer at Razorpay to build Playwright frameworks...')"
              rows={5}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none font-sans"
            />
            {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleParse}
              disabled={parsing || !jdText.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {parsing ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
              <span>{parsing ? 'Analyzing Description...' : 'Extract Fields with AI'}</span>
            </button>
          </div>

          {/* Parsed Result Preview */}
          {parsedResult && (
            <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/40 pb-2">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-500" />
                  <span>Structured Details Extracted</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Ready to apply
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                  <Building size={14} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-medium text-slate-400 block">Company</span>
                    <span className="font-semibold text-slate-800 dark:text-white truncate block">
                      {parsedResult.company}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                  <Briefcase size={14} className="text-sky-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-medium text-slate-400 block">Role</span>
                    <span className="font-semibold text-slate-800 dark:text-white truncate block">
                      {parsedResult.role}
                    </span>
                  </div>
                </div>
              </div>

              {parsedResult.salaryRange && (
                <div className="flex items-center gap-2 text-xs bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                  <DollarSign size={14} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-[10px] font-medium text-slate-400">Salary Range:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {parsedResult.salaryRange}
                  </span>
                </div>
              )}

              {/* Skills Tags */}
              {parsedResult.skills?.length > 0 && (
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5 flex items-center gap-1">
                    <Cpu size={12} />
                    <span>Identified Core Skills</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedResult.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleCreateApplication}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Create Application with these Details</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
