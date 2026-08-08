---
name: Go Pikachu
description: When the user says "Go Pikachu", automatically stage all changes, commit with a smart message, and push to GitHub. This is the user's quick-deploy shortcut.
---

# ⚡ Go Pikachu — Commit & Push to GitHub

When the user says **"Go Pikachu"** (case-insensitive), execute the following Git workflow. Ask for branch confirmation before pushing.

## Steps

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

## Example Trigger

User says:
> Go Pikachu

Agent responds by executing the full commit & push workflow and reporting results.
