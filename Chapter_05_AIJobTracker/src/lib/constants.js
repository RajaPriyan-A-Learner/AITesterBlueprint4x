import confetti from 'canvas-confetti';

export const COLUMNS = [
  { id: 'wishlist',  label: 'Wishlist',   color: '#6366f1', bg: 'bg-indigo-50 dark:bg-indigo-950/30',  border: 'border-indigo-500',  badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800' },
  { id: 'applied',   label: 'Applied',    color: '#0ea5e9', bg: 'bg-sky-50 dark:bg-sky-950/30',         border: 'border-sky-500',     badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200 border border-sky-200 dark:border-sky-800' },
  { id: 'followup',  label: 'Follow-up',  color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-950/30',     border: 'border-amber-500',   badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800' },
  { id: 'interview', label: 'Interview',  color: '#8b5cf6', bg: 'bg-violet-50 dark:bg-violet-950/30',   border: 'border-violet-500',  badge: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200 border border-violet-200 dark:border-violet-800' },
  { id: 'offer',     label: 'Offer 🎉',   color: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-500', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800' },
  { id: 'rejected',  label: 'Rejected',   color: '#f43f5e', bg: 'bg-rose-50 dark:bg-rose-950/30',       border: 'border-rose-500',    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-200 dark:border-rose-800' },
];

export const PRIORITIES = [
  { id: 'high',   label: 'High',   icon: '🔥', badge: 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-800', dot: 'bg-rose-500' },
  { id: 'medium', label: 'Medium', icon: '⭐', badge: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800', dot: 'bg-amber-500' },
  { id: 'low',    label: 'Low',    icon: '☕', badge: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700', dot: 'bg-slate-400' },
];

export const WORK_MODES = [
  { id: 'remote', label: 'Remote', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  { id: 'hybrid', label: 'Hybrid', badge: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800' },
  { id: 'onsite', label: 'Onsite', badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
];

export const DEFAULT_CHECKLIST = [
  { id: 'tailor_resume', text: 'Tailor resume & keywords for role', done: false },
  { id: 'submit_app', text: 'Submit application on careers portal', done: false },
  { id: 'connect_recruiter', text: 'Connect with recruiter on LinkedIn', done: false },
  { id: 'prep_stories', text: 'Prepare STAR stories & technical notes', done: false },
  { id: 'send_followup', text: 'Send follow-up note after 7 days', done: false },
];

export function getColumn(id) {
  return COLUMNS.find((c) => c.id === id) || COLUMNS[0];
}

export function getPriority(id) {
  return PRIORITIES.find((p) => p.id === id) || PRIORITIES[1];
}

export function getWorkMode(id) {
  return WORK_MODES.find((m) => m.id === (id || '').toLowerCase()) || null;
}

export function daysSince(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Deterministic gradient color for company avatar
 */
const AVATAR_GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-violet-500 to-fuchsia-600',
];

export function getCompanyAvatarInfo(company = '') {
  const clean = company.trim();
  if (!clean) return { initials: '🏢', gradient: AVATAR_GRADIENTS[0] };

  const words = clean.split(/\s+/);
  const initials = words.length > 1
    ? (words[0][0] + words[1][0]).toUpperCase()
    : clean.slice(0, 2).toUpperCase();

  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradientIndex = Math.abs(hash) % AVATAR_GRADIENTS.length;

  return {
    initials,
    gradient: AVATAR_GRADIENTS[gradientIndex],
  };
}

/**
 * Parse salary string into estimated numeric USD value
 */
export function parseSalaryEstimate(salaryStr = '') {
  if (!salaryStr) return 0;
  const str = salaryStr.toLowerCase().replace(/,/g, '');

  // Format: $180k - $240k or 180k
  const kMatches = str.match(/(\d+)\s*k/g);
  if (kMatches && kMatches.length > 0) {
    const nums = kMatches.map((m) => parseInt(m, 10) * 1000);
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    return avg;
  }

  // Format: ₹25-35 LPA
  const lpaMatches = str.match(/(\d+)\s*(?:lpa|lac|lakh)/g);
  if (lpaMatches && lpaMatches.length > 0) {
    const nums = lpaMatches.map((m) => parseInt(m, 10) * 1200); // approximate conversion
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    return avg;
  }

  // Direct numbers
  const directNums = str.match(/\d{4,7}/g);
  if (directNums && directNums.length > 0) {
    const nums = directNums.map((n) => parseInt(n, 10));
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  }

  return 0;
}

/**
 * Confetti cannon trigger for Offer celebrations
 */
export function triggerOfferConfetti() {
  try {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 70,
      origin: { x: 0.1, y: 0.8 },
      colors: ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6'],
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 70,
      origin: { x: 0.9, y: 0.8 },
      colors: ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6'],
    });
  } catch {
    // ignore
  }
}
