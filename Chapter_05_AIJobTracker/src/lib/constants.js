export const COLUMNS = [
  { id: 'wishlist',  label: 'Wishlist',   color: '#6366f1', bg: 'bg-indigo-50 dark:bg-indigo-950/20',  border: 'border-indigo-500',  badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' },
  { id: 'applied',   label: 'Applied',    color: '#0ea5e9', bg: 'bg-sky-50 dark:bg-sky-950/20',         border: 'border-sky-500',     badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300' },
  { id: 'followup',  label: 'Follow-up',  color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-950/20',     border: 'border-amber-500',   badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
  { id: 'interview', label: 'Interview',  color: '#8b5cf6', bg: 'bg-violet-50 dark:bg-violet-950/20',   border: 'border-violet-500',  badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300' },
  { id: 'offer',     label: 'Offer 🎉',   color: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' },
  { id: 'rejected',  label: 'Rejected',   color: '#f43f5e', bg: 'bg-rose-50 dark:bg-rose-950/20',       border: 'border-rose-500',    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300' },
];

export function getColumn(id) {
  return COLUMNS.find((c) => c.id === id) || COLUMNS[0];
}

export function daysSince(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}
