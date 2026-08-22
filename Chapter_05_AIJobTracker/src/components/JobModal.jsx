import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { COLUMNS } from '../lib/constants';

const EMPTY = {
  company: '',
  role: '',
  linkedinUrl: '',
  resumeUsed: '',
  dateApplied: new Date().toISOString().slice(0, 10),
  salaryRange: '',
  notes: '',
  status: 'wishlist',
};

export default function JobModal({ job, defaultStatus, resumeNames, onSave, onClose }) {
  const isEdit = Boolean(job?.id);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [resumeInput, setResumeInput] = useState('');

  useEffect(() => {
    if (job) {
      setForm({ ...EMPTY, ...job });
      setResumeInput(job.resumeUsed || '');
    } else {
      const s = defaultStatus || 'wishlist';
      setForm({ ...EMPTY, status: s });
      setResumeInput('');
    }
    setErrors({});
  }, [job, defaultStatus]);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.company.trim()) e.company = 'Company name is required.';
    if (!form.role.trim()) e.role = 'Job title / role is required.';
    if (form.linkedinUrl && !/^https?:\/\/.+/.test(form.linkedinUrl.trim())) {
      e.linkedinUrl = 'Must be a valid URL starting with http(s)://';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = { ...form, company: form.company.trim(), role: form.role.trim(), resumeUsed: resumeInput.trim() };
    await onSave(payload);
    setSaving(false);
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 text-sm rounded-lg border ${errors[field] ? 'border-rose-400 focus:ring-rose-400/40' : 'border-slate-200 dark:border-slate-600 focus:ring-indigo-500/40 focus:border-indigo-400'} bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 z-10">
          <h2 className="font-semibold text-slate-900 dark:text-white text-base">
            {isEdit ? 'Edit Job' : 'Add New Job'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Company */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Company <span className="text-rose-500">*</span>
            </label>
            <input
              id="job-company"
              type="text"
              value={form.company}
              onChange={(e) => set('company', e.target.value)}
              placeholder="e.g., Google, Flipkart"
              className={inputClass('company')}
            />
            {errors.company && <p className="mt-1 text-xs text-rose-500">{errors.company}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Job Title / Role <span className="text-rose-500">*</span>
            </label>
            <input
              id="job-role"
              type="text"
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
              placeholder="e.g., Senior QA Engineer"
              className={inputClass('role')}
            />
            {errors.role && <p className="mt-1 text-xs text-rose-500">{errors.role}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select
              id="job-status"
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className={inputClass('status')}
            >
              {COLUMNS.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.label}
                </option>
              ))}
            </select>
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              LinkedIn Job URL
            </label>
            <input
              id="job-linkedin-url"
              type="url"
              value={form.linkedinUrl}
              onChange={(e) => set('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/jobs/view/..."
              className={inputClass('linkedinUrl')}
            />
            {errors.linkedinUrl && <p className="mt-1 text-xs text-rose-500">{errors.linkedinUrl}</p>}
          </div>

          {/* Resume */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Resume Used</label>
            <input
              id="job-resume"
              list="resume-list"
              type="text"
              value={resumeInput}
              onChange={(e) => setResumeInput(e.target.value)}
              placeholder="e.g., SDE_Resume_v3"
              className={inputClass('resumeUsed')}
            />
            {resumeNames.length > 0 && (
              <datalist id="resume-list">
                {resumeNames.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            )}
          </div>

          {/* Date applied + Salary side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Date Applied</label>
              <input
                id="job-date-applied"
                type="date"
                value={form.dateApplied}
                onChange={(e) => set('dateApplied', e.target.value)}
                className={inputClass('dateApplied')}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Salary Range</label>
              <input
                id="job-salary-range"
                type="text"
                value={form.salaryRange}
                onChange={(e) => set('salaryRange', e.target.value)}
                placeholder="₹25-30 LPA"
                className={inputClass('salaryRange')}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
            <textarea
              id="job-notes"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Recruiter name, referral contact, interview rounds…"
              rows={3}
              className={`${inputClass('notes')} resize-none`}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-job-btn"
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium flex items-center gap-1.5 transition-colors"
            >
              {saving && <Loader2 size={13} className="animate-spin" />}
              {isEdit ? 'Save Changes' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
