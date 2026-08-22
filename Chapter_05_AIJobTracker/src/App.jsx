import { useState, useEffect, useMemo } from 'react';
import { useJobs } from './hooks/useJobs';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import KanbanBoard from './components/KanbanBoard';
import JobModal from './components/JobModal';
import DeleteConfirm from './components/DeleteConfirm';
import { Plus, Loader2 } from 'lucide-react';

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

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('wishlist');

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Search/filter
  const [search, setSearch] = useState('');

  const filteredJobs = useMemo(() => {
    if (!search.trim()) return jobs;
    const q = search.toLowerCase();
    return jobs.filter(
      (j) =>
        j.company.toLowerCase().includes(q) ||
        j.role.toLowerCase().includes(q)
    );
  }, [jobs, search]);

  // Handlers
  const openAddModal = (status = 'wishlist') => {
    setEditingJob(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (editingJob?.id) {
      await updateJob({ ...editingJob, ...formData });
    } else {
      await addJob(formData);
    }
    setModalOpen(false);
    setEditingJob(null);
  };

  const handleDeleteRequest = (job) => setDeleteTarget(job);

  const handleDeleteConfirm = async (id) => {
    await deleteJob(id);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        onExport={exportData}
        onImport={importData}
      />

      {/* Toolbar */}
      <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <SearchBar value={search} onChange={setSearch} />
          {search && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <button
          id="add-new-job-btn"
          onClick={() => openAddModal('wishlist')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Plus size={14} />
          Add Job
        </button>
      </div>

      {/* Board */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <KanbanBoard
            jobs={filteredJobs}
            onMoveJob={moveJob}
            onUpdateJob={updateJob}
            onAddCard={openAddModal}
            onEditCard={openEditModal}
            onDeleteCard={handleDeleteRequest}
          />
        </div>
      )}

      {/* Modals */}
      {modalOpen && (
        <JobModal
          job={editingJob}
          defaultStatus={defaultStatus}
          resumeNames={resumeNames}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingJob(null); }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          job={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
