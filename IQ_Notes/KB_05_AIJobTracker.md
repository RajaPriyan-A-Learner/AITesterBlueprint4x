# Knowledge Base: AI Job Tracker — Local-First Kanban Job Board

**Last Updated**: 2026-08-23
**Audience**: QA Engineers, SDETs, Frontend Engineers, AI Learners
**Level**: Intermediate
**Source Chapter**: Chapter_05_AIJobTracker

---

## TABLE OF CONTENTS

1. [Context: Chapter Focus & Industry Shift](#context)
2. [Core Concepts & Definitions](#concepts)
3. [Technical Deep-Dives: The Data Layer](#technical)
4. [Architecture & Patterns](#architecture)
5. [Application: Practical Examples](#application)
6. [Common Pitfalls & How to Avoid](#pitfalls)
7. [Interview Q&A](#qa)
8. [Quick Reference](#quickref)
9. [Reference & Resources](#reference)

---

## Context: Chapter Focus & Industry Shift
<a id="context"></a>

Chapter 05 continues the career-tooling arc by building the **interface layer** that Chapter 04's resume-tailor pipeline was missing: a structured, persistent system to track every job application from wishlist to offer or rejection. Where Chapter 04 automated the resume production side, Chapter 05 automates the tracking side — giving a complete, local-first workflow with no dependency on SaaS tools, no sign-ups, and no data leaving the browser.

### Why This Matters?

Senior engineers applying to multiple roles simultaneously face the same problem: managing 15–30 simultaneous applications across email, spreadsheets, and LinkedIn tabs results in missed follow-ups, forgotten deadlines, and confusion about which resume was sent where. Chapter 05 demonstrates:

- Building a **production-grade, local-first** SPA with React 18 + Vite — no backend required
- Using **IndexedDB** (`idb` library) as a browser-native persistent store — data survives page refresh, tab close, and browser restart
- Implementing **Kanban drag-and-drop** (`@dnd-kit`) with smooth UX patterns derived from tools like Linear and Trello
- Applying **progressive enhancement** — light/dark mode, JSON export/import backup, per-column sort — all without a server

Source: [implementation_plan.md](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/implementation_plan.md), lines 1–4

### Real-World Application

Rajapriyan's tracker stores every job applied to during the active job search: company, role, resume used (linked to Chapter 04 output files), LinkedIn URL, date applied, salary range, notes, and current status. The Kanban board provides a visual pipeline view matching how a QA lead thinks — stages, status, and action items.

Source: [walkthrough.md](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/walkthrough.md), lines 1–7

---

## Core Concepts & Definitions
<a id="concepts"></a>

### Local-First Architecture
An application design where **all user data is stored and processed on the user's own device** — no server, no cloud database, no authentication. The browser is the backend. Chapter 05 uses IndexedDB as the persistence layer, which gives:

- **Offline-first**: works without internet connection after first load
- **Zero latency reads**: no network round trip for CRUD
- **Privacy by default**: data never leaves the device
- **No vendor lock-in**: export/import JSON is the "sync" mechanism

Source: [implementation_plan.md](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/implementation_plan.md), lines 1–3

### IndexedDB
A browser-native NoSQL key-value object store. Unlike `localStorage` (string-only, 5 MB limit, synchronous), IndexedDB:
- Stores structured JavaScript objects natively
- Supports indexes (query by status, date, etc.)
- Asynchronous API (non-blocking)
- Can hold hundreds of MB of data
- Survives browser close/restart

The raw IndexedDB API is verbose; the `idb` npm library wraps it in a clean Promise/async API.

Source: [db.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/lib/db.js), lines 1–24

### idb Library
A tiny (3 KB gzipped) Promise-based wrapper around IndexedDB by Jake Archibald. Key function: `openDB(name, version, { upgrade })` — opens an existing database or creates one on first visit. The `upgrade` callback runs only when the database version changes, making schema migrations safe.

Source: [db.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/lib/db.js), lines 9–23

### Kanban Board
A visual project management pattern using columns to represent workflow stages. Each card moves left-to-right (or back) as its status changes. In the Job Tracker:

| Column | Status ID | Meaning |
|--------|-----------|---------|
| Wishlist | `wishlist` | Saved but not yet applied |
| Applied | `applied` | Application submitted |
| Follow-up | `followup` | Followed up with recruiter/referral |
| Interview | `interview` | Currently in interview rounds |
| Offer 🎉 | `offer` | Received an offer |
| Rejected | `rejected` | Got a rejection |

Source: [constants.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/lib/constants.js), lines 1–8

### @dnd-kit
A modern, accessible drag-and-drop library for React. Two core packages used:
- **`@dnd-kit/core`** — `DndContext`, `DragOverlay`, sensors (PointerSensor)
- **`@dnd-kit/sortable`** — `SortableContext`, `useSortable`, `verticalListSortingStrategy`
- **`@dnd-kit/utilities`** — `CSS.Transform.toString()` for animating drag position

Source: [KanbanBoard.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/KanbanBoard.jsx), lines 1–6

### Custom React Hook (`useJobs`)
A React hook that owns all job state and exposes clean operations. Follows the **single responsibility principle** — `App.jsx` doesn't touch IndexedDB directly. The hook:
- Loads data on mount (once, from IDB)
- Keeps an in-memory `jobs[]` array in sync with every write
- Exposes: `addJob`, `updateJob`, `deleteJob`, `moveJob`, `exportData`, `importData`

Source: [useJobs.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/hooks/useJobs.js), lines 1–65

---

## Technical Deep-Dives: The Data Layer
<a id="technical"></a>

### IndexedDB Schema

```
Database: job-tracker-db (version 1)
  Object Store: jobs
    keyPath: 'id' (autoIncrement: true)
    Indexes:
      - 'status'    → query all jobs in a column
      - 'createdAt' → query newest/oldest jobs
```

Source: [db.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/lib/db.js), lines 12–19

### Job Data Model

```js
{
  id: number,           // Auto-increment IDB key
  company: string,      // Required — company name
  role: string,         // Required — job title / role
  linkedinUrl: string,  // Optional — clickable URL
  resumeUsed: string,   // Optional — ties back to Chapter 04 outputs
  dateApplied: string,  // ISO date (YYYY-MM-DD), defaults to today
  salaryRange: string,  // Optional — e.g., "₹25-30 LPA" or "$150-180K"
  notes: string,        // Optional — recruiter, referral, round details
  status: 'wishlist' | 'applied' | 'followup' | 'interview' | 'offer' | 'rejected',
  createdAt: number,    // Date.now() timestamp — set on creation, never changed
}
```

Source: [implementation_plan.md](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/implementation_plan.md), lines 40–54

### CRUD Operations (db.js)

```js
// Read all — called once on mount
getAllJobs()   → db.getAll('jobs')

// Create — returns the saved object with the auto-assigned id
addJob(job)   → db.add('jobs', { ...job, createdAt: Date.now() })

// Update — overwrites entire object (put = upsert)
updateJob(job) → db.put('jobs', job)

// Delete — by primary key
deleteJob(id)  → db.delete('jobs', id)

// Bulk import — single transaction for atomicity
bulkAddJobs(jobs) → tx = db.transaction('jobs', 'readwrite')
                    jobs.forEach(j => tx.store.put(j))
                    tx.done
```

Source: [db.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/lib/db.js), lines 25–55

### Optimistic UI Pattern (`moveJob`)

When dragging a card between columns, the status update is applied **optimistically** to the local state immediately, then persisted to IDB in the background. This gives instant visual feedback with no loading state:

```js
const moveJob = useCallback(async (id, newStatus) => {
  setJobs((prev) => {
    const updated = { ...job, status: newStatus };
    dbUpdate(updated);              // Fire-and-forget IDB write
    return prev.map(j => j.id === id ? updated : j); // Immediate UI update
  });
}, []);
```

Source: [useJobs.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/hooks/useJobs.js), lines 32–40

### Export/Import Mechanism

```js
// Export — serialize in-memory array to JSON file download
exportData() → new Blob([JSON.stringify(jobs, null, 2)], { type: 'application/json' })
             → URL.createObjectURL(blob)
             → anchor click download

// Import — read file, parse, bulk-upsert, reload from IDB
importData(file) → file.text() → JSON.parse()
                 → bulkAddJobs(imported) → getAllJobs() → setJobs(fresh)
```

Source: [useJobs.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/hooks/useJobs.js), lines 45–62

### Drag-and-Drop Pipeline

```
User picks up card (PointerSensor activates at 8px movement)
  ↓
DragOverlay renders ghost copy of card (rotated 2deg, scaled 1.05)
  ↓
DragEnd fires:
  → active.id = job ID being dragged
  → over.id = target (column id string OR another job's id)
  → If over.id is a column id → moveJob(active.id, over.id)
  → If over.id is a job id → get that job's status → moveJob
  ↓
KanbanBoard calls onMoveJob → useJobs.moveJob → optimistic update + IDB write
```

Source: [KanbanBoard.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/KanbanBoard.jsx), lines 17–46

---

## Architecture & Patterns
<a id="architecture"></a>

### Pattern: Unidirectional Data Flow
All state lives in `useJobs` hook at the `App.jsx` level. Components are **pure presentational** — they receive data as props and call handler functions. No component writes directly to IndexedDB. This mirrors React's recommended pattern and makes the app easy to test.

```
IndexedDB ↔ useJobs (state) → App.jsx → KanbanBoard → Column → JobCard
                                      ↘ JobModal (add/edit)
                                      ↘ DeleteConfirm
```

Source: [App.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/App.jsx), lines 1–85

### Pattern: Lazy DB Initialization (Singleton Promise)
`db.js` exports functions, not a db instance. The `getDB()` function is called inside each exported function and uses a module-level `dbPromise` singleton. The database is initialized only on first call and reused for all subsequent calls — no premature connection at import time.

Source: [db.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/lib/db.js), lines 7–23

### Pattern: Resume Datalist from Existing Data
The `resumeUsed` field in `JobModal` uses an HTML `<datalist>` populated from a deduplicated set of resume names already on existing cards (`useJobs.resumeNames`). No separate "manage resumes" screen is needed — the history self-populates. New names can be typed freely.

```js
// useJobs.js — derived from live jobs array
const resumeNames = [...new Set(jobs.map(j => j.resumeUsed).filter(Boolean))];
```

Source: [useJobs.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/hooks/useJobs.js), line 43

### Pattern: Dark Mode via Class Strategy
Dark mode uses Tailwind's `class` strategy: toggling `dark` on `<html>` allows every component to use `dark:` variants. The mode is stored in `localStorage` and initialized before React mounts (read in `useState` initializer) — no flash of wrong theme.

```js
const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem('jt-dark');
  if (saved !== null) return saved === 'true';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
});
```

Source: [App.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/App.jsx), lines 18–24

### Pattern: Status Accent Colors as Design System
All 6 column colors are defined once in `constants.js` as a COLUMNS array — each object contains the hex color, Tailwind bg/border/badge class strings. Components import `getColumn(id)` to get the full style definition. No color logic is scattered in individual components.

Source: [constants.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/lib/constants.js), lines 1–14

### Pattern: `useDroppable` + `SortableContext` per Column
Each column registers itself as a droppable zone via `useDroppable({ id: column.id })`. Inside, `SortableContext` enables within-column card reordering. When a card is dragged from one column's `SortableContext` to another column's `useDroppable` drop zone, `@dnd-kit/core` detects the cross-column drop and `onDragEnd` fires with `over.id` = the column's string id.

Source: [Column.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/Column.jsx), lines 14–16; [KanbanBoard.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/KanbanBoard.jsx), lines 32–44

---

## Application: Practical Examples
<a id="application"></a>

### Feature: Add a Job Card

1. Click **"+ Add Job"** (toolbar) OR **"+ Add card"** (column footer)
2. `JobModal` opens pre-filled with today's date and the clicked column's status
3. Fill Company (required), Role (required), optional fields
4. Submit → `handleSave` in `App.jsx` → `useJobs.addJob()` → `db.addJob()` → card appears in column

Validation enforced:
- Company and Role are required — red inline error shown if blank on submit
- LinkedIn URL must start with `http(s)://` if provided

Source: [JobModal.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/JobModal.jsx), lines 43–52; lines 66–77

### Feature: Drag a Card Between Columns

1. Hover over a card — grip handle appears (top-right, opacity 0 → 1 on hover)
2. Click and drag at least 8px to activate `PointerSensor`
3. `DragOverlay` renders a ghost card (rotated 2°, scaled 1.05)
4. Column highlights with indigo border when the card is over it (`isOver` from `useDroppable`)
5. Release → `onDragEnd` → `moveJob(id, targetStatus)` → IDB persisted instantly

Source: [KanbanBoard.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/KanbanBoard.jsx), lines 17–44; [JobCard.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/JobCard.jsx), lines 33–42

### Feature: Search & Filter

The search bar in the toolbar filters the `jobs[]` array using `useMemo`:

```js
const filteredJobs = useMemo(() => {
  if (!search.trim()) return jobs;
  const q = search.toLowerCase();
  return jobs.filter(j =>
    j.company.toLowerCase().includes(q) ||
    j.role.toLowerCase().includes(q)
  );
}, [jobs, search]);
```

`filteredJobs` (not `jobs`) is passed to `KanbanBoard`. Columns show only matching cards. A result count appears next to the search input.

Source: [App.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/App.jsx), lines 37–44

### Feature: Export & Import Backup

**Export**: Downloads a file named `job-tracker-backup-YYYY-MM-DD.json` containing the full `jobs[]` array serialized as pretty-printed JSON. No third-party service involved.

**Import**: User picks a `.json` file via file input. The file is read with `file.text()`, parsed, and each job is upserted into IDB via a single read-write transaction (`bulkAddJobs`). State is then refreshed from IDB to ensure consistency.

Source: [useJobs.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/hooks/useJobs.js), lines 45–62

### Feature: Per-Column Sort Toggle

Each column header has an `↕` sort toggle button. Clicking toggles between `'newest'` and `'oldest'`. The sorted array is derived via `useMemo` inside `Column.jsx` — the source `jobs[]` array is not mutated.

```js
const sorted = useMemo(() => {
  return [...cards].sort((a, b) => {
    const da = new Date(a.dateApplied || 0).getTime();
    const db = new Date(b.dateApplied || 0).getTime();
    return sortOrder === 'newest' ? db - da : da - db;
  });
}, [cards, sortOrder]);
```

Source: [Column.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/Column.jsx), lines 13–24

---

## Common Pitfalls & How to Avoid
<a id="pitfalls"></a>

| Pitfall | ❌ WRONG | ✅ RIGHT |
|---------|---------|---------|
| **IDB race condition** | Call `openDB` on every CRUD call | Use singleton `dbPromise` — open once, reuse |
| **Stale UI on drag** | Wait for IDB write before updating state | Apply optimistic update immediately, write IDB async |
| **Accidental drag** | Activate drag on any pointer movement | Set `PointerSensor` `distance: 8` threshold |
| **DragOverlay missing** | No visual feedback during drag | Add `<DragOverlay>` with ghost card outside column tree |
| **Dark mode flash** | Initialize dark state after render | Use `useState` lazy initializer reading localStorage before first paint |
| **Import overwrites** | Replace all jobs on import | Use `put` (upsert) in bulk transaction — preserves existing if same id |
| **Required field silent fail** | Form submits with empty fields | Validate before `onSave`, show inline error per field |
| **Resume dropdown stale** | Hard-code resume list | Derive from live `jobs[]` array — always reflects current data |

---

## Interview Q&A
<a id="qa"></a>

**Q1: Why use IndexedDB instead of localStorage for a job tracker?**
> `localStorage` is synchronous (blocks the main thread), string-only (requires JSON.stringify/parse for every object), and limited to ~5 MB. IndexedDB is asynchronous (non-blocking), stores structured JavaScript objects natively, supports indexes for efficient queries, and can handle hundreds of MB. For a Kanban app with potentially 50–100 job cards with rich metadata, IndexedDB is the correct choice.
> Source: db.js lines 1–24; implementation_plan.md line 3

**Q2: How does the `idb` library improve the IndexedDB developer experience?**
> The raw IndexedDB API uses event-based callbacks (`onsuccess`, `onerror`, `onupgradeneeded`) which are verbose and hard to compose. `idb` wraps the same operations in clean async/await Promise-based functions: `openDB()`, `db.getAll()`, `db.add()`, `db.put()`, `db.delete()`. This reduces boilerplate by 70% and makes the code readable without sacrificing any browser API capabilities.
> Source: db.js lines 9–55

**Q3: Explain the difference between `useDroppable` and `useSortable` in @dnd-kit.**
> `useDroppable` marks a DOM element as a valid drop target and provides `isOver` state (useful for column highlight on drag-over). `useSortable` marks an individual item as both draggable AND droppable within a `SortableContext` — it provides `transform`, `transition`, `isDragging` to animate the card's position during a drag. In the Job Tracker, columns use `useDroppable` and cards use `useSortable`.
> Source: Column.jsx lines 14–16; JobCard.jsx lines 22–31

**Q4: What is optimistic UI and why is it used in `moveJob`?**
> Optimistic UI applies state changes immediately to the local React state without waiting for the async persistence operation to complete. In `moveJob`, the card's status is updated in `jobs[]` synchronously (so the UI snaps instantly), while `dbUpdate()` is called as a fire-and-forget async call. If IDB fails (extremely rare in practice), the UI would be inconsistent — but the UX benefit of zero-latency drag-drop far outweighs this edge case for a local-only app.
> Source: useJobs.js lines 32–40

**Q5: How would you test the IndexedDB persistence layer of this app?**
> Unit test: use `fake-indexeddb` npm package to mock IDB in Node.js. Write tests for each exported function (`addJob`, `updateJob`, `deleteJob`, `getAllJobs`, `bulkAddJobs`). Integration test: use Playwright to open the app, add a card, close the tab, reopen, and assert the card is still visible. Also test: add a card → export JSON → clear IDB → import JSON → assert card restored.
> Source: walkthrough.md lines 50–64 (verified features)

**Q6: How does the dark mode implementation avoid a flash of wrong theme?**
> The `useState` initializer function reads `localStorage.getItem('jt-dark')` synchronously — this runs before React's first render, so the initial state is correct. Then a `useEffect` toggles the `dark` class on `<html>`. Because the state is already correct at first render, Tailwind's `dark:` variants apply from frame 1 without any flash.
> Source: App.jsx lines 18–25

**Q7: How does this app connect to the Chapter 04 AI Job Kit workflow?**
> The `resumeUsed` field on each job card is a direct link to Chapter 04's output — e.g., `"Resume_Woolworths_SrAutomationEng"`. A QA lead uses Chapter 04 to tailor resumes for specific roles, then tracks each application in Chapter 05. The datalist for `resumeUsed` auto-populates from all existing cards, reinforcing the naming convention without a separate settings screen.
> Source: implementation_plan.md line 47; useJobs.js line 43

---

## Quick Reference
<a id="quickref"></a>

```
Stack:       Vite + React 18 + Tailwind CSS v4 + idb + @dnd-kit
Run:         npm run dev  →  http://localhost:5173
Database:    IndexedDB — 'job-tracker-db' (v1) — 'jobs' object store
State:       useJobs hook — single source of truth for all job data
Components:  App → KanbanBoard → Column → JobCard
             App → JobModal (add/edit)
             App → DeleteConfirm
Data Model:  { id, company, role, linkedinUrl, resumeUsed,
               dateApplied, salaryRange, notes, status, createdAt }
Statuses:    wishlist | applied | followup | interview | offer | rejected
DnD:         PointerSensor (8px threshold) + closestCorners collision
Dark mode:   localStorage 'jt-dark' → class on <html>
Export:      JSON.stringify(jobs) → download
Import:      file.text() → JSON.parse() → bulkAddJobs (put/upsert)
```

---

## Reference & Resources
<a id="reference"></a>

| Resource | Path |
|----------|------|
| Implementation Plan | [implementation_plan.md](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/implementation_plan.md) |
| Walkthrough | [walkthrough.md](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/walkthrough.md) |
| IndexedDB Layer | [db.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/lib/db.js) |
| State Hook | [useJobs.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/hooks/useJobs.js) |
| Column Constants | [constants.js](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/lib/constants.js) |
| Root Component | [App.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/App.jsx) |
| Kanban Board | [KanbanBoard.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/KanbanBoard.jsx) |
| Column Component | [Column.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/Column.jsx) |
| Job Card | [JobCard.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/JobCard.jsx) |
| Job Modal | [JobModal.jsx](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/JobModal.jsx) |
| idb library docs | https://www.npmjs.com/package/idb |
| @dnd-kit docs | https://docs.dndkit.com/ |
| Chapter 04 KB | [KB_04_AIJobKit.md](file:///c:/Users/rajap/OneDrive/เอกสาร/LEARNINGAITESTER4X/IQ_Notes/KB_04_AIJobKit.md) |
