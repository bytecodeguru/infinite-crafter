# Branch-Based Development Strategy

## Overview
All new features and tasks should be developed on dedicated feature branches, not directly on main. This allows for safe testing and iteration before production deployment.

## Branch Naming Convention
- `feature/feature-name` - New features (e.g., `feature/auto-play-engine`)
- `fix/issue-description` - Bug fixes (e.g., `fix/dragging-performance`)
- `refactor/component-name` - Code refactoring (e.g., `refactor/ui-components`)

## Development Process

### 1. Starting New Work
```bash
# Always start from main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Userscript Configuration for Testing
When working on a feature branch, update the userscript header URLs to point to the feature branch:

```javascript
// @updateURL    https://raw.githubusercontent.com/username/repo/feature/your-feature-name/infinite-craft-helper.user.js
// @downloadURL  https://raw.githubusercontent.com/username/repo/feature/your-feature-name/infinite-craft-helper.user.js
```

### 3. Testing Workflow
- Push feature branch to GitHub
- Install/update userscript in Tampermonkey using feature branch URL
- Test functionality on https://neal.fun/infinite-craft/
- Iterate and push changes to feature branch
- Tampermonkey will auto-update from feature branch

### 4. Production Release
- When feature is complete and tested, merge to main
- Update userscript URLs back to main branch
- Push final version to main
- Users get production update

## Branch Protection
- main branch should only receive tested, complete features
- All development happens on feature branches
- Feature branches can be deleted after merging to main

## Version Strategy
- Feature branches: Use version like `1.0.0-feature-name` or `1.0.0-dev`
- Main branch: Use semantic versioning `1.0.0`, `1.1.0`, etc.
- This helps distinguish between development and production versions