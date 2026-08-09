---
name: Go Pikachu
description: When the user says "Go Pikachu", automatically stage all changes, commit with a smart message, and push to GitHub. This is the user's quick-deploy shortcut.
---

# ⚡ Go Pikachu — Commit & Push to GitHub

When the user says **"Go Pikachu"** (case-insensitive), execute the following Git workflow. Ask for branch confirmation before pushing.

## Pre-Tool Use Hook: Autonomous Knowledge Base Generator

Before executing any Git commands, you MUST execute the Knowledge Base generation workflow:
1. **Read Instructions**: Review `references/SKILL_KB_Generator.md` (located in this skill folder) to understand the KB generation requirements.
2. **Execute Hook**: Autonomously scan Chapter folders, extract content, and generate/update the `IQ_Notes/KB_XX_*.md` files as specified.
3. **Validate**: Ensure the KB files are successfully created and saved before proceeding.

## Post Tool Use Hook: Interview Q&A Enrichment

After ALL KB files have been generated/updated, and BEFORE executing any Git commands, you MUST update the Interview Q&A file:

1. **Scan All Knowledge Sources**: Read through the following to gather new insights:
   - All `IQ_Notes/KB_XX_*.md` files (newly generated/updated KBs).
   - All `Chapter_XX_*/` folder content (templates, examples, walkthroughs, implementation plans).
   - All `Prompt_Engineering_Templates/` folders (numbered template + example pairs).
   - All `IQ_Notes/Prompt_Frameworks.md` and `IQ_Notes/Interview_Notes_Prompt_Engineering.md`.

2. **Update the Interview File**: Open `IQ_Notes/Interview_QA_Lead_SDET_Prompt_Engineering.md` and:
   - Add NEW questions and answers for any topics covered in the repo that are NOT yet reflected in the file.
   - Enrich EXISTING answers with deeper insights if new KB content provides additional depth.
   - Ensure every framework, template, anti-hallucination technique, and design pattern present in the repo has at least one corresponding interview Q&A.
   - Maintain the existing section structure (Section A through D) and append new questions at the end of the appropriate section.

3. **Quality Rules**:
   - Every new Q&A must reference specific repo files/templates by name.
   - Answers must be written at Lead SDET depth (8+ YOE, product-based companies).
   - Do NOT duplicate existing questions — only ADD or ENRICH.
   - Do NOT remove any existing content.

4. **Validate**: Confirm the file has been updated and report a summary of new Q&As added.

## Git Workflow Steps

1. **Check status**: Run `git status` to see what has changed.
2. **Stage all changes**: Run `git add -A` to stage everything (new files, modifications, deletions).
3. **Generate a commit message**: Based on the `git diff --staged --stat` output, write a concise, descriptive commit message. Use an emoji prefix that matches the change type:
   - 📝 for documentation changes
   - ✨ for new features
   - 🐛 for bug fixes
   - ♻️ for refactoring
   - 🎨 for styling/UI changes
   - 🔧 for configuration changes
   - 🚀 for deployments or releases
   - 📦 for dependency updates
   - 🗑️ for deletions
   - 🔀 for mixed changes
4. **Commit**: Run `git commit -m "<generated message>"`.
5. **Select push target branch**: Ask the user which branch to push to:
   - Option A: Push to an existing remote branch (list available branches)
   - Option B: Create and push to a new feature branch
   - User confirms their choice before proceeding
6. **Push**: Run `git push` to the selected branch with user approval.
7. **Report**: Confirm success with a summary of what was committed and pushed.

## Rules

- Do NOT ask the user for a commit message — generate one automatically.
- DO ask user to select push target branch before pushing (existing remote or new feature branch).
- Require user approval before executing the push.
- If there are no changes to commit, inform the user: "Nothing to commit — working tree is clean! ⚡"
- If push fails (e.g., authentication issue, remote rejection), report the error clearly and suggest fixes.
- Always run commands in the workspace root directory.
- **Model Preference**: When executing the Pre-Tool Use Hook (KB generation) and Post Tool Use Hook (Interview Q&A enrichment), the agent MUST use **Claude Sonnet or Claude Opus** models. These hooks require deep reasoning, comprehensive content extraction, and nuanced interview-level writing that benefits from higher-capability models. If the current model is not Claude Sonnet/Opus, prompt the user to switch before executing the hooks.

## Example Trigger

User says:
> Go Pikachu

Agent responds by executing the full commit & push workflow and reporting results.
