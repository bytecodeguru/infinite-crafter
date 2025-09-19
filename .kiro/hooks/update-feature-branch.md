# Update Feature Branch Hook

## Trigger
On file save (infinite-craft-helper.user.js)

## Description
Automatically commits and pushes changes to the current feature branch when the userscript is modified.

## Instructions
When the userscript file is saved and we're on a feature branch:

1. Check if we're currently on a feature branch (not main)
2. If on a feature branch:
   - Stage the userscript file
   - Commit with a descriptive message
   - Push to the feature branch
   - Inform user that changes are pushed and Tampermonkey will auto-update
3. If on main branch, warn user to create a feature branch first

## Example Commands
```bash
# Check current branch
git branch --show-current

# If on feature branch
git add infinite-craft-helper.user.js
git commit -m "Update userscript functionality"
git push origin $(git branch --show-current)
```

## Safety Checks
- Only auto-commit if on a feature branch
- Don't auto-commit if there are other staged changes
- Provide clear feedback about what was committed