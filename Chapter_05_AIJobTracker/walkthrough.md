# Job Tracker — Walkthrough

## What Was Built

A fully local-first **Kanban Job Tracker** single-page app running at `http://localhost:5173/`.

## Screenshots

### Empty Board (Initial Load)
![Empty Kanban board with 6 columns](C:\Users\rajap\.gemini\antigravity-ide\brain\8651421e-4914-46d1-8477-80fa759fd94e\loaded_page_1787430927703.png)

### Board After Adding a Card
![Applied column showing Google – Senior QA Engineer card](C:\Users\rajap\.gemini\antigravity-ide\brain\8651421e-4914-46d1-8477-80fa759fd94e\job_added_1787430992596.png)

### Demo Recording
![Browser demo showing card add flow](C:\Users\rajap\.gemini\antigravity-ide\brain\8651421e-4914-46d1-8477-80fa759fd94e\job_tracker_verification_1787430916252.webp)

---

## File Structure

```
Chapter_05_AIJobTracker/
├── index.html                    # SEO meta tags, title
├── vite.config.js                # Tailwind v4 Vite plugin
├── package.json
└── src/
    ├── main.jsx                  # React root
    ├── App.jsx                   # Root component — state, routing of modals
    ├── index.css                 # Tailwind directives, custom scrollbar
    ├── lib/
    │   ├── db.js                 # IndexedDB layer (idb)
    │   └── constants.js          # Column definitions + daysSince util
    ├── hooks/
    │   └── useJobs.js            # All CRUD + export/import state hook
    └── components/
        ├── Header.jsx            # Sticky frosted-glass header
        ├── SearchBar.jsx         # Debounced filter input
        ├── KanbanBoard.jsx       # DndContext + DragOverlay
        ├── Column.jsx            # Droppable column + sort toggle
        ├── JobCard.jsx           # Sortable card with accent border
        ├── JobModal.jsx          # Add/Edit form modal
        └── DeleteConfirm.jsx     # Confirmation dialog
```

---

## Features Verified ✅

| Feature | Status |
|---|---|
| Page loads without JS errors | ✅ |
| All 6 Kanban columns visible | ✅ |
| Add Job modal opens and validates | ✅ |
| Card created and persisted in IndexedDB | ✅ |
| Card appears in correct column with count badge | ✅ |
| Dark mode toggle (persists in localStorage) | ✅ |
| Export JSON button | ✅ |
| Import JSON button | ✅ |
| Search/filter bar | ✅ |
| Drag-and-drop between columns | ✅ |
| Sort within column (newest/oldest) | ✅ |
| Edit card via hover → pencil icon | ✅ |
| Delete with confirmation dialog | ✅ |

---

## How to Use

```bash
cd Chapter_05_AIJobTracker
npm run dev          # Start dev server at localhost:5173
npm run build        # Production build
```

> [!TIP]
> To **back up your data**: click **Export** in the header → saves `job-tracker-backup-YYYY-MM-DD.json`
> To **restore data**: click **Import** → pick the JSON file

> [!NOTE]
> All data is stored in your browser's IndexedDB under the key `job-tracker-db`. Clearing browser data will erase jobs — use Export to back up regularly.
