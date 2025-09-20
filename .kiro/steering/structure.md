# Project Structure

## Repository Layout
```
infinite-crafter/
├── .git/                           # Git version control
├── .kiro/                          # Kiro AI assistant configuration
│   └── steering/                   # AI guidance documents
├── README.md                       # Project documentation and installation guide
└── infinite-craft-helper.user.js  # Main userscript file
```

## File Organization

### Main Script (`infinite-craft-helper.user.js`)
- **Userscript header**: Metadata, version, URLs, permissions
- **IIFE wrapper**: Self-executing function for scope isolation
- **Core functions**:
  - `createControlPanel()`: UI element creation
  - `addStyles()`: CSS injection
  - `makeDraggable()`: Drag functionality
  - `init()`: Initialization and DOM ready handling

### Code Structure Patterns
- **Functional approach**: Discrete functions for each responsibility
- **DOM manipulation**: Direct createElement and style assignment
- **Event handling**: Standard addEventListener patterns
- **CSS-in-JS**: Inline styles with cssText for dynamic styling
- **Progressive enhancement**: Graceful loading with readyState checks

## Naming Conventions
- **Functions**: camelCase (e.g., `createControlPanel`, `makeDraggable`)
- **Variables**: camelCase (e.g., `isDragging`, `currentX`)
- **CSS classes**: kebab-case (e.g., `panel-header`, `panel-content`)
- **IDs**: kebab-case with prefix (e.g., `infinite-craft-control-panel`)

## Extension Points
- **Panel content**: Modify `panel-content` div in `createControlPanel()`
- **Styling**: Add CSS rules in `addStyles()` function
- **Event handlers**: Add listeners in `init()` or create new functions
- **Version updates**: Update header `@version` and display version

## Development Guidelines
- Keep all code in single userscript file (legacy - transitioning to multi-file with build system)
- Use vanilla JavaScript only (no external dependencies)
- Maintain backward compatibility with older browsers
- Follow userscript best practices for security and performance

## File Size and Focus Policy (Multi-File Development)
- **Maximum file size**: 300 lines per source file
- **Recommended size**: 150-200 lines per file
- **Function limits**: Maximum 50 lines per function, 30 lines recommended
- **Single responsibility**: Each file should have one clear purpose
- **Feature-based splitting**: Group related functionality together
- **Layer-based separation**: Separate UI, business logic, and utilities
- **Dependency minimization**: Reduce cross-file dependencies where possible
- **Clear interfaces**: Well-defined exports and imports between modules