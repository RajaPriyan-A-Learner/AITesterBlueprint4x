# Implementation Plan: Phase 3 — AI Intelligence Suite for AIJobTracker

Equip **AIJobTracker** (`Chapter_05_AIJobTracker`) with local-first AI intelligence: **Job Description Parser**, **ATS Keyword Match Score Calculator**, and **1-Click AI Cover Letter & Recruiter Outreach Generator** (powered by local Ollama with instant offline fallback).

---

## User Review Required

> [!NOTE]
> All AI features connect to your local Ollama instance (`http://localhost:11434` or local endpoints) and include a built-in instant client-side NLP engine that functions with zero dependencies even if Ollama is offline.

---

## Proposed Changes

### AI Service & Extraction Layer

#### [NEW] [aiService.js](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/services/aiService.js)
- **Local Ollama Integration & Hybrid Fallback Engine**:
  - `parseJobDescription(jdText)`: Extracts structured company, role, required skills, salary range, and key responsibilities.
  - `calculateATSScore(job, candidateProfile)`: Evaluates keyword overlap, technical stack alignment, and produces a $0 - 100\%$ ATS Score with matched vs missing keywords and tailored resume improvement tips.
  - `generateOutreachMessages(job, candidateProfile, templateType)`: Generates:
    1. *Tailored Cover Letter*
    2. *LinkedIn Recruiter Connection Note* (< 300 chars)
    3. *Hiring Manager Cold Email*

---

### UI Components Layer

#### [NEW] [JDParserModal.jsx](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/JDParserModal.jsx)
- Fast Paste & Parse modal:
  - Users paste messy job descriptions from LinkedIn/Indeed.
  - Live AI extraction displays extracted Company, Title, Tech Stack tags, and Salary.
  - One-click **"Create Application"** or **"Fill Current Form"**.

---

#### [NEW] [ATSScoreModal.jsx](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/ATSScoreModal.jsx)
- Visual ATS score audit modal:
  - Circular animated match score ring ($0 - 100\%$).
  - **Matched Skills Matrix** (Green badges) vs **Missing Keywords** (Red badges).
  - **AI Recommendation Checklist**: Concrete tips to update the resume before applying.

---

#### [NEW] [AIOutreachModal.jsx](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/AIOutreachModal.jsx)
- 3-in-1 Outreach Generation studio:
  - Tab 1: **Tailored Cover Letter** (Full document format)
  - Tab 2: **LinkedIn Connection Note** (Optimized for 300 char limits)
  - Tab 3: **Hiring Manager Cold Email** (Subject line + pitch)
  - Interactive controls: One-click copy, Tone selector (*Professional, Direct, Enthusiastic*), and export to `.txt`.

---

#### [MODIFY] [JobCard.jsx](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/JobCard.jsx) & [TableView.jsx](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/TableView.jsx)
- Add glowing **AI Actions Pill**:
  - `✨ ATS Score` badge (e.g. `🎯 85% ATS`).
  - `✍️ AI Outreach` button opening the outreach generator.

---

#### [MODIFY] [App.jsx](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/App.jsx) & [Header.jsx](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/Header.jsx)
- Add **"✨ Parse JD"** button in the header toolbar and Command Palette.
- Wire modals for ATS evaluation and AI Outreach.

---

## Verification Plan

### Automated Tests
- `npm run build` in `Chapter_05_AIJobTracker`.
- `npm run lint` (`oxlint`).

### Manual Verification
1. **JD Parser**: Paste a raw LinkedIn JD; verify extracted fields populate job modal accurately.
2. **ATS Match Calculator**: Open ATS score for an application; verify matched/missing skill badges and match score score ring.
3. **AI Cover Letter & Outreach**: Generate Cover Letter, LinkedIn note, and Cold Email; verify 1-click clipboard copy and tone toggle.

---

## Proposed Changes

### Component & View Layer

#### [NEW] [TableView.jsx](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/TableView.jsx)
- Interactive, spreadsheet-style table view for bulk triage:
  - **Company & Role**: Avatar + company title + link to LinkedIn.
  - **Priority**: Color-coded badges (`🔥 High`, `⭐ Medium`, `☕ Low`).
  - **Stage**: Instant dropdown stage switcher (`Wishlist` $\rightarrow$ `Applied` $\rightarrow$ `Interview` etc.).
  - **Checklist Progress**: Visual mini-progress bar showing completed steps (e.g. `3/5 done`).
  - **Date Applied & Salary**: Sortable columns.
  - **Actions**: Edit and Delete triggers.

---

#### [NEW] [CommandPalette.jsx](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/CommandPalette.jsx)
- Spotlight-style dialog triggered via <kbd>Ctrl + K</kbd> (or <kbd>Cmd + K</kbd>) or clicking search:
  - **Fast search & jump** to any company application.
  - **Quick commands**:
    - `Add new job application` (<kbd>N</kbd>)
    - `Switch to Kanban view` / `Switch to Table view`
    - `Export backup JSON`
    - `Toggle Dark / Light theme`
    - `Filter by High Priority`
  - Keyboard navigation (<kbd>↑</kbd>, <kbd>↓</kbd>, <kbd>Enter</kbd>, <kbd>Esc</kbd>).

---

#### [MODIFY] [JobModal.jsx](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/JobModal.jsx)
- Add interactive **Application Action Checklist** section:
  - ☑️ Tailor resume & keywords for role
  - ☑️ Submit application on official portal
  - ⬜ Connect with hiring manager / recruiter on LinkedIn
  - ⬜ Prepare role-specific STAR stories & questions
  - ⬜ Send follow-up note after 7 days
- Users can toggle items or add custom checklist tasks.

---

#### [MODIFY] [JobCard.jsx](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/components/JobCard.jsx)
- Display a clickable mini **Checklist Progress Pill** (e.g. `2/5 tasks`) with a quick interactive popover to check off tasks directly from the board.

---

#### [MODIFY] [App.jsx](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_05_AIJobTracker/src/App.jsx)
- Add `viewMode` state (`'kanban'` | `'table'`) persisted in `localStorage`.
- Add View Switcher toggle buttons in the toolbar (`LayoutGrid` vs `ListOrdered`).
- Add global keyboard listener for <kbd>Ctrl + K</kbd> / <kbd>Cmd + K</kbd> to open `CommandPalette`.

---

## Verification Plan

### Automated Verification
- Run `npm run build` in `Chapter_05_AIJobTracker` to ensure clean build.
- Run `npm run lint` (`oxlint`).

### Manual Verification
1. **View Toggle**: Switch between Kanban Board and Table View smoothly; verify data and filter consistency.
2. **Table View**: Test stage change dropdown, sorting by date/company, and edit/delete actions inside Table View.
3. **Application Checklist**: Check off checklist items in JobModal and on JobCard popover; verify persistence in IndexedDB.
4. **Command Palette**: Press <kbd>Ctrl + K</kbd>; search for companies, execute quick commands (Add Job, Switch Theme, Switch View).

---

## Verification Plan

### Automated Build & Lint
- Run `npm run build` in `Chapter_05_AIJobTracker` to ensure clean TypeScript/JSX compilation.
- Run `npm run lint` (`oxlint`).

### Manual Verification
1. Verify Stats Funnel updates dynamically when jobs are added, moved, or deleted.
2. Verify Priority selector works in JobModal and displays on JobCard.
3. Verify Quick Status dropdown moves cards across columns immediately.
4. Verify Confetti triggers upon moving any card into `Offer 🎉`.
5. Verify Dark / Light mode visual harmony.
