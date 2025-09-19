# Merge Feature to Main Hook

## Trigger
Manual button click

## Description
Merges a completed feature branch to main and updates userscript URLs back to main branch for production release.

## Instructions
When the user is ready to release a feature to production:

1. Ensure all changes are committed and pushed to the feature branch
2. Update the userscript URLs back to main branch
3. Update the @version to a proper semantic version (remove feature branch suffix)
4. Commit the production-ready changes to the feature branch
5. Switch to main branch and pull latest changes
6. Merge the feature branch into main
7. Push main branch to origin
8. Optionally delete the feature branch (ask user first)
9. Inform user that the production version is now available

## Example Commands
```bash
# Update URLs to main branch and commit
git add infinite-craft-helper.user.js
git commit -m "Prepare for production release"
git push origin feature/feature-name

# Merge to main
git checkout main
git pull origin main
git merge feature/feature-name
git push origin main

# Optionally clean up
git branch -d feature/feature-name
git push origin --delete feature/feature-name
```