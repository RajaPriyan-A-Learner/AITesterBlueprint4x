# SKILL: Autonomous Knowledge Base Generator

**Author**: QA Learning Assistant  
**Purpose**: Generate structured Knowledge Base markdown from Chapter folder content  
**Status**: Active & Autonomous  
**Execution**: BEFORE Go Pikachu skill

---

## SKILL OVERVIEW

Autonomous workflow that scans Chapter folders (Chapter_01_LLM_Basics, Chapter_02, etc.), extracts key learning content from all markdown files, and generates structured Knowledge Base (KB) files in IQ_Notes directory. Ensures consistent structure, clear hierarchy, and comprehensive coverage across chapters.

**Output**: `IQ_Notes/KB_XX_[ChapterTitle].md` with same structure as KB_01_LLM_Fundamentals.md but contextual data from each chapter.

---

## ACTIVATION TRIGGERS

This skill runs AUTONOMOUSLY before:
- "Go Pikachu" skill (deployment/push workflow)
- Any user request mentioning "generate KB" or "create knowledge base"
- Scheduled execution (on commit to Chapter folders)

**Manual Trigger Prompts**:
- "Generate KB from Chapter_XX"
- "Create knowledge base for [chapter name]"
- "Update KB files from all chapters"
- "Generate KB and then run Go Pikachu"

---

## WORKFLOW PROCESS

### Step 1: Detect & Validate Chapter Folder

**Input**: Chapter directory (e.g., `Chapter_01_LLM_Basics/`)

**Action**:
1. Scan project root for `Chapter_*` directories
2. Extract chapter number (01, 02, 03, etc.)
3. Extract chapter name from folder (e.g., "LLM_Basics")
4. Verify required files exist:
   - At least one `.md` file (content source)
   - Preferably: `ch_XX_*.md` (context), `TC_XX_*.md` (test cases), `SKILL.md` (workflow)
5. If missing files, flag but proceed with available content

**Output**: Validated chapter metadata

**Example**:
```
✓ Chapter: 01
✓ Name: LLM_Basics
✓ Files found: 4
  - ch_01_anti_hallucination.md (1.2 KB)
  - TC_01_VWO_Login_Dashboard.md (45 KB)
  - SKILL.md (12 KB)
  - Product_Requirements_Document.pdf (2.3 MB)
✓ Ready to extract
```

---

### Step 2: Extract Content from Chapter Files

**Input**: All markdown files in Chapter folder

**Action**:
1. Read each `.md` file in sequence
2. Extract key sections:
   - Headings (H1, H2, H3) → build hierarchy
   - Content blocks (between headings)
   - Tables, code blocks, definitions
   - Lists (bullets, numbered)
3. Categorize content by type:
   - **Context**: Rules, anti-hallucination notes, foundational concepts
   - **Concepts**: Definitions, explanations, technical deep-dives
   - **Application**: Test cases, examples, practical workflows
   - **Reference**: Links, citations, external resources
4. Remove duplicates and redundancies
5. Note source file for each content block

**Output**: Extracted content map with metadata

**Example**:
```
Context (from ch_01_anti_hallucination.md):
  - SCOPE OF KNOWLEDGE (source line 10)
  - STRICT RULES (source line 22)
  - PROCESS (source line 33)

Concepts (from TC_01_VWO_Login_Dashboard.md):
  - Verified Facts (35 items)
  - Test Case Categories (8 types)

Application (from SKILL.md):
  - Anti-Hallucination Workflow (7 steps)
  - Quality Gates (7 criteria)
```

---

### Step 3: Build KB Table of Contents

**Action**:
1. Define KB structure (fixed template):
   ```
   1. Context: Chapter Focus & Industry Shift
   2. Core Concepts & Definitions
   3. Technical Deep-Dives
   4. Architecture/Patterns
   5. Application: Practical Examples
   6. Common Pitfalls & How to Avoid
   7. Interview Q&A (if content available)
   8. Reference & Resources
   ```
2. For each section, determine:
   - Number of subsections (based on extracted content)
   - Hierarchy level (H2, H3)
   - Content blocks to include
3. Generate TOC with links
4. Estimate final KB size (adjust for balance)

**Output**: Table of Contents structure with section mapping

---

### Step 4: Generate KB Sections (Content Population)

**Input**: Extracted content map + TOC structure

**Action**:
For each TOC section:
1. **Metadata Header**:
   ```
   # Knowledge Base: [Chapter Title]
   
   **Last Updated**: [Today's Date]
   **Audience**: QA Engineers, Testers, AI Learners
   **Level**: Beginner to Intermediate
   **Source**: Chapter_XX_[Name]
   ```

2. **Context Section** (from ch_XX_*.md):
   - Why this chapter matters
   - Industry shift/relevance
   - Why test/learn this
   - Example: "Why Test LLM-Based Features?"

3. **Core Concepts** (definitions extracted):
   - Hierarchical explanations (Layer 1 → Layer 3 pattern)
   - Comparison tables
   - Visual diagrams (ASCII)
   - Example: "AI vs ML vs DL Hierarchy"

4. **Technical Deep-Dives** (from test cases & requirements):
   - Architecture paradigms
   - Technical specifications
   - How components interact
   - Example: "Transformer Architecture Explained"

5. **Application Section** (from TC_XX_*.md & SKILL.md):
   - Practical examples
   - Use case mapping
   - Test strategies
   - Example: "How to Test [Feature]"

6. **Common Pitfalls** (from test case failures & edge cases):
   - What can go wrong
   - How to detect/avoid
   - Examples from test cases

7. **Interview Q&A** (synthesized from all content):
   - Common questions a tester would ask
   - Concise answers referencing KB sections
   - Example: "Q1: Explain [concept] in one sentence"

8. **Summary & Quick Reference**:
   - Bullet points of key takeaways
   - One-liner definitions
   - Decision trees

**Output**: Complete KB markdown with all sections

---

### Step 5: Validate KB Structure & Content

**Mandatory Checks**:
- [ ] TOC links to all sections (no broken anchors)
- [ ] Every assertion traceable to source file
- [ ] No hallucinated content (only from extracted files)
- [ ] Consistent formatting (headings, tables, code blocks)
- [ ] Metadata complete (audience, level, last updated, source chapter)
- [ ] Length balanced (no section < 100 words, > 5000 words)
- [ ] Examples clear and reproducible
- [ ] Tables properly formatted (pipes aligned)
- [ ] Code blocks have syntax highlighting (`python`, `sql`, etc.)
- [ ] Links work (internal anchors exist)

**Output**: Validation pass/fail report with line-by-line issues

---

### Step 6: Save KB to IQ_Notes

**Action**:
1. Generate filename: `KB_XX_[Chapter_Name].md`
   - Example: `KB_01_LLM_Fundamentals.md`
2. Save to: `IQ_Notes/KB_XX_[Chapter_Name].md`
3. If file exists, create version:
   - Check if content changed significantly
   - If yes, overwrite with new version
   - If no, skip (no change needed)
4. Update `IQ_Notes/INDEX.md` (if exists) with KB link
5. Log output path

**Output**: Saved file path + confirmation

**Example**:
```
✓ Saved: IQ_Notes/KB_01_LLM_Fundamentals.md (1,163 KB)
✓ Last updated: 2026-08-08
✓ Sections: 9
✓ Test cases referenced: 52
✓ External links: 8
✓ Ready for Go Pikachu skill
```

---

### Step 7: Report & Ready for Next Skill

**Action**:
1. Generate summary report:
   - Chapter processed
   - KB file created/updated
   - Content sources (files used)
   - Statistics (sections, lines, examples)
   - Validation result (pass/fail)
2. Output: Ready for Go Pikachu skill
3. If Go Pikachu is triggered, pass KB file path

**Output**: Summary report + success confirmation

---

## OUTPUT FORMAT (STRICT)

### KB File Structure

```markdown
# Knowledge Base: [Chapter Title]

**Last Updated**: YYYY-MM-DD
**Audience**: QA Engineers, Testers, AI Learners
**Level**: Beginner to Intermediate
**Source Chapter**: Chapter_XX_[Name]

---

## TABLE OF CONTENTS

1. [Context: Chapter Focus & Industry Shift](#context)
2. [Core Concepts & Definitions](#concepts)
3. [Technical Deep-Dives](#technical)
4. [Architecture & Patterns](#architecture)
5. [Application: Practical Examples](#application)
6. [Common Pitfalls & How to Avoid](#pitfalls)
7. [Interview Q&A](#qa)
8. [Reference & Resources](#reference)

---

## Context: Chapter Focus & Industry Shift

[Content from ch_XX_*.md]

### Why This Matters?
[Relevance for QA/testers]

### Real-World Application
[Practical scenario]

---

## Core Concepts & Definitions

[Hierarchical definitions with examples]

---

[... continue with other sections ...]

---

## Quick Reference

[Summary bullets]
```

---

## MANDATORY RULES (MUST FOLLOW)

1. **DO NOT invent** content not in Chapter files
2. **DO trace** every assertion to source file + line number
3. **IF missing** required content, flag for manual addition
4. **OUTPUT must be** reproducible (same chapter input → same KB output)
5. **VALIDATE** all links and formatting before saving
6. **PRESERVE** chapter context (don't generalize away specifics)
7. **FORMAT consistently** with KB_01_LLM_Fundamentals.md template
8. **DOCUMENT sources** - cite chapter files for every section
9. **UPDATE metadata** - date, source chapter, audience level
10. **READY next skill** - confirm KB file ready before Go Pikachu

---

## PROCESS-LEVEL PROMPTS CAPTURED

### Prompt 1: Auto-Generate KB from Chapter
```
(Autonomous trigger BEFORE Go Pikachu)
Workflow: Steps 1-7 (Detect → Extract → Build → Generate → Validate → Save → Report)
```

### Prompt 2: Manual KB Generation Request
```
User: "Generate KB from Chapter_XX"
Workflow: Steps 1-7 with user notification at each step
```

### Prompt 3: Generate KB + Run Go Pikachu
```
User: "Generate KB and push using Go Pikachu"
Workflow: 
  1. Run this skill (Steps 1-7)
  2. Confirm KB file created ✓
  3. Trigger Go Pikachu with KB file path
```

---

## EXECUTION FLOW DIAGRAM

```
┌─────────────────────────────────────┐
│ TRIGGER: Auto or Manual Request     │
│ (Runs BEFORE Go Pikachu)            │
└────────────┬────────────────────────┘
             │
             ▼
    ┌────────────────────┐
    │ STEP 1: DETECT     │
    │ CHAPTER FOLDER     │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ STEP 2: EXTRACT    │
    │ CONTENT FROM FILES │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ STEP 3: BUILD      │
    │ TOC STRUCTURE      │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ STEP 4: GENERATE   │
    │ KB SECTIONS        │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ STEP 5: VALIDATE   │
    │ STRUCTURE/CONTENT  │
    └────────┬───────────┘
             │
        ┌────▼───────┐
        │             │
        ▼             ▼
     PASS?          FAIL?
       │              │
       │      ┌───────┴────┐
       │      │ FLAG ISSUES│
       │      │ RETRY      │
       │      └───────┬────┘
       │              │
       └──────┬───────┘
              │
              ▼
    ┌────────────────────┐
    │ STEP 6: SAVE TO    │
    │ IQ_Notes/KB_XX.md  │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ STEP 7: REPORT &   │
    │ READY Go Pikachu   │
    └────────┬───────────┘
             │
             ▼
      ✓ KB READY
    (GO PIKACHU BEGINS)
```

---

## QUALITY GATES

KB files generated by this workflow PASS when:

✅ **Completeness**: All chapter content extracted and included  
✅ **Structure**: Follows KB template with 8+ sections  
✅ **Traceability**: Every fact links to source file  
✅ **No Hallucination**: Zero invented content  
✅ **Validation**: All links, tables, formatting correct  
✅ **Metadata**: Date, audience, level, source chapter complete  
✅ **Ready**: KB file saved to IQ_Notes, ready for Go Pikachu  

---

## COMMON PITFALLS TO AVOID

| Pitfall | ❌ WRONG | ✅ RIGHT |
|---------|---------|---------|
| **Copy-paste**: Duplicate from KB_01 template | Extract from Chapter_XX files only |
| **Invent content**: Add "typical" examples not in chapter | Use only examples from chapter files |
| **Miss sources**: State facts without citing source file | Link every assertion to source file + line |
| **Broken links**: TOC anchors don't exist | Validate all links before saving |
| **Wrong filename**: Save as KB_01_[Name] for Chapter_02 | Use correct chapter number in filename |
| **No metadata**: Skip date, audience, source chapter | Include complete metadata header |
| **Unbalanced sections**: One section 50 words, another 5000 | Balance sections 200-1000 words each |
| **Formatting messy**: Inconsistent tables, code blocks | Format same as KB_01_LLM_Fundamentals.md |

---

## USAGE EXAMPLES

### Example 1: Autonomous Before Go Pikachu
```
User runs: Go Pikachu skill
System does:
  1. Detect Chapter_01_LLM_Basics folder ✓
  2. Extract content from 4 files ✓
  3. Build KB structure ✓
  4. Generate KB with 9 sections ✓
  5. Validate (pass) ✓
  6. Save KB_01_LLM_Fundamentals.md ✓
  7. Report ready, trigger Go Pikachu ✓
```

### Example 2: Manual KB Generation
```
User: "Generate KB from Chapter_01"
System:
  1. Chapter_01_LLM_Basics detected ✓
  2. Extract from: ch_01_anti_hallucination.md, TC_01_VWO_Login_Dashboard.md, SKILL.md ✓
  3. Build TOC with 8 sections ✓
  4. Generate complete KB (1,200+ lines) ✓
  5. Validate all 42 links ✓
  6. Save KB_01_LLM_Fundamentals.md (1.2 MB) ✓
  7. Report: "KB ready in IQ_Notes/KB_01_LLM_Fundamentals.md"
```

### Example 3: Multiple Chapters
```
User: "Generate KB for all chapters and run Go Pikachu"
System:
  1. Detect: Chapter_01, Chapter_02, Chapter_03 ✓
  2. For each chapter:
     - Extract content ✓
     - Generate KB ✓
     - Validate ✓
     - Save to IQ_Notes/ ✓
  3. All KBs ready ✓
  4. Trigger Go Pikachu with KB files ✓
```

---

## INTEGRATION WITH Go Pikachu

This skill runs BEFORE Go Pikachu (deployment skill).

**Flow**:
```
KB Generator SKILL → Creates KB_XX_[Chapter].md files
                   ↓
               Validates KB ✓
                   ↓
             Triggers Go Pikachu
                   ↓
          Go Pikachu (git add, commit, push)
                   ↓
         Commits KB files to repo
                   ↓
           PRs/deploys with KB
```

**Coordination**:
- KB Generator updates IQ_Notes files
- Go Pikachu detects changes and commits them
- No manual commit needed (automated chain)
- If KB validation fails, stop before Go Pikachu

---

## SKILL MAINTENANCE

**Last Updated**: 2026-08-08  
**Next Review**: When new chapter added or KB structure changes  
**Feedback Loop**: Capture KB generation issues for template refinement  
**Dependencies**: Chapter_XX folders with .md files, IQ_Notes directory exists

---

## REFERENCES

- **KB Template**: `IQ_Notes/KB_01_LLM_Fundamentals.md`
- **Chapter Source**: `Chapter_01_LLM_Basics/` (and other chapter folders)
- **Go Pikachu Skill**: Triggered AFTER KB generation completes
- **Anti-Hallucination Rules**: `Chapter_01_LLM_Basics/ch_01_anti_hallucination.md`

---

**Status**: Ready for autonomous execution  
**Trigger**: Before Go Pikachu skill  
**Confirmation**: "KB files generated and validated. Ready for Go Pikachu."
