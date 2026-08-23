import { useState, useEffect, useMemo, useCallback } from 'react';
import { useJobs } from './hooks/useJobs';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import StatsBar from './components/StatsBar';
import KanbanBoard from './components/KanbanBoard';
import TableView from './components/TableView';
import JobModal from './components/JobModal';
import DeleteConfirm from './components/DeleteConfirm';
import CommandPalette from './components/CommandPalette';
import JDParserModal from './components/JDParserModal';
import ATSScoreModal from './components/ATSScoreModal';
import AIOutreachModal from './components/AIOutreachModal';
import SettingsModal from './components/SettingsModal';
import { Plus, Loader2, FilterX, Command, Sparkles } from 'lucide-react';
import { triggerOfferConfetti, DEFAULT_CHECKLIST } from './lib/constants';

export default function App() {
  const { jobs, loading, addJob, updateJob, deleteJob, moveJob, resumeNames, exportData, importData } = useJobs();

  // Dark mode — persisted in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('jt-dark');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('jt-dark', String(darkMode));
  }, [darkMode]);

  // View mode — 'kanban' | 'table' — persisted in localStorage
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('jt-view') || 'kanban';
  });

  const handleToggleView = (mode) => {
    setViewMode(mode);
    localStorage.setItem('jt-view', mode);
  };

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('wishlist');

  // Command palette state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // AI Feature Modals state
  const [jdParserOpen, setJdParserOpen] = useState(false);
  const [atsTarget, setAtsTarget] = useState(null);
  const [outreachTarget, setOutreachTarget] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Search/filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      // Status filter
      if (statusFilter && j.status !== statusFilter) {
        return false;
      }
      // Text search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesCompany = j.company.toLowerCase().includes(q);
        const matchesRole = j.role.toLowerCase().includes(q);
        const matchesResume = (j.resumeUsed || '').toLowerCase().includes(q);
        const matchesNotes = (j.notes || '').toLowerCase().includes(q);
        if (!matchesCompany && !matchesRole && !matchesResume && !matchesNotes) {
          return false;
        }
      }
      return true;
    });
  }, [jobs, search, statusFilter]);

  // Handlers
  const openAddModal = (status = 'wishlist', initialData = null) => {
    setEditingJob(initialData);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setModalOpen(true);
  };

  const handleApplyFromJD = (parsedJob) => {
    openAddModal('wishlist', parsedJob);
  };

  const handleSave = async (formData) => {
    if (formData.status === 'offer') {
      triggerOfferConfetti();
    }
    if (editingJob?.id) {
      await updateJob({ ...editingJob, ...formData });
    } else {
      await addJob(formData);
    }
    setModalOpen(false);
    setEditingJob(null);
  };

  const handleToggleChecklist = useCallback(async (jobId, itemIdOrIndex) => {
    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob) return;

    const list = targetJob.checklist || DEFAULT_CHECKLIST;
    const updatedChecklist = list.map((item, idx) => {
      if (item.id === itemIdOrIndex || idx === itemIdOrIndex) {
        return { ...item, done: !item.done };
      }
      return item;
    });

    await updateJob({ ...targetJob, checklist: updatedChecklist });
  }, [jobs, updateJob]);

  const handleDeleteRequest = (job) => setDeleteTarget(job);

  const handleDeleteConfirm = async (id) => {
    await deleteJob(id);
    setDeleteTarget(null);
  };

  // Global Keyboard Shortcuts (Ctrl+K, N, V, D, P, S, etc.)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcut keys when actively typing inside form inputs
      const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (!isInputFocused && !modalOpen && !deleteTarget && !jdParserOpen && !atsTarget && !outreachTarget && !settingsOpen) {
        if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          openAddModal('wishlist');
        } else if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          setJdParserOpen(true);
        } else if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          setSettingsOpen(true);
        } else if (e.key === 'v' || e.key === 'V') {
          e.preventDefault();
          handleToggleView(viewMode === 'kanban' ? 'table' : 'kanban');
        } else if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          setDarkMode((d) => !d);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, modalOpen, deleteTarget, jdParserOpen, atsTarget, outreachTarget, settingsOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        onExport={exportData}
        onImport={importData}
        viewMode={viewMode}
        onToggleView={handleToggleView}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenJDParser={() => setJdParserOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Top Toolbar */}
      <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 pt-3 pb-1 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchBar value={search} onChange={setSearch} />
          {statusFilter && (
            <button
              onClick={() => setStatusFilter(null)}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 transition-colors cursor-pointer"
              title="Clear stage filter"
            >
              <span>Stage: {statusFilter}</span>
              <FilterX size={12} />
            </button>
          )}
          {(search || statusFilter) && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {filteredJobs.length} of {jobs.length} jobs
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* AI Parse JD Fast Button */}
          <button
            type="button"
            onClick={() => setJdParserOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-950/40 dark:to-purple-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100/50 transition-all cursor-pointer"
            title="Parse job posting with AI (P)"
          >
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>AI Parse JD</span>
          </button>

          {/* Mobile Command Button */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Command Palette"
          >
            <Command size={15} />
          </button>

          <button
            id="add-new-job-btn"
            onClick={() => openAddModal('wishlist')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md hover:scale-102 transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Job</span>
          </button>
        </div>
      </div>

      {/* Pipeline Stats & Funnel Bar */}
      {!loading && (
        <StatsBar
          jobs={jobs}
          activeFilterStatus={statusFilter}
          onSelectStatusFilter={setStatusFilter}
        />
      )}

      {/* Main View Area (Kanban vs Table) */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : viewMode === 'table' ? (
        <TableView
          jobs={filteredJobs}
          onEditCard={openEditModal}
          onDeleteCard={handleDeleteRequest}
          onQuickMove={moveJob}
          onToggleChecklist={handleToggleChecklist}
          onOpenATS={(job) => setAtsTarget(job)}
          onOpenOutreach={(job) => setOutreachTarget(job)}
        />
      ) : (
        <div className="flex-1 overflow-hidden">
          <KanbanBoard
            jobs={filteredJobs}
            onMoveJob={moveJob}
            onAddCard={openAddModal}
            onEditCard={openEditModal}
            onDeleteCard={handleDeleteRequest}
            onToggleChecklist={handleToggleChecklist}
            onOpenATS={(job) => setAtsTarget(job)}
            onOpenOutreach={(job) => setOutreachTarget(job)}
          />
        </div>
      )}

      {/* Modals & Overlays */}
      {modalOpen && (
        <JobModal
          job={editingJob}
          defaultStatus={defaultStatus}
          resumeNames={resumeNames}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditingJob(null);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          job={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* AI Modals */}
      {jdParserOpen && (
        <JDParserModal
          isOpen={jdParserOpen}
          onClose={() => setJdParserOpen(false)}
          onApplyToJob={handleApplyFromJD}
        />
      )}

      {atsTarget && (
        <ATSScoreModal
          isOpen={Boolean(atsTarget)}
          onClose={() => setAtsTarget(null)}
          job={atsTarget}
          onOpenOutreach={(job) => setOutreachTarget(job)}
        />
      )}

      {outreachTarget && (
        <AIOutreachModal
          isOpen={Boolean(outreachTarget)}
          onClose={() => setOutreachTarget(null)}
          job={outreachTarget}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        jobs={jobs}
        viewMode={viewMode}
        darkMode={darkMode}
        onAddJob={() => openAddModal('wishlist')}
        onSelectJob={openEditModal}
        onToggleView={handleToggleView}
        onToggleDark={() => setDarkMode((d) => !d)}
        onExport={exportData}
        onImport={importData}
        onOpenJDParser={() => setJdParserOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onFilterPriority={(p) => {
          setSearch(p);
        }}
      />
    </div>
  );
}



