import { Sun, Moon, Download, Upload, Briefcase, LayoutGrid, Table, Search, Command, Sparkles, Settings } from 'lucide-react';
import { useRef } from 'react';

export default function Header({
  darkMode,
  onToggleDark,
  onExport,
  onImport,
  viewMode,
  onToggleView,
  onOpenCommandPalette,
  onOpenJDParser,
  onOpenSettings,
}) {
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImport(file).catch(() => alert('Import failed — make sure the file is a valid Job Tracker JSON backup.'));
      e.target.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 select-none">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-xs">
            <Briefcase size={16} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight leading-none">
                JobTracker
              </span>
              <span className="hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                AI Powered
              </span>
            </div>
          </div>
        </div>

        {/* Center: Command Palette Trigger */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2.5 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer shadow-2xs"
          title="Open Command Palette (Ctrl+K)"
        >
          <Search size={13} className="text-slate-400" />
          <span>Quick actions & search...</span>
          <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 shadow-2xs">
            <Command size={10} /> K
          </kbd>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* AI JD Parser Trigger */}
          <button
            type="button"
            onClick={onOpenJDParser}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-500/15 to-purple-500/15 dark:from-indigo-950/60 dark:to-purple-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 hover:bg-indigo-100/50 transition-all cursor-pointer"
            title="Paste & Parse Job Description with AI"
          >
            <Sparkles size={13} className="text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Parse JD</span>
          </button>

          {/* View Toggle Segmented Buttons */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => onToggleView('kanban')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Kanban Board View (V)"
            >
              <LayoutGrid size={13} />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleView('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Table / Spreadsheet View (V)"
            >
              <Table size={13} />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* Export */}
          <button
            onClick={onExport}
            title="Export backup JSON"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Import */}
          <button
            onClick={() => fileRef.current?.click()}
            title="Import backup JSON"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Upload size={13} />
            <span className="hidden sm:inline">Import</span>
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />

          {/* AI Settings button */}
          <button
            type="button"
            onClick={onOpenSettings}
            title="AI & Model Settings"
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <Settings size={14} />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
    </header>
  );
}
