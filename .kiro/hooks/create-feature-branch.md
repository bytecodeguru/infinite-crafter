# Create Feature Branch Hook

## Trigger
Manual button click

## Description
Creates a new feature branch with automatic version incrementing and updates the userscript URLs to point to the feature branch for testing.

## Instructions
When the user wants to start working on a new feature:

1. Ask for the feature name (use kebab-case format)
2. Use the branch helper to create the feature branch with proper versioning
3. The branch helper will:
   - Get the current main branch version
   - Increment the minor version and reset dev to 0 (e.g., 1.0.0 -> 1.1.0)
   - Create and checkout the feature branch
   - Update URLs to point to the feature branch
   - Commit and push the changes
4. Inform the user of the new version and installation URL

## Version Policy
- New feature branches increment the minor version: `1.0.0` -> `1.1.0`
- Dev version starts at 0 for new branches
- Each subsequent save will increment the dev number: `1.1.0` -> `1.1.1` -> `1.1.2`

## Example Commands
```bash
# Use the branch helper for automatic setup
node .kiro/scripts/branch-helper.js setup-feature auto-play-engine
```

## What This Creates
- Branch: `feature/auto-play-engine`
- Version: `1.1.0` (incremented from main branch)
- URLs: Point to the feature branch
- Ready for development with auto-incrementing dev versions