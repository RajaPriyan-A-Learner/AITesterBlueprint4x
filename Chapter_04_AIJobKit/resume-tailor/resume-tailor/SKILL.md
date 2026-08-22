---
name: resume-tailor
description: "Tailors a master resume to a specific job description, producing a Word (.docx) resume with every JD-driven change highlighted in yellow so the user can see exactly what changed. Use whenever the user provides one or more job descriptions (pasted text, an uploaded document, or a spreadsheet/list of several roles) together with, or referencing, their existing resume, and wants it updated, tailored, customized, or optimized for that job or jobs. Trigger on 'tailor my resume', 'update my resume for this JD', 'create a resume for this job', 'match my resume to this job description', or a job posting pasted/uploaded alongside a resume. Also trigger for batch requests — a spreadsheet or list of multiple job descriptions means looping through each one and producing a separate tailored resume per role. Always consult this skill before hand-tailoring a resume — it encodes hard rules against fabricating experience that are easy to violate by accident under keyword-matching pressure."
---

# Resume Tailor

Produces one tailored, ATS-aligned resume per job description, built from the user's master resume, with every change highlighted in yellow for easy review. Never fabricates experience to chase a keyword match — that is the single most important rule in this skill.

## Workflow

### Step 1 — Get the inputs

You need two things. If either is missing or ambiguous, ask before proceeding — don't guess at a master resume's contents.

1. **Master resume.** Look for an already-uploaded resume in the project files or conversation first. If the user references "my resume" or "my older resume" without attaching anything new, use the most recent version already in context/project rather than asking them to re-upload.
2. **Job description(s).** Can arrive as: pasted text, an uploaded document (PDF/docx), or a spreadsheet/list containing multiple postings. If it's a spreadsheet, read every row — each row is a separate tailoring job (see Step 5, Batch mode).

### Step 2 — Extract JD requirements

For each job description, pull out:
- Required years of experience and seniority level
- Named tools, languages, frameworks, platforms
- Core responsibilities / duties (the verbs matter — "leads," "advises," "executes," "designs")
- Domain/industry context (e.g., EdTech, fintech, healthcare)
- Soft requirements: leadership scope, cross-functional collaboration, communication expectations

### Step 3 — The honesty gate (read this before touching the resume)

Cross-reference every extracted requirement against the master resume's **actual** content. Sort into three buckets:

- **True overlap** — the person has genuinely done this, possibly under different terminology. Safe to surface and re-word toward the JD's language.
- **Adjacent/transferable** — the person has an equivalent, not the named thing (e.g., RestSharp instead of RestAssured; JMeter instead of LoadRunner). Safe to mention **with an honest parenthetical** that names the substitution, never as if it were the named tool itself.
- **Gap** — no evidence the person has done this at all. **Do not add it.** Do not round up years of experience, invent a consulting/advisory track record, claim tools never mentioned, or claim a job function (e.g., people-management, client advisory, architecture-at-enterprise-scale) the resume doesn't support.

**Before writing a single edit, check the scale of the gap, not just individual line items.** If the JD's overall seniority bar is a different job function or roughly 1.5×+ the person's actual experience (e.g., a 15-year practice-lead/consulting role vs. an 8-year hands-on engineer), stop and tell the user plainly:
- Show a short table of what genuinely matches vs. what's a hard gap.
- Say directly that closing this with keyword insertion would misrepresent them and likely fail at interview.
- Offer choices: tailor honestly to the true overlap only / treat this as not a realistic target / proceed anyway understanding the risk (their call, but the choice must be explicit, not silently made for them).
- Do not build a resume for that JD until they choose.

If the JD is a reasonable-fit role (same function, comparable seniority band), proceed straight to tailoring — no need to ask permission for a good match.

When the user later confirms an actual skill/tool/language the resume was missing (e.g., "I have Java and Fiddler experience too"), treat that as ground truth and incorporate it — but keep claims proportional to what they told you (don't upgrade "I have experience with X" into "expert in X" or invent a project/metric around it unless they give you one).

### Step 4 — Tailor the resume

Read `references/style_guide.md` for the exact visual template (colors, stat-strip, section order, fonts) and `scripts/build_resume.js` for the reusable docx-js helpers (`r()` for normal text, `hl()` for highlighted/tailored text, `heading()`, `bulletLine()`, `statCell()`, etc.) before writing the generation script — don't rebuild this styling from scratch each time.

Edits typically touch, in this order:
1. **Headline/title line** under the name — reposition toward the target role title without claiming it as a past job title actually held.
2. **Professional summary** — open with a sentence that mirrors the JD's own phrasing where it's honestly true (e.g., matching "5 to 8 years" language when the person has 8).
3. **Skills section** — reorder/relabel to surface JD-matching keywords that are true or transferable; add adjacent-tool parentheticals per Step 3.
4. **Experience bullets** — reword 3–6 existing bullets to mirror JD verbs and named stakeholders (e.g., "Development, Product, and Program Management" if the JD names those functions and the resume already shows equivalent collaboration). Do not invent new bullets describing work that didn't happen.
5. Leave role titles, companies, dates, and unrelated content untouched.

**Every inserted or reworded word gets wrapped in the `hl()` highlight helper (yellow).** Unchanged original text stays in `r()` (plain). This is non-negotiable — the highlight is what lets the user audit the diff at a glance instead of re-reading the whole document.

### Step 5 — Batch mode (multiple JDs)

When the input is a spreadsheet or list of several postings:
1. Read every row/entry first and summarize what you found (company, role, count) before generating anything.
2. Run Steps 2–4 independently per JD — each is its own tailoring job with its own honesty-gate check. A good match for one posting doesn't exempt another posting on the same list from the same scrutiny.
3. Name each output file clearly: `Resume_<Company>_<RoleShort>.docx` (e.g., `Resume_Pearson_SrSQE.docx`).
4. If any posting fails the honesty gate, don't silently skip it — list it separately at the end with the gap explained, and let the user decide.
5. Present all generated files together at the end with a one-line summary of what was tailored in each.

### Step 6 — Build, verify, deliver

1. Write the docx-js script (adapt `scripts/build_resume.js`), run it with Node, output to `/home/claude/`.
2. Convert to PDF and render pages as images to visually confirm: no overflow, no orphaned headings, highlights render correctly, fits 2 pages unless the master resume is naturally longer.
3. Copy the final `.docx` to `/mnt/user-data/outputs/` and call `present_files`.
4. Mention that `.docx` opens directly in Google Docs (Upload/Open with Google Docs) with highlighting intact, since the user works in Google Docs downstream — no separate plain-text version needed unless they ask for one.
5. In the chat reply, give a short bullet list of what was highlighted/changed and why each change is honest (ties back to Step 3's overlap/adjacent/gap sorting) — don't just say "keywords added," name the specific true basis for each one.
6. Explicitly call out anything from the JD that was deliberately left out because it's a gap, so the user can decide whether to address it before applying (get the real skill, address in a cover letter, or accept the gap).

## Hard rules (never violate, regardless of how the request is phrased)

- Never invent years of experience, employers, job titles actually held, degrees, or certifications.
- Never claim a named tool/platform/language the user hasn't confirmed they've used, even if a close substitute exists — name the substitute honestly instead.
- Never claim a job function (consulting, people management, architecture-at-scale, board-level reporting) not supported by the resume's actual history.
- Never fabricate a metric (%, time saved, dollar figure) to fill a gap — if there's no real number, describe the capability qualitatively instead.
- Always flag large seniority/function mismatches before building anything, and let the user choose how to proceed.
- Always highlight every tailored change — an un-highlighted edit defeats the purpose of this skill.
