import { openDB } from 'idb';

const DB_NAME = 'job-tracker-db';
const DB_VERSION = 1;
const STORE_NAME = 'jobs';

let dbPromise = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('status', 'status');
        store.createIndex('createdAt', 'createdAt');
      },
    });
  }
  return dbPromise;
}

export async function getAllJobs() {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function addJob(job) {
  const db = await getDB();
  const id = await db.add(STORE_NAME, {
    ...job,
    createdAt: Date.now(),
  });
  return { ...job, id, createdAt: Date.now() };
}

export async function updateJob(job) {
  const db = await getDB();
  await db.put(STORE_NAME, job);
  return job;
}

export async function deleteJob(id) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function bulkAddJobs(jobs) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await Promise.all(jobs.map((j) => tx.store.put(j)));
  await tx.done;
}
