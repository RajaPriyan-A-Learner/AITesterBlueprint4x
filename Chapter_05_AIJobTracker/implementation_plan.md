# Executive KPI Analytics, 120-Day Activity Heatmap & Enhanced Job Cards Plan

Upgrade **AIJobTracker** to match the modern executive dashboard design, incorporating live KPI cards, a GitHub-style 120-day activity heatmap, tech stack & work mode filters, richer card tags, and referral tracking.

---

## Proposed Changes

### 1. Data Model & Schema Enhancement
* Add optional fields to application object with backward compatibility:
  - `workMode`: `'remote'` | `'hybrid'` | `'onsite'`
  - `skills`: array of strings e.g. `['Playwright', 'TypeScript', 'React']`
  - `referral`: string e.g. `'David Chen'`

---

### 2. Executive KPI Cards & Pipeline Metrics (`src/components/KPICards.jsx`)
* **Velocity Card**: Applications logged this week vs this month, with progress indicator.
* **Interview Rate Card**: Conversion percentage $( \frac{\text{Interviews + Offers}}{\text{Total Applied}} \times 100 )$, status trend.
* **Active Pipeline Value Card**: Smart salary parsing aggregating total pipeline earning potential (e.g. `$910k USD` or `₹1.2 Cr`).
* **Top Tech Demand Card**: Top 4 most frequent skills across active jobs with badge counts (e.g. `React (3)`, `Playwright (2)`, `AWS (2)`).

---

### 3. Application Activity Heatmap (`src/components/ActivityHeatmap.jsx`)
* 120-Day GitHub-style contribution matrix (17–18 weeks $\times$ 7 days).
* Density color scaling (`Less ⬛ 🟪 🟦 More`).
* Interactive tooltips showing exact date and applications logged.

---

### 4. Advanced Filter Toolbar & Pro Header
* Header subtitle: *`Local-First IT Pipeline • X Applications`* with *`✨ Pro`* badge.
* **Tech Stack Dropdown**: Filter applications by skill tag.
* **Work Mode Dropdown**: Filter by `All Modes`, `Remote`, `Hybrid`, `Onsite`.
* View Switcher: `⑈ Kanban`, `⊞ Table`, `📊 Metrics`.

---

### 5. Richer Job Cards & Modal Fields
* **JobCard & TableView**:
  - Upper-case company label with clean role hierarchy.
  - Skill pills on cards: up to 3 tags + `+N` overflow pill.
  - Work Mode pill (`Remote` 🟢, `Hybrid` 🔵, `Onsite` 🟣).
  - Referral badge (`👤 Ref: Name`).
  - Quick external link button directly next to role.
* **JobModal**:
  - Add inputs for Work Mode (Remote/Hybrid/Onsite), Tech Skills (comma-separated or tag chips), and Referral contact.

---

## Verification Plan

### Automated Build & Lint Verification
* Run `npm run build` in `Chapter_05_AIJobTracker` to verify zero bundle or syntax issues.
* Run `npm run lint` (`oxlint`) to verify clean code hygiene.

### Interactive User Testing
* Verify KPI metric numbers calculate accurately from IndexedDB data.
* Verify 120-day heatmap squares illuminate on matching application dates.
* Verify filter dropdowns (`All Tech Stacks`, `All Modes`) filter both Kanban and Table views.
* Verify switching between `Kanban`, `Table`, and `Metrics` views.
