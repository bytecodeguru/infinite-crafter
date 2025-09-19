# Create Feature Branch Hook

## Trigger
Manual button click

## Description
Creates a new feature branch and updates the userscript URLs to point to the feature branch for testing.

## Instructions
When the user wants to start working on a new feature:

1. Ask for the feature name (use kebab-case format)
2. Create and checkout the feature branch: `git checkout -b feature/{feature-name}`
3. Read the current userscript file
4. Update the @updateURL and @downloadURL to point to the feature branch
5. Update the @version to include the feature branch name (e.g., "1.0.0-feature-name")
6. Commit the URL changes to the feature branch
7. Push the feature branch to origin
8. Inform the user that they can now install/update the userscript from the feature branch URL

## Example Commands
```bash
git checkout main
git pull origin main
git checkout -b feature/auto-play-engine
# Update userscript URLs
git add infinite-craft-helper.user.js
git commit -m "Setup feature branch for auto-play-engine"
git push origin feature/auto-play-engine
```