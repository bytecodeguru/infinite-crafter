# Update Feature Branch Hook

## Trigger
On file save (infinite-craft-helper.user.js)

## Description
Automatically increments dev version, commits and pushes changes to the current feature branch when the userscript is modified.

## Instructions
When the userscript file is saved and we're on a feature branch:

1. Check if we're currently on a feature branch (not main)
2. If on a feature branch:
   - Use the branch helper to increment the dev version (1.minor.dev format)
   - Stage the userscript file
   - Commit with version increment message
   - Push to the feature branch
   - Inform user of the new version and that Tampermonkey will auto-update
3. If on main branch, warn user to create a feature branch first

## Version Policy
- Feature branches use format: `1.minor.dev`
- Each save increments the `dev` number
- Example: `1.1.0` -> `1.1.1` -> `1.1.2`

## Example Commands
```bash
# Check current branch
git branch --show-current

# If on feature branch, use branch helper
node .kiro/scripts/branch-helper.js auto-commit
```

## Safety Checks
- Only auto-commit if on a feature branch
- Don't auto-commit if there are other staged changes
- Provide clear feedback about version increment and commit