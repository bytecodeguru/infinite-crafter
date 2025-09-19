# Technology Stack

## Core Technologies
- **JavaScript (ES6+)**: Main development language using modern syntax
- **Tampermonkey/Greasemonkey**: Userscript execution environment
- **CSS3**: Styling with modern features (backdrop-filter, gradients, transforms)
- **HTML5**: DOM manipulation and element creation

## Build System
- **No build system required**: Direct JavaScript userscript deployment
- **Version control**: Git with GitHub hosting
- **Distribution**: Raw GitHub URLs for direct installation

## Key Libraries & Frameworks
- **No external dependencies**: Pure vanilla JavaScript implementation
- **Browser APIs**: DOM manipulation, event handling, CSS transforms
- **Userscript APIs**: Tampermonkey metadata and update system

## Development Workflow

### Branch Strategy
- **main**: Production-ready releases only
- **feature branches**: All development work (e.g., `feature/auto-play`, `feature/ui-improvements`)
- **testing**: Use feature branch URLs for Tampermonkey testing

### Testing
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Update userscript to point to feature branch
# Modify @updateURL and @downloadURL in userscript header

# 3. Install/update script in Tampermonkey
# 4. Navigate to https://neal.fun/infinite-craft/
# 5. Verify functionality works as expected
```

### Deployment
```bash
# Feature development
git checkout -b feature/feature-name
# Make changes, test with feature branch URL
git add .
git commit -m "Implement feature-name"
git push origin feature/feature-name

# When ready for production
git checkout main
git merge feature/feature-name
git push origin main
# Update userscript URLs back to main branch
```

### Version Management
- Update `@version` in userscript header for releases
- Use branch-specific versions for testing (e.g., `1.0.0-feature-branch`)
- Update version display in panel HTML
- Update changelog in README.md
- Switch URLs between feature branch and main for testing vs production

## Browser Compatibility
- Chrome, Firefox, Safari, Edge with userscript manager
- Modern CSS features: backdrop-filter, CSS Grid, Flexbox
- ES6+ JavaScript features supported