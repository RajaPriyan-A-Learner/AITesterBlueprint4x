# Resume Visual Style Guide

This is the default visual template for generated resumes. Reuse it for every tailored version so all resume outputs look consistent across job applications. Adjust only if the user explicitly asks for a different look.

## Colors
- Navy (headings, name, accents): `1F3864`
- Slate (subheadings, dates, taglines): `44546A`
- Light background (stat-strip cells): `EEF1F6`
- Body text: `222222`
- Highlight for JD-tailored insertions: yellow (`HighlightColor.YELLOW` in docx-js)

## Font
Calibri throughout. Name ~36pt, title line ~22pt bold, section headings ~21pt bold uppercase with a navy bottom border, body text ~20pt (10pt), stat numbers ~26pt bold, stat labels ~14pt bold.

## Page setup
A4 default (or Letter if the user's target region uses it — ask if unclear). Margins ~620 twips (~0.43") on all sides to maximize usable space without looking cramped.

## Section order (default — keep unless resume content demands otherwise)
1. **Name** (centered, bold, navy)
2. **Title/headline line** (centered, bold, slate) — 2–3 role descriptors separated by `·`
3. **Contact line** (centered, small) — phone · email · location · LinkedIn
4. **Stat strip** — a 4–6 cell table of the resume's headline metrics (years experience, top 3–5 quantified achievements), light-navy-bordered cells with light background
5. **Professional Summary** — 2–3 short paragraphs, not one wall of text
6. **Core Technical Skills** — grouped into 4–6 labeled lines (e.g., "Automation & Testing:", "Languages, APIs & Data:"), not one long undifferentiated keyword dump
7. **Differentiator Projects** (if applicable — e.g., a standout side project or initiative that doesn't fit neatly into a role) — placed early, right after skills, if it's a genuine competitive edge relevant to the target roles
8. **Professional Experience** — reverse chronological. Each role: bold title | company, right-tabbed date range, italic one-line context/subline, then 5–8 tightly written bullets max per role (trim ruthlessly — a 13-bullet role reads as noise, not achievement)
9. **Key Achievements** (optional, 3–4 bullets of standout recognitions not already covered in Experience)
10. **Certifications**
11. **Education**

## Bullet-writing pattern
Every experience bullet should follow: **action verb → method/tooling → quantified outcome**. E.g. "Architected a C# / Selenium WebDriver / SpecFlow BDD hybrid framework with 4–5-worker parallel execution, cutting regression runtime by 65%." Cut bullets that only restate a tool name with no outcome attached.

## Stat strip guidance
Pick the 4–6 numbers a hiring manager would remember after a 10-second skim — not every metric in the resume, just the ones that anchor the story (years of experience, the biggest coverage/defect/velocity/cost numbers).

## Highlighting convention (critical — see SKILL.md Step 4)
- Plain/unchanged text: normal run, no highlight.
- Any word, phrase, or clause added or reworded specifically to match a job description: wrapped in a yellow highlight run.
- Don't highlight entire paragraphs if only a clause changed — highlight only the actual inserted/reworded span so the diff stays legible.
