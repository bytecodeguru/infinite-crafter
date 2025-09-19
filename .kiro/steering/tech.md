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

### Testing
```bash
# No automated testing - manual browser testing required
# 1. Install script in Tampermonkey
# 2. Navigate to https://neal.fun/infinite-craft/
# 3. Verify control panel appears and is draggable
```

### Deployment
```bash
# Update version in userscript header
# Commit and push to main branch
git add .
git commit -m "Update to v1.0.x"
git push origin main
# Users receive automatic updates via Tampermonkey
```

### Version Management
- Update `@version` in userscript header
- Update version display in panel HTML
- Update changelog in README.md

## Browser Compatibility
- Chrome, Firefox, Safari, Edge with userscript manager
- Modern CSS features: backdrop-filter, CSS Grid, Flexbox
- ES6+ JavaScript features supported