import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirm({ job, onConfirm, onCancel }) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 animate-[fadeUp_0.18s_ease-out]">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center">
            <AlertTriangle size={16} className="text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Delete this card?</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-300">{job.company}</strong> — {job.role}
              <br />
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            id="cancel-delete"
            onClick={onCancel}
            className="px-4 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-delete"
            onClick={() => onConfirm(job.id)}
            className="px-4 py-1.5 text-sm rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
