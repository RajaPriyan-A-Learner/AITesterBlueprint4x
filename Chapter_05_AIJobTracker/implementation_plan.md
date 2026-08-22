# Local-First Job Tracker — Implementation Plan

A fully offline, single-page Kanban Job Tracker built with Vite + React 18 + Tailwind CSS + IndexedDB (`idb`) + `@dnd-kit/core`.

## Proposed Changes

### Project Bootstrap

#### [NEW] Vite + React project scaffolded inside `Chapter_05_AIJobTracker/`

Run `npx create-vite@latest . --template react` inside the target folder, then install:
- `tailwindcss`, `@tailwindcss/vite` — styling
- `idb` — async IndexedDB wrapper
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` — drag-and-drop
- `lucide-react` — icons (LinkedIn, trash, edit, export, etc.)

---

### Data Layer (`src/lib/`)

#### [NEW] `db.js`
- Opens/upgrades an `idb` database called `job-tracker-db` (version 1)
- Object store: `jobs` with auto-increment key, indexes on `status` and `createdAt`
- Exports: `getAllJobs()`, `addJob()`, `updateJob()`, `deleteJob()`

---

### State Management (`src/hooks/`)

#### [NEW] `useJobs.js`
Custom hook that:
- Loads all jobs from IndexedDB on mount
- Exposes `addJob`, `updateJob`, `deleteJob`, `moveJob` (status change)
- Keeps a local `jobs[]` array in sync — all writes go to IDB immediately

---

### Data Model

```js
{
  id: number,           // auto-increment IDB key
  company: string,      // required
  role: string,         // required
  linkedinUrl: string,
  resumeUsed: string,   // from dropdown or free text
  dateApplied: string,  // ISO date, defaults to today
  salaryRange: string,
  notes: string,
  status: 'wishlist' | 'applied' | 'followup' | 'interview' | 'offer' | 'rejected',
  createdAt: number,    // Date.now() timestamp
  order: number         // for within-column sort
}
```

---

### UI Components (`src/components/`)

#### [NEW] `App.jsx`
- Top-level: renders `<Header>`, `<SearchBar>`, `<KanbanBoard>`
- Provides `useJobs` state down as props / context

#### [NEW] `Header.jsx`
- App title, light/dark mode toggle, Export JSON button, Import JSON button

#### [NEW] `SearchBar.jsx`
- Debounced text input that filters cards by company or role

#### [NEW] `KanbanBoard.jsx`
- Renders all 6 columns side-by-side in a horizontally-scrollable container
- Wraps everything in `DndContext` from `@dnd-kit/core`
- Handles `onDragEnd` → calls `moveJob(id, newStatus)`

#### [NEW] `Column.jsx`
- Props: `id`, `title`, `color`, `cards[]`
- Shows column header + card count badge
- Renders `SortableContext` wrapping `JobCard` list
- Scrollable vertically (`overflow-y-auto`)
- "+ Add Card" button (or floating action in header)

#### [NEW] `JobCard.jsx`
- Shows: Company name, Role, Resume tag pill, Days-since-applied badge, LinkedIn icon (clickable link)
- Left border accent color by status
- Hover → shows Edit / Delete icon buttons
- Draggable via `@dnd-kit/sortable`

#### [NEW] `JobModal.jsx`
- Slide-over / centered modal for Add and Edit
- Fields: Company*, Role*, LinkedIn URL, Resume (dropdown + free text), Date Applied, Salary Range, Notes
- Validates required fields; shows inline errors
- Saves on Submit → calls `addJob` or `updateJob`

#### [NEW] `DeleteConfirm.jsx`
- Small confirmation dialog before deleting a card

---

### Styling

#### [NEW] `tailwind.config.js`
- Dark mode: `class` strategy
- Extend colors for 6 column accent colors:
  - wishlist: indigo, applied: sky, followup: amber, interview: violet, offer: emerald, rejected: rose

#### [NEW] `src/index.css`
- Tailwind base directives
- Custom scrollbar styles, smooth transitions

---

### Nice-to-Have (all implemented)

| Feature | Approach |
|---|---|
| Light/Dark toggle | `document.documentElement.classList.toggle('dark')`, persisted in localStorage |
| Export JSON | `JSON.stringify(allJobs)` → download as `job-tracker-backup.json` |
| Import JSON | File input → parse JSON → bulk-upsert into IDB |
| Sort within column | Toggle button per column: newest / oldest by `dateApplied` |

---

## Verification Plan

### Automated
- `npm run dev` — dev server starts without errors
- `npm run build` — production build succeeds

### Manual
1. Add a card → appears in correct column, persists after page refresh
2. Drag a card across columns → status updates in IDB
3. Edit a card → changes persist
4. Delete a card → removed from board and IDB
5. Search bar filters cards in real time
6. Dark mode toggle persists across refresh
7. Export → valid JSON downloaded; Import → data restored
