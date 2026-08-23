import { useState, useEffect } from 'react';
import { X, Loader2, CheckSquare, Plus, Trash2, Sparkles, RefreshCw, UserCheck } from 'lucide-react';
import { COLUMNS, PRIORITIES, WORK_MODES, DEFAULT_CHECKLIST } from '../lib/constants';
import { generateCustomChecklist } from '../services/aiService';

const EMPTY = {
  company: '',
  role: '',
  priority: 'medium',
  workMode: 'remote',
  skills: [],
  referral: '',
  linkedinUrl: '',
  resumeUsed: '',
  dateApplied: new Date().toISOString().slice(0, 10),
  salaryRange: '',
  notes: '',
  status: 'wishlist',
  checklist: DEFAULT_CHECKLIST,
};

export default function JobModal({ job, defaultStatus, resumeNames, onSave, onClose }) {
  const isEdit = Boolean(job?.id);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [generatingChecklist, setGeneratingChecklist] = useState(false);
  const [resumeInput, setResumeInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');

  useEffect(() => {
    if (job) {
      setForm({
        ...EMPTY,
        priority: 'medium',
        workMode: 'remote',
        checklist: job.checklist || DEFAULT_CHECKLIST,
        ...job,
      });
      setResumeInput(job.resumeUsed || '');
      setSkillsInput(Array.isArray(job.skills) ? job.skills.join(', ') : '');
    } else {
      const s = defaultStatus || 'wishlist';
      setForm({
        ...EMPTY,
        status: s,
        priority: 'medium',
        workMode: 'remote',
        checklist: DEFAULT_CHECKLIST,
      });
      setResumeInput('');
      setSkillsInput('');
    }
    setErrors({});
  }, [job, defaultStatus]);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const handleAIGenerateChecklist = async () => {
    setGeneratingChecklist(true);
    try {
      const aiTasks = await generateCustomChecklist({
        company: form.company,
        role: form.role,
        notes: form.notes,
      });
      if (aiTasks && aiTasks.length > 0) {
        set('checklist', aiTasks);
      }
    } catch (err) {
      console.error("AI Generation failed", err);
    } finally {
      setGeneratingChecklist(false);
    }
  };

  const toggleChecklistItem = (idOrIndex) => {
    setForm((f) => {
      const list = f.checklist || DEFAULT_CHECKLIST;
      const updated = list.map((item, idx) => {
        if (item.id === idOrIndex || idx === idOrIndex) {
          return { ...item, done: !item.done };
        }
        return item;
      });
      return { ...f, checklist: updated };
    });
  };

  const addChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    const newItem = {
      id: `task_${Date.now()}`,
      text: newChecklistText.trim(),
      done: false,
    };
    set('checklist', [...(form.checklist || DEFAULT_CHECKLIST), newItem]);
    setNewChecklistText('');
  };

  const removeChecklistItem = (idOrIndex) => {
    const list = form.checklist || DEFAULT_CHECKLIST;
    const updated = list.filter((item, idx) => item.id !== idOrIndex && idx !== idOrIndex);
    set('checklist', updated);
  };

  const validate = () => {
    const errs = {};
    if (!form.company.trim()) errs.company = 'Company is required';
    if (!form.role.trim()) errs.role = 'Role is required';
    if (form.linkedinUrl && !/^https?:\/\//i.test(form.linkedinUrl)) {
      errs.linkedinUrl = 'Please enter a valid URL (e.g. https://...)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const parsedSkills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await onSave({
        ...form,
        resumeUsed: resumeInput.trim(),
        skills: parsedSkills,
      });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 text-sm rounded-lg border ${
      errors[field]
        ? 'border-rose-400 focus:ring-rose-400/40'
        : 'border-slate-200 dark:border-slate-600 focus:ring-indigo-500/40 focus:border-indigo-400'
    } bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`;

  const checklistItems = form.checklist || DEFAULT_CHECKLIST;
  const completedCount = checklistItems.filter((i) => i.done).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 z-10">
          <h2 className="font-semibold text-slate-900 dark:text-white text-base">
            {isEdit ? 'Edit Job Application' : 'Add New Job Application'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
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
              placeholder="e.g., Google, Microsoft, Razorpay"
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
              placeholder="e.g., Lead SDET / QA Architect"
              className={inputClass('role')}
            />
            {errors.role && <p className="mt-1 text-xs text-rose-500">{errors.role}</p>}
          </div>

          {/* Priority Segmented Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITIES.map((p) => {
                const isSelected = (form.priority || 'medium') === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => set('priority', p.id)}
                    className={`py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? `${p.badge} ring-2 ring-indigo-500/40 shadow-xs scale-102`
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Work Mode Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Work Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {WORK_MODES.map((m) => {
                const isSelected = (form.workMode || 'remote') === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => set('workMode', m.id)}
                    className={`py-1.5 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? `${m.badge} ring-2 ring-indigo-500/40 scale-102`
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tech Stack Skills */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tech Stack Skills (Comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. React, TypeScript, Playwright, AWS, Python"
              className={inputClass('skills')}
            />
          </div>

          {/* Referral Contact */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Referred By (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.referral || ''}
                onChange={(e) => set('referral', e.target.value)}
                placeholder="e.g. David Chen (Senior Eng Manager)"
                className={`${inputClass('referral')} pl-8`}
              />
              <UserCheck size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Application Stage
            </label>
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

          {/* Application Checklist */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3.5 bg-slate-50/60 dark:bg-slate-900/40">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <CheckSquare size={14} className="text-indigo-500" />
                <span>Application Action Checklist</span>
                <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                  ({completedCount}/{checklistItems.length})
                </span>
              </div>

              {/* AI Generate Tasks Button */}
              <button
                type="button"
                onClick={handleAIGenerateChecklist}
                disabled={generatingChecklist}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all cursor-pointer disabled:opacity-50"
                title="Generate custom preparation tasks using AI"
              >
                {generatingChecklist ? (
                  <RefreshCw size={11} className="animate-spin" />
                ) : (
                  <Sparkles size={11} className="text-indigo-600 dark:text-indigo-400" />
                )}
                <span>{generatingChecklist ? 'Generating Tasks...' : 'AI Generate Tasks'}</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {checklistItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={Boolean(item.done)}
                      onChange={() => toggleChecklistItem(item.id || idx)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span
                      className={`truncate ${
                        item.done
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-700 dark:text-slate-200 font-medium'
                      }`}
                    >
                      {item.text}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(item.id || idx)}
                    className="p-1 rounded text-slate-300 hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove checklist item"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add custom task */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addChecklistItem();
                  }
                }}
                placeholder="Add customized action step..."
                className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addChecklistItem}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus size={12} />
                <span>Add</span>
              </button>
            </div>
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
              className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="save-job-btn"
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
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
