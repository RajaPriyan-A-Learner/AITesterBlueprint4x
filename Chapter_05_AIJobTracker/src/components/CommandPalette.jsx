import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  LayoutGrid,
  Table,
  Sun,
  Moon,
  Download,
  Flame,
  ArrowRight,
  Sparkles,
  Settings,
} from 'lucide-react';
import { getColumn, getPriority, getCompanyAvatarInfo } from '../lib/constants';

export default function CommandPalette({
  isOpen,
  onClose,
  jobs,
  viewMode,
  darkMode,
  onAddJob,
  onSelectJob,
  onToggleView,
  onToggleDark,
  onExport,
  onFilterPriority,
  onOpenJDParser,
  onOpenSettings,
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Compute command options + matching jobs
  const staticActions = [
    {
      id: 'parse-jd',
      type: 'action',
      label: 'Parse Job Description with AI',
      shortcut: 'P',
      icon: Sparkles,
      run: () => onOpenJDParser && onOpenJDParser(),
    },
    {
      id: 'open-settings',
      type: 'action',
      label: 'AI & Model Settings (Ollama / Cloud)',
      shortcut: 'S',
      icon: Settings,
      run: () => onOpenSettings && onOpenSettings(),
    },
    {
      id: 'add-job',
      type: 'action',
      label: 'Add New Job Application',
      shortcut: 'N',
      icon: Plus,
      run: () => onAddJob(),
    },
    {
      id: 'toggle-view',
      type: 'action',
      label: viewMode === 'kanban' ? 'Switch to Table / List View' : 'Switch to Kanban Board View',
      shortcut: 'V',
      icon: viewMode === 'kanban' ? Table : LayoutGrid,
      run: () => onToggleView(viewMode === 'kanban' ? 'table' : 'kanban'),
    },
    {
      id: 'toggle-theme',
      type: 'action',
      label: darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      shortcut: 'D',
      icon: darkMode ? Sun : Moon,
      run: () => onToggleDark(),
    },
    {
      id: 'export-data',
      type: 'action',
      label: 'Export JSON Backup',
      shortcut: 'E',
      icon: Download,
      run: () => onExport(),
    },
    {
      id: 'filter-high',
      type: 'action',
      label: 'Filter High Priority Jobs',
      shortcut: 'H',
      icon: Flame,
      run: () => onFilterPriority('high'),
    },
  ];

  const q = query.toLowerCase().trim();

  // Filter actions
  const filteredActions = staticActions.filter((a) =>
    a.label.toLowerCase().includes(q)
  );

  // Filter jobs
  const filteredJobs = q
    ? jobs.filter(
        (j) =>
          j.company.toLowerCase().includes(q) ||
          j.role.toLowerCase().includes(q) ||
          (j.notes && j.notes.toLowerCase().includes(q))
      )
    : jobs.slice(0, 5); // Show latest 5 if no query

  const allItems = [
    ...filteredActions.map((a) => ({ ...a, itemType: 'action' })),
    ...filteredJobs.map((j) => ({ ...j, itemType: 'job' })),
  ];

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % (allItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + allItems.length) % (allItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = allItems[selectedIndex];
      if (current) {
        if (current.itemType === 'action') {
          current.run();
          onClose();
        } else if (current.itemType === 'job') {
          onSelectJob(current);
          onClose();
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Palette Box */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <Search size={18} className="text-slate-400 dark:text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search companies, roles..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none font-medium"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300/50 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 bg-white dark:bg-slate-900">
          {filteredActions.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Commands & Shortcuts
              </div>
              {filteredActions.map((action, idx) => {
                const isSelected = selectedIndex === idx;
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => {
                      action.run();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isSelected ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'} />
                      <span>{action.label}</span>
                    </div>
                    {action.shortcut && (
                      <kbd
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {action.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {filteredJobs.length > 0 && (
            <div className="pt-2">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                {query ? 'Matching Applications' : 'Recent Applications'}
              </div>
              {filteredJobs.map((job, jIdx) => {
                const itemIndex = filteredActions.length + jIdx;
                const isSelected = selectedIndex === itemIndex;
                const col = getColumn(job.status);
                const priority = getPriority(job.priority);
                const avatar = getCompanyAvatarInfo(job.company);

                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => {
                      onSelectJob(job);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-md bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0`}
                      >
                        {avatar.initials}
                      </div>
                      <div className="min-w-0 text-left">
                        <div
                          className={`font-semibold truncate ${
                            isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {job.company}
                        </div>
                        <div
                          className={`text-[11px] truncate ${
                            isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-300'
                          }`}
                        >
                          {job.role}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {job.priority && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                            isSelected ? 'bg-indigo-700 border-indigo-500 text-white' : priority.badge
                          }`}
                        >
                          {priority.icon} {priority.label}
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-indigo-700 text-white' : col.badge
                        }`}
                      >
                        {col.label}
                      </span>
                      <ArrowRight size={13} className={isSelected ? 'text-white' : 'text-slate-400 dark:text-slate-300'} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {allItems.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-400">
              No matching commands or applications found for "{query}"
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
                ↑
              </kbd>{' '}
              <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
                ↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
                ↵
              </kbd>{' '}
              Select
            </span>
          </div>
          <span className="font-medium text-slate-400 dark:text-slate-500">Antigravity Quick Actions</span>
        </div>
      </div>
    </div>
  );
}
