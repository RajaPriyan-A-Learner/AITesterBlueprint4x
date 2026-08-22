import { useState, useEffect, useCallback } from 'react';
import { getAllJobs, addJob as dbAdd, updateJob as dbUpdate, deleteJob as dbDelete, bulkAddJobs } from '../lib/db';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all jobs from IDB on mount
  useEffect(() => {
    getAllJobs().then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  const addJob = useCallback(async (jobData) => {
    const saved = await dbAdd(jobData);
    setJobs((prev) => [...prev, saved]);
    return saved;
  }, []);

  const updateJob = useCallback(async (job) => {
    await dbUpdate(job);
    setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));
  }, []);

  const deleteJob = useCallback(async (id) => {
    await dbDelete(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }, []);

  const moveJob = useCallback(async (id, newStatus) => {
    setJobs((prev) => {
      const job = prev.find((j) => j.id === id);
      if (!job || job.status === newStatus) return prev;
      const updated = { ...job, status: newStatus };
      dbUpdate(updated);
      return prev.map((j) => (j.id === id ? updated : j));
    });
  }, []);

  // Returns deduplicated list of resume names used across all jobs
  const resumeNames = [...new Set(jobs.map((j) => j.resumeUsed).filter(Boolean))];

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(jobs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [jobs]);

  const importData = useCallback(async (file) => {
    const text = await file.text();
    const imported = JSON.parse(text);
    if (!Array.isArray(imported)) throw new Error('Invalid JSON format');
    await bulkAddJobs(imported);
    const fresh = await getAllJobs();
    setJobs(fresh);
  }, []);

  return { jobs, loading, addJob, updateJob, deleteJob, moveJob, resumeNames, exportData, importData };
}
