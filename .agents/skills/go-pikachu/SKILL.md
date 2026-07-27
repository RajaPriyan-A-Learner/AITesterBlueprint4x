---
name: Go Pikachu
description: When the user says "Go Pikachu", automatically stage all changes, commit with a smart message, and push to GitHub. This is the user's quick-deploy shortcut.
---

# ⚡ Go Pikachu — Commit & Push to GitHub

When the user says **"Go Pikachu"** (case-insensitive), execute the following Git workflow immediately without asking for confirmation.

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
5. **Push**: Run `git push` to push to the remote (typically `origin main`).
6. **Report**: Confirm success with a summary of what was committed and pushed.

## Rules

- Do NOT ask the user for a commit message — generate one automatically.
- Do NOT ask for confirmation — just do it.
- If there are no changes to commit, inform the user: "Nothing to commit — working tree is clean! ⚡"
- If push fails (e.g., authentication issue, remote rejection), report the error clearly and suggest fixes.
- Always run commands in the workspace root directory.

## Example Trigger

User says:
> Go Pikachu

Agent responds by executing the full commit & push workflow and reporting results.
