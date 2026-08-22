# Knowledge Base: AI Job Kit — Automated Resume Tailoring with Honesty Gate

**Last Updated**: 2026-08-23
**Audience**: QA Engineers, SDETs, AI Learners, Job Seekers
**Level**: Intermediate to Advanced
**Source Chapter**: Chapter_04_AIJobKit

---

## TABLE OF CONTENTS

1. [Context: Chapter Focus & Industry Shift](#context)
2. [Core Concepts & Definitions](#concepts)
3. [Technical Deep-Dives: The Resume Tailor Pipeline](#technical)
4. [Architecture & Patterns](#architecture)
5. [Application: Practical Examples — Tailored Resumes](#application)
6. [The Honesty Gate — QA's Ethical Safety Net](#honesty)
7. [Common Pitfalls & How to Avoid](#pitfalls)
8. [Interview Q&A](#qa)
9. [Quick Reference](#quickref)
10. [Reference & Resources](#reference)

---

## Context: Chapter Focus & Industry Shift
<a id="context"></a>

Chapter 04 evolves the learning arc from **AI-powered test tooling** (Chapters 01–03) to **AI-powered career tooling** — applying the same agentic engineering mindset to automate one of the highest-friction tasks for any senior engineer: tailoring a resume to multiple job descriptions simultaneously.

### Why This Matters?

The modern job market demands keyword-optimized, role-specific resumes to pass Applicant Tracking Systems (ATS). Manually tailoring a resume for 10–25 roles is a multi-hour, error-prone task. Chapter 04 demonstrates how to:

- Use an AI **Skill** (resume-tailor) as a structured, rule-governed workflow — not a vague prompt
- Apply the **Honesty Gate** principle: AI must not fabricate experience to chase keyword matches
- Run **Batch Mode** — process a CSV of 25 JDs programmatically, generating one `.docx` per role with yellow-highlighted diffs
- Use `docx-js` (Node.js) to generate fully formatted Word documents ready for Google Docs / ATS submission

Source: [SKILL.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/resume-tailor/resume-tailor/SKILL.md), lines 1–8

### Real-World Application

Rajapriyan's master resume (Lead SDET, 8+ years, C#/.NET, SpecFlow, Selenium, Playwright, AI-Augmented Engineering) was processed against a LinkedIn CSV of 25 Test Engineering roles. Four highly tailored `.docx` resumes were auto-generated in the `/output` folder, each with yellow-highlighted JD-specific changes for transparent review.

Source: [walkthrough.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/walkthrough.md), lines 1–32

---

## Core Concepts & Definitions
<a id="concepts"></a>

### Resume Tailoring Skill
A structured AI skill (`resume-tailor`) that governs every step of the tailoring process. It acts as a **guardrail system** — not just a template filler — enforcing ethical rules at each step before any output is generated.

Source: [SKILL.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/resume-tailor/resume-tailor/SKILL.md), line 8

### The Honesty Gate
The most critical concept in this skill. Before generating any tailored content, the AI cross-references every JD requirement against the master resume's **actual** content and sorts into three buckets:

| Bucket | Definition | Action |
|--------|------------|--------|
| **True Overlap** | Candidate genuinely has this skill, possibly under different terminology | Safe to surface and re-word toward JD language |
| **Adjacent/Transferable** | Candidate has an equivalent, not the exact named tool (e.g., SpecFlow vs Cucumber) | Safe to mention **with honest parenthetical** — never claimed as the named tool |
| **Gap** | No evidence the person has done this at all | **DO NOT ADD.** Flag for user decision. |

Source: [SKILL.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/resume-tailor/resume-tailor/SKILL.md), lines 30–44

### Yellow Highlight Convention
Every word, phrase, or clause **added or reworded specifically to match a JD** is rendered with a yellow highlight in the `.docx` output. Unchanged original text remains plain. This makes every tailored edit auditable at a glance — the user can see the entire diff without re-reading the document.

Source: [style_guide.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/resume-tailor/resume-tailor/references/style_guide.md), lines 37–40

### Batch Mode
When the input is a spreadsheet or list of multiple JDs, the skill processes each row independently — each JD gets its own Honesty Gate check, its own tailoring pass, and its own uniquely named output file (`Resume_<Company>_<RoleShort>.docx`).

Source: [SKILL.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/resume-tailor/resume-tailor/SKILL.md), lines 59–66

---

## Technical Deep-Dives: The Resume Tailor Pipeline
<a id="technical"></a>

### Step-by-Step Workflow (from SKILL.md)

```
Step 1: Get Inputs
  ├── Master resume (docx / project files)
  └── Job description(s) (pasted, uploaded, or CSV rows)

Step 2: Extract JD Requirements
  ├── Required years + seniority level
  ├── Named tools, languages, frameworks, platforms
  ├── Core responsibilities (verbs matter!)
  ├── Domain/industry context (EdTech, Fintech, etc.)
  └── Soft requirements: leadership scope, cross-functional

Step 3: Honesty Gate
  ├── Cross-reference every JD requirement vs. master resume
  ├── Sort into True Overlap / Adjacent / Gap
  └── Stop & flag if overall seniority mismatch ≥ 1.5×

Step 4: Tailor the Resume
  ├── 1. Headline/title line — reposition toward target role
  ├── 2. Professional Summary — mirror JD phrasing where true
  ├── 3. Skills Section — reorder/relabel for JD-matching keywords
  ├── 4. Experience Bullets — reword 3–6 bullets to mirror JD verbs
  └── 5. Leave role titles, companies, dates UNCHANGED

Step 5: Batch Mode (for CSV inputs)
  └── Loop Steps 2–4 per JD row independently

Step 6: Build, Verify, Deliver
  ├── Write docx-js script, run with Node.js
  ├── Output: Resume_<Company>_<RoleShort>.docx
  └── Highlight summary: what changed and WHY (honesty basis)
```

Source: [SKILL.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/resume-tailor/resume-tailor/SKILL.md), lines 10–75

### docx-js Helper Functions

The `build_resume.js` script provides reusable helpers that encode the visual style guide:

| Helper | Purpose | Highlight? |
|--------|---------|------------|
| `r(text, opts)` | Plain/unchanged text run | No |
| `hl(text, opts)` | Tailored/JD-matched text run | Yes — Yellow |
| `heading(text)` | Section heading (navy, bold, uppercase, underline) | No |
| `bullet(children)` | Bullet list paragraph | No |
| `roleHeader(title, company, dates)` | Job title / company / date bar | No |
| `roleSubline(text)` | Italic context line under role header | No |
| `skillLine(label, children)` | Skills category line (bold label + mixed r/hl content) | Mixed |
| `statCell(number, label)` | Stat-strip table cell (metric + label) | No |

Source: [build_resume.js](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/resume-tailor/resume-tailor/scripts/build_resume.js), lines 34–103

### Visual Design System (from style_guide.md)

```
Color Palette:
  Navy   #1F3864  — Name, headings, accents
  Slate  #44546A  — Subheadings, dates, taglines
  LightBG #EEF1F6 — Stat-strip cell backgrounds
  Text   #222222  — Body text
  Yellow highlight — JD-tailored insertions only

Typography:
  Font: Calibri throughout
  Name: 36pt bold
  Title line: 22pt bold (slate)
  Section headings: 21pt bold uppercase + navy bottom border
  Body: 20pt (10pt word-processor equivalent)
  Stat numbers: 26pt bold (navy)
  Stat labels: 14pt bold (slate)

Page Setup:
  Margins: 620 twips (~0.43") all sides
```

Source: [style_guide.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/resume-tailor/resume-tailor/references/style_guide.md), lines 5–16

---

## Architecture & Patterns
<a id="architecture"></a>

### Pattern: Skill-as-Constitution
Chapter 04 demonstrates using a `.md` Skill file not just as instructions, but as a **constitution** — a binding ruleset that governs AI behavior. The SKILL.md's "Hard Rules" section (lines 77–85) are non-negotiable constraints, mimicking how test automation frameworks have mandatory exit criteria.

### Pattern: Transparent AI Diff (Highlight-as-Diff)
Instead of delivering a finished, opaque document where the user must spot what changed, every tailored edit is wrapped in `hl()` (yellow). This is the resume equivalent of a code diff — the user reviews highlighted lines, not the entire document.

### Pattern: Batch-First, Independent-per-Row
Each CSV row is processed as a completely independent tailoring job with its own Honesty Gate check. A good match for Woolworths does not exempt Pine Labs from the same scrutiny. This prevents "gate-collapse" where early approvals lower the quality bar for subsequent items.

### Pattern: Honest Parenthetical for Transferable Skills
When a JD names a specific tool the candidate hasn't used (e.g., Cucumber) but the candidate has a genuine equivalent (SpecFlow), the output uses: `"SpecFlow BDD (equivalent to Cucumber)"`. This is honest, ATS-friendly, and transparent to the reader.

Source: [SKILL.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/resume-tailor/resume-tailor/SKILL.md), lines 33, 78–85

---

## Application: Practical Examples — Tailored Resumes
<a id="application"></a>

### Jobs Processed: 25 from LinkedIn CSV
Source: [linkedin_jobs_test_engineer_page1.csv](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/linkedin_jobs_test_engineer_page1.csv)

### Honesty Gate Outcomes

| Company | Role | Gate Result | Reason |
|---------|------|-------------|--------|
| AMD | System Testing & Automation Eng | ❌ Hard Gap | Requires networking kernel/VMware/C-Python — no evidence in resume |
| Woolworths Group | Senior Automation Engineer (C#) | ✅ Strong Match | C#, Playwright, CI/CD, Agentic Engineering — perfect overlap |
| TEKsystems | Senior Quality Assurance Engineer | ✅ Strong Match | Playwright TypeScript — candidate has this from Virtusa pilot |
| Pearson | Senior Quality Assurance Engineer | ✅ Transferable | Java/Cucumber → C#/SpecFlow named honestly with parenthetical |
| Pine Labs | SDET III | ✅ Transferable | Fintech domain: CBA banking. Flutter → Appium (adjacent, named honestly) |

Source: [implementation_plan.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/implementation_plan.md), lines 10–18

### Generated Output Files
All files located at: `Chapter_04_AIJobKit/output/`

| File | Company | Tailored Elements |
|------|---------|------------------|
| `Resume_Woolworths_SrAutomationEng.docx` | Woolworths Group | Cloud-Native Architecture, Playwright, Agentic Engineering |
| `Resume_TEKsystems_SrQAEng.docx` | TEKsystems | TypeScript/JS Playwright, JSON/XML API validation |
| `Resume_Pearson_SrQAEng.docx` | Pearson | EdTech domain, SpecFlow as Cucumber equivalent, Agile ceremonies |
| `Resume_PineLabs_SDET_III.docx` | Pine Labs | Payments/Fintech domain, Appium/mobile, AI-aggressive workflows |

Source: [walkthrough.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/walkthrough.md), lines 7–28

### How the Batch Script Works

```javascript
// Each resume call is fully independent
buildResume("Woolworths", "SrAutomationEng", {
  headline: [r("Senior Quality Engineer · "), hl("Cloud-Native Architecture"), r(" · Quality Engineering Leader")],
  summary: [...],   // Array of r() and hl() TextRun objects
  skills: { automation: [...], languages: [...], cicd: [...], domain: [...], ai: [...] },
  virtusaBullets: [...],  // Each bullet: array of r()/hl() mixed runs
  hclBullets: [...]
});
// Packer.toBuffer() writes Resume_Woolworths_SrAutomationEng.docx
```

Source: [batch_build_resumes.js](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/output/batch_build_resumes.js), lines 121–170

---

## The Honesty Gate — QA's Ethical Safety Net
<a id="honesty"></a>

The Honesty Gate is the most transferable concept from Chapter 04 — it applies to any domain where AI is used to generate professional output on behalf of a human.

### Hard Rules (from SKILL.md — Non-Negotiable)

1. **Never invent** years of experience, employers, job titles, degrees, or certifications.
2. **Never claim** a named tool/platform/language the user hasn't confirmed they've used — name the honest substitute instead.
3. **Never claim** a job function (consulting, people management, architecture-at-scale) not supported by the resume's actual history.
4. **Never fabricate** a metric (%, time saved, dollar figure) — describe qualitatively if no real number exists.
5. **Always flag** large seniority/function mismatches before building anything, and let the user choose.
6. **Always highlight** every tailored change — an un-highlighted edit defeats the entire purpose.

Source: [SKILL.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/resume-tailor/resume-tailor/SKILL.md), lines 77–85

### Seniority Mismatch Threshold
If the JD's overall seniority bar is roughly **1.5× the candidate's actual experience** (e.g., a 15-year practice-lead/consulting role vs. an 8-year hands-on engineer), the skill **stops** and presents a gap table before generating anything.

---

## Common Pitfalls & How to Avoid
<a id="pitfalls"></a>

| Pitfall | ❌ WRONG | ✅ RIGHT |
|---------|---------|---------|
| **Gate collapse** | One JD passes → skip honesty check for next JD | Run honesty gate independently per JD, every time |
| **Keyword injection** | Adding "Kubernetes" because JD mentions it | Only surface if candidate has actually used it |
| **Tool aliasing without label** | "I have Cucumber experience" (have SpecFlow) | "SpecFlow BDD (equivalent to Cucumber)" |
| **Metric fabrication** | "Reduced costs by 40%" when no metric exists | Describe qualitatively: "Reduced infrastructure footprint" |
| **Unhighlighted edits** | Quietly rewording a bullet to match JD | Wrap every reworded span in `hl()` |
| **Entire-bullet highlight** | Highlighting unchanged original text | Highlight ONLY the inserted/reworded span |
| **Skipping gap disclosure** | Silently not mentioning what the JD asks for that isn't in the resume | Explicitly call out gaps in the delivery summary |
| **Seniority upgrade** | Changing "contributed to" → "led enterprise architecture" | Only upgrade wording when candidate's history genuinely supports it |

---

## Interview Q&A
<a id="qa"></a>

**Q1: What is the Honesty Gate and why is it the most critical part of resume tailoring with AI?**
> The Honesty Gate is a mandatory cross-reference step before any tailoring begins. Every JD requirement is sorted into True Overlap, Transferable, or Gap. Gaps are never added — this prevents the candidate from misrepresenting themselves, which would fail at interview and damage credibility. It's the resume equivalent of test exit criteria: quality cannot be achieved by skipping the gate.
> Source: SKILL.md lines 28–44

**Q2: How does the yellow-highlight convention make AI-tailored resumes safer to use?**
> Every JD-driven word, phrase, or clause is rendered with a yellow highlight via `hl()` in the docx-js output. This gives the candidate a full visual diff of every change made specifically for that job. They can audit the edits in seconds instead of re-reading the entire document — making the AI's work transparent and reviewable before submission.
> Source: style_guide.md lines 37–40; SKILL.md line 57

**Q3: How do you handle Batch Mode — processing 25 JDs from a CSV?**
> Each CSV row is processed as a completely independent tailoring job: extract JD requirements, run the Honesty Gate, tailor the resume, and output `Resume_<Company>_<RoleShort>.docx`. A good match for one row never exempts another row from the same Honesty Gate scrutiny. Hard gaps are listed separately at the end so the user can decide how to proceed.
> Source: SKILL.md lines 59–66

**Q4: When is a tool substitution honest vs. dishonest in a tailored resume?**
> A substitution is honest when the candidate genuinely has the equivalent skill and the output names the substitution explicitly: e.g., "SpecFlow BDD (equivalent to Cucumber)". It is dishonest when the substitution is claimed as the named tool itself (writing "Cucumber" when only SpecFlow was used) or when the tools are not genuine equivalents.
> Source: SKILL.md lines 33; walkthrough.md Pearson section

**Q5: How did you apply AI-augmented engineering in Chapter 04?**
> A `docx-js` Node.js batch script was written that uses a structured `buildResume(company, role, adjustments)` function to generate multiple tailored Word documents. The `adjustments` object contains arrays of `r()` and `hl()` TextRun objects for each resume section (headline, summary, skill lines, bullets), allowing fine-grained, sentence-level highlighting of only the JD-tailored spans.
> Source: batch_build_resumes.js; SKILL.md lines 48–57

---

## Quick Reference
<a id="quickref"></a>

- **Master Skill File**: `resume-tailor/resume-tailor/SKILL.md`
- **docx-js helpers**: `build_resume.js` → `r()` = plain, `hl()` = yellow highlight
- **Output naming**: `Resume_<Company>_<RoleShort>.docx`
- **Honesty Gate buckets**: True Overlap → Transferable (with parenthetical) → Gap (do not add)
- **Seniority mismatch trigger**: ≥ 1.5× candidate's actual experience → stop & show gap table
- **Section tailoring order**: Headline → Summary → Skills → Experience Bullets (never change titles/dates/companies)
- **Hard Rule #1**: Never invent experience, metrics, or tools
- **Hard Rule #6**: Always highlight every tailored change

---

## Reference & Resources
<a id="reference"></a>

| Resource | Path |
|----------|------|
| Resume Tailor Skill | [SKILL.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/resume-tailor/resume-tailor/SKILL.md) |
| Visual Style Guide | [style_guide.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/resume-tailor/resume-tailor/references/style_guide.md) |
| docx-js Builder Script | [build_resume.js](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/resume-tailor/resume-tailor/scripts/build_resume.js) |
| Batch Generator Script | [batch_build_resumes.js](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/output/batch_build_resumes.js) |
| Jobs CSV | [linkedin_jobs_test_engineer_page1.csv](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/linkedin_jobs_test_engineer_page1.csv) |
| Implementation Plan | [implementation_plan.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/implementation_plan.md) |
| Walkthrough | [walkthrough.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_04_AIJobKit/walkthrough.md) |
